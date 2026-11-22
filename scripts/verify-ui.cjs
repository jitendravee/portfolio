const { chromium } = require("playwright"),
  fs = require("fs"),
  assert = require("assert/strict"),
  path = require("path");
const baseURL = process.env.PORTFOLIO_BASE_URL || "http://127.0.0.1:3000";
const projects = require("../src/data/projects.json");
const artifactDir =
  path.resolve(process.env.PORTFOLIO_QA_DIR || ".artifacts/qa") + path.sep;
fs.mkdirSync(artifactDir, { recursive: true });
(async () => {
  const browser = await chromium.launch({
    ...(process.env.PORTFOLIO_BROWSER_EXECUTABLE
      ? { executablePath: process.env.PORTFOLIO_BROWSER_EXECUTABLE }
      : {}),
    headless: true,
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
    colorScheme: "light",
  });
  const page = await context.newPage(),
    errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(baseURL, { waitUntil: "networkidle", timeout: 120000 });
  await page.waitForTimeout(2700);
  assert.equal(await page.locator("h1").innerText(), "Jitendra");
  await page.screenshot({
    path: artifactDir + "home-light.png",
    fullPage: true,
  });
  assert.equal(await page.locator(".project-card").count(), projects.length);
  assert.equal(
    await page.locator(".project-grid video").count(),
    projects.filter((p) => p.video).length,
  );
  console.log("PASS mixed work gallery and original media");
  for (const [name, group] of [
    ["Graphic design", "graphics"],
    ["Stories & community", "stories"],
    ["Systems", "systems"],
  ]) {
    await page.getByRole("button", { name, exact: true }).click();
    assert.equal(
      await page.locator(".project-card").count(),
      projects.filter((p) => p.group === group).length,
    );
  }
  await page.getByRole("button", { name: "All work", exact: true }).click();
  console.log("PASS discipline filters");
  const before = await page.locator(".book-caption").innerText();
  await page
    .getByRole("button", { name: "Next book page", exact: true })
    .click();
  await page.waitForTimeout(950);
  assert.notEqual(await page.locator(".book-caption").innerText(), before);
  console.log("PASS book page turn");
  await page.locator(".project-card").first().click();
  await page.locator("dialog[open]").waitFor();
  assert(page.url().endsWith("/work/bandadda"));
  await page.locator("dialog h1").waitFor();
  await page.waitForTimeout(550);
  await page.screenshot({ path: artifactDir + "project-sheet.png" });
  await page
    .getByRole("button", { name: "Expand project", exact: true })
    .click();
  assert(await page.locator(".dialog-expanded").count());
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);
  assert.equal(await page.locator("dialog[open]").count(), 0);
  assert.equal(new URL(page.url()).pathname, "/");
  console.log("PASS project sheet, URL, expand, Escape and history");
  await page
    .getByRole("button", { name: "Switch to dark mode", exact: true })
    .click();
  assert(await page.locator("html.dark").count());
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await page.screenshot({
    path: artifactDir + "home-dark.png",
    fullPage: true,
  });
  await page.reload({ waitUntil: "networkidle" });
  assert(await page.locator("html.dark").count());
  console.log("PASS dark theme and persistence");
  await page
    .getByRole("button", { name: "Switch to light mode", exact: true })
    .click();
  const routes = [
    "/work",
    "/about",
    "/play",
    "/inspiration",
    ...projects.map((p) => `/work/${p.slug}`),
    "/play/flow-field",
  ];
  for (const route of routes) {
    await page.goto(baseURL + route, {
      waitUntil: "networkidle",
      timeout: 60000,
    });
    assert.equal(await page.locator("h1").count(), 1);
    const broken = await page
      .locator("img")
      .evaluateAll((imgs) =>
        imgs.filter((i) => i.complete && !i.naturalWidth).map((i) => i.src),
      );
    assert.deepEqual(broken, []);
    if (["/about", "/play", "/inspiration", "/work/twigg-app"].includes(route))
      await page.screenshot({
        path: artifactDir + "" + route.slice(1).replaceAll("/", "-") + ".png",
        fullPage: true,
      });
    console.log("PASS route", route);
  }
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  assert.equal(
    await page.getByRole("button", { name: "Play", exact: true }).count(),
    1,
  );
  await page.getByRole("slider").focus();
  await page.keyboard.press("ArrowRight");
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Save image" }).click();
  assert((await download).suggestedFilename().endsWith(".png"));
  console.log("PASS canvas controls and export");
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of [
    "/",
    "/about",
    "/play",
    "/inspiration",
    "/work/twigg-app",
  ]) {
    await page.goto(baseURL + route, { waitUntil: "networkidle" });
    await page.waitForTimeout(2700);
    const dimensions = await page.evaluate(() => ({
      w: innerWidth,
      scroll: document.documentElement.scrollWidth,
    }));
    assert(
      dimensions.scroll <= dimensions.w,
      route + " overflows " + JSON.stringify(dimensions),
    );
    await page.screenshot({
      path:
        artifactDir +
        "mobile-" +
        (route === "/" ? "home" : route.slice(1).replaceAll("/", "-")) +
        ".png",
      fullPage: true,
    });
    console.log("PASS mobile", route);
  }
  await page.goto(baseURL + "/?project=" + encodeURIComponent("Skillspe App"), {
    waitUntil: "networkidle",
  });
  await page.waitForTimeout(2700);
  assert(new URL(page.url()).pathname === "/work/skillspe-app");
  console.log("PASS legacy project link");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(baseURL, { waitUntil: "networkidle" });
  await page
    .getByRole("button", { name: "Next book page", exact: true })
    .click();
  assert.equal(await page.locator(".turning-page").count(), 0);
  console.log("PASS reduced motion");
  assert.deepEqual(errors, []);
  console.log("PASS no browser runtime errors");
  await browser.close();
  fs.writeFileSync(
    artifactDir + "verified.json",
    JSON.stringify(
      {
        routes,
        mobile: true,
        book: true,
        theme: true,
        modal: true,
        canvas: true,
        legacy: true,
        reducedMotion: true,
        errors,
      },
      null,
      2,
    ),
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
