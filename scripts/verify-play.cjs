const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const config = require("../public/data/play.json");
const base = process.env.PORTFOLIO_BASE_URL || "http://localhost:3000";
const dir = path.resolve(
  process.env.PORTFOLIO_PLAY_QA_DIR || ".artifacts/play-redesign/qa",
);
fs.mkdirSync(dir, { recursive: true });

async function range(page, name, target) {
  const input = page.getByRole("slider", { name: new RegExp(name) });
  const min = Number(await input.getAttribute("min")),
    max = Number(await input.getAttribute("max")),
    step = Number((await input.getAttribute("step")) || 1);
  await input.focus();
  const fromEnd = max - target < target - min;
  await input.press(fromEnd ? "End" : "Home");
  const count = (fromEnd ? max - target : target - min) / step;
  for (let i = 0; i < count; i++)
    await input.press(fromEnd ? "ArrowLeft" : "ArrowRight");
  assert.equal(Number(await input.inputValue()), target);
}

(async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.PORTFOLIO_BROWSER_EXECUTABLE
      ? { executablePath: process.env.PORTFOLIO_BROWSER_EXECUTABLE }
      : {}),
  });
  try {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1050 },
      colorScheme: "light",
      acceptDownloads: true,
    });
    const page = await context.newPage(),
      errors = [];
    page.setDefaultNavigationTimeout(120000);
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(base + "/play", { waitUntil: "networkidle" });
    assert.equal(await page.getByRole("tabpanel").count(), 1);
    await page
      .getByRole("button", { name: "Check my eye", exact: true })
      .click();
    await page.getByText(/Almost in focus/).waitFor();
    await page
      .getByRole("button", { name: "Need a hint?", exact: true })
      .click();
    assert(await page.getByText(/20px of space/).count());
    await range(page, "Breathing room", config.pixelRounds[0].target.space);
    await range(page, "Corner softness", config.pixelRounds[0].target.radius);
    await range(page, "Button width", config.pixelRounds[0].target.width);
    await page
      .getByRole("button", { name: "Check my eye", exact: true })
      .click();
    await page.getByText("100% · Good eye!", { exact: true }).waitFor();
    assert.equal(
      await page.getByLabel("Good eye: earned", { exact: true }).count(),
      1,
    );
    await page.screenshot({
      path: path.join(dir, "pixel-solved-light.png"),
      fullPage: true,
    });
    await page.getByRole("button", { name: "Next study", exact: true }).click();
    assert.equal(
      await page
        .getByRole("heading", {
          name: config.pixelRounds[1].title,
          exact: true,
        })
        .count(),
      2,
    );
    assert.equal(
      Number(
        await page.getByRole("slider", { name: /Breathing room/ }).inputValue(),
      ),
      config.pixelRounds[1].initial.space,
    );
    console.log(
      "PASS Pixel Eye scoring, keyboard sliders, hints, new studies, and earned stamp",
    );

    await page.getByRole("tab", { name: /Signal Path/ }).click();
    await page
      .getByRole("button", { name: "Send a signal", exact: true })
      .click();
    await page
      .getByText("There’s a loose connection.", { exact: true })
      .waitFor();
    const tile0 = page.locator('[data-tile="0"]'),
      tile1 = page.locator('[data-tile="1"]');
    await tile0.focus();
    await page.keyboard.press("ArrowRight");
    assert(await tile1.evaluate((e) => e === document.activeElement));
    await page.keyboard.press("Enter");
    assert.equal(await tile1.getAttribute("data-rotation"), "1");
    // Independently specified route: input -> Validate -> Sheets -> Gmail -> output.
    const solution = [1, 1, 2, 3, 0, 0, 2, 1, 0];
    for (let i = 0; i < solution.length; i++) {
      const tile = page.locator(`[data-tile="${i}"]`),
        current = Number(await tile.getAttribute("data-rotation"));
      for (let turn = 0; turn < (solution[i] - current + 4) % 4; turn++)
        await tile.click();
    }
    await page
      .getByRole("button", { name: "Send a signal", exact: true })
      .click();
    assert(await tile0.isDisabled());
    await page.getByText("Flow state, achieved.", { exact: true }).waitFor();
    assert.equal(
      await page.getByLabel("Flow state: earned", { exact: true }).count(),
      1,
    );
    await page.screenshot({
      path: path.join(dir, "signal-solved-light.png"),
      fullPage: true,
    });
    await page
      .getByRole("button", { name: "Reset board", exact: true })
      .click();
    assert.equal(
      await tile0.getAttribute("data-rotation"),
      String(config.signal.tiles[0].rotation),
    );
    assert.equal(
      await page.getByLabel("Flow state: earned", { exact: true }).count(),
      1,
    );
    console.log(
      "PASS real circuit failure/success, directional keyboard control, signal animation, reset, and best result",
    );

    await page.getByRole("tab", { name: /Pixel Eye/ }).click();
    assert.equal(
      await page
        .getByRole("heading", {
          name: config.pixelRounds[1].title,
          exact: true,
        })
        .count(),
      2,
    );
    console.log("PASS unfinished experiments survive tab changes");
    await page.getByRole("tab", { name: /Merch Lab/ }).click();
    await page
      .getByRole("button", { name: "Use Electric sound artwork", exact: true })
      .click();
    await page.getByRole("button", { name: "Lilac tee", exact: true }).click();
    await range(page, "Print size", 220);
    assert.equal(
      await page
        .getByRole("img", {
          name: "Electric sound artwork on a lilac T-shirt",
          exact: true,
        })
        .count(),
      1,
    );
    const downloaded = page.waitForEvent("download");
    await page
      .getByRole("button", { name: "Save my tee", exact: true })
      .click();
    const download = await downloaded;
    assert.equal(
      download.suggestedFilename(),
      "bandadda-play-electric-sound-lilac.png",
    );
    const file = path.join(dir, download.suggestedFilename());
    await download.saveAs(file);
    const png = fs.readFileSync(file);
    assert.equal(png.subarray(1, 4).toString(), "PNG");
    assert.equal(png.readUInt32BE(16), 600);
    assert.equal(png.readUInt32BE(20), 640);
    assert(png.length > 12000);
    await page.getByLabel("Made it: earned", { exact: true }).waitFor();
    await page.waitForFunction(
      () => JSON.parse(localStorage.getItem("jitendra-play-stamps-v1")).merch,
    );
    await page.screenshot({
      path: path.join(dir, "merch-made-light.png"),
      fullPage: true,
    });
    await page.reload({ waitUntil: "networkidle" });
    await page
      .getByRole("tab", { name: /Merch Lab/, selected: true })
      .waitFor();
    for (const stamp of ["Good eye", "Flow state", "Made it"])
      assert.equal(
        await page.getByLabel(`${stamp}: earned`, { exact: true }).count(),
        1,
      );
    console.log(
      "PASS real 600×640 PNG export, original artwork, color and scale controls, deep link, and persisted stamps",
    );

    await page.getByRole("tab", { name: /Merch Lab/ }).focus();
    await page.keyboard.press("Home");
    assert.equal(
      await page
        .getByRole("tab", { name: /Pixel Eye/, selected: true })
        .count(),
      1,
    );
    await page.keyboard.press("ArrowRight");
    assert.equal(
      await page
        .getByRole("tab", { name: /Signal Path/, selected: true })
        .count(),
      1,
    );
    await page.keyboard.press("End");
    assert.equal(
      await page
        .getByRole("tab", { name: /Merch Lab/, selected: true })
        .count(),
      1,
    );
    console.log("PASS accessible tab keyboard behavior");

    for (const theme of ["dark", "light"]) {
      if (theme === "dark")
        await page
          .getByRole("button", { name: "Switch to dark mode", exact: true })
          .click();
      else
        await page
          .getByRole("button", { name: "Switch to light mode", exact: true })
          .click();
      for (const width of [1440, 768, 390, 320]) {
        await page.setViewportSize({
          width,
          height: width >= 768 ? 1024 : 844,
        });
        for (const name of ["Pixel Eye", "Signal Path", "Merch Lab"]) {
          await page.getByRole("tab", { name: new RegExp(name) }).click();
          assert(
            await page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth,
            ),
            `Overflow ${theme}, ${width}, ${name}`,
          );
          const broken = await page
            .locator("img")
            .evaluateAll((images) =>
              images
                .filter((i) => i.complete && !i.naturalWidth)
                .map((i) => i.src),
            );
          assert.deepEqual(broken, []);
          if (width === 390 || width === 1440)
            await page.screenshot({
              path: path.join(
                dir,
                `${name.toLowerCase().replaceAll(" ", "-")}-${theme}-${width}.png`,
              ),
              fullPage: true,
            });
        }
      }
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole("tab", { name: /Merch Lab/ }).click();
    await page
      .getByRole("slider", { name: /Print size/ })
      .scrollIntoViewIfNeeded();
    const visiblePreview = await page
      .getByRole("img", { name: /T-shirt/ })
      .boundingBox();
    assert(
      visiblePreview &&
        visiblePreview.y >= 100 &&
        visiblePreview.y + visiblePreview.height < 650,
      "Mobile tee preview should stay visible while changing controls",
    );
    await page.screenshot({
      path: path.join(dir, "mobile-sticky-preview.png"),
    });
    console.log(
      "PASS light/dark layouts at four widths, original images, and mobile preview while adjusting controls",
    );

    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.getByRole("tab", { name: /Signal Path/ }).click();
    await page
      .getByRole("button", { name: "Reset board", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Send a signal", exact: true })
      .click();
    assert.equal(
      await page
        .getByText("There’s a loose connection.", { exact: true })
        .count(),
      1,
    );
    console.log(
      "PASS reduced-motion signal completes without waiting for animation",
    );

    await page.route("**/data/play.json", (route) =>
      route.fulfill({ json: { ...config, title: "Curiosity lives here." } }),
    );
    await page.goto(base + "/play", { waitUntil: "networkidle" });
    await page.getByRole("heading", { name: /Curiosity lives here/ }).waitFor();
    await page.unroute("**/data/play.json");
    await page.route("**/data/play.json", (route) =>
      route.fulfill({ json: { ...config, pixelRounds: [] } }),
    );
    await page.reload({ waitUntil: "networkidle" });
    assert.equal(
      await page
        .getByRole("heading", { name: "A little room to play.", exact: true })
        .count(),
      1,
    );
    assert.deepEqual(errors, []);
    await page.unroute("**/data/play.json");
    await page
      .getByRole("link", { name: /Flow field.*A small experiment/ })
      .click();
    await page.waitForURL("**/play/flow-field");
    assert.equal(
      await page
        .getByRole("heading", { name: "Flow field.", exact: true })
        .count(),
      1,
    );
    await context.close();
    console.log(
      "PASS editable JSON, invalid-content fallback, preserved Flow Field route, and no runtime errors",
    );

    const privateContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
    });
    await privateContext.addInitScript(() => {
      Storage.prototype.getItem = () => {
        throw new Error("Storage unavailable");
      };
      Storage.prototype.setItem = () => {
        throw new Error("Storage unavailable");
      };
    });
    const privatePage = await privateContext.newPage(),
      privateErrors = [];
    privatePage.on("pageerror", (error) => privateErrors.push(error.message));
    await privatePage.goto(base + "/play", {
      waitUntil: "networkidle",
      timeout: 120000,
    });
    await privatePage
      .getByRole("button", { name: "Check my eye", exact: true })
      .click();
    await privatePage.getByText(/Almost in focus/).waitFor();
    assert.deepEqual(privateErrors, []);
    await privateContext.close();
    console.log(
      "PASS experiments still work when browser storage is unavailable",
    );
    fs.writeFileSync(
      path.join(dir, "verified.json"),
      JSON.stringify(
        {
          pixel: true,
          signal: true,
          merch: true,
          png: file,
          persistence: true,
          keyboard: true,
          mobile: true,
          themes: true,
          json: true,
          reducedMotion: true,
          runtimeErrors: errors,
        },
        null,
        2,
      ),
    );
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
