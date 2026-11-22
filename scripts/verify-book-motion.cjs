const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const config = require("../public/data/book.json");
const base = process.env.PORTFOLIO_BASE_URL || "http://localhost:3000";
const dir = path.resolve(
  process.env.PORTFOLIO_BOOK_QA_DIR || ".artifacts/book-redesign/qa",
);
fs.mkdirSync(dir, { recursive: true });

async function instrument(page) {
  await page.addInitScript(() => {
    window.bookTrace = { turns: [], geometry: [] };
    let previous = "";
    const sample = () => {
      const stage = document.querySelector(".pencil-book");
      if (!stage) return;
      const { bookState: state, current, from, to, duration } = stage.dataset;
      const key = [state, current, from, to, duration].join(":");
      if (key !== previous) {
        window.bookTrace.turns.push({
          at: performance.now(),
          state,
          current,
          from,
          to,
          duration: Number(duration),
        });
        previous = key;
      }
    };
    new MutationObserver(sample).observe(document, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["data-book-state", "data-current", "data-duration"],
    });
    const frame = () => {
      const stage = document.querySelector(".pencil-book");
      if (stage && window.bookTrace.geometry.length < 1500) {
        const rect = stage.getBoundingClientRect();
        window.bookTrace.geometry.push({
          at: performance.now(),
          state: stage.dataset.bookState,
          x: rect.x,
          y: rect.y,
          w: rect.width,
          h: rect.height,
        });
      }
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  });
}
async function rest(page) {
  await page.waitForFunction(
    () => document.querySelector(".pencil-book")?.dataset.bookState === "rest",
  );
}
async function settleFrame(page) {
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  );
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
      viewport: { width: 1440, height: 1000 },
      colorScheme: "light",
    });
    const page = await context.newPage(),
      errors = [];
    page.setDefaultNavigationTimeout(120000);
    page.on("pageerror", (error) => errors.push(error.message));
    await instrument(page);
    await page.goto(base, { waitUntil: "networkidle" });
    await page.waitForFunction(
      (count) =>
        window.bookTrace.turns.filter((turn) => turn.state === "intro")
          .length === count &&
        document.querySelector(".pencil-book").dataset.bookState === "rest",
      config.spreads.length * 2,
      { timeout: 30000 },
    );
    const trace = await page.evaluate(() => window.bookTrace);
    const intro = trace.turns.filter((turn) => turn.state === "intro");
    assert.equal(intro.length, config.spreads.length * 2);
    assert.equal(
      await page.locator(".pencil-book").getAttribute("data-current"),
      "0",
    );
    assert(intro.at(-1).duration > intro[0].duration * 4);
    assert(
      intro.every(
        (turn, index) =>
          index === 0 || turn.duration >= intro[index - 1].duration,
      ),
    );
    const during = trace.geometry.filter((frame) => frame.at >= intro[0].at);
    for (const key of ["x", "y", "w", "h"])
      assert(
        Math.max(...during.map((frame) => frame[key])) -
          Math.min(...during.map((frame) => frame[key])) <
          0.1,
        `Book ${key} shifted during intro`,
      );
    assert.equal(await page.locator(".pencil-book video").count(), 0);
    fs.writeFileSync(
      path.join(dir, "intro-trace.json"),
      JSON.stringify(trace, null, 2),
    );
    await page.screenshot({ path: path.join(dir, "hero-light.png") });
    console.log(
      "PASS decelerating intro, twelve complete turns, first spread, fixed book geometry",
    );

    // Freeze actual CSS animations at their endpoints and capture the render before
    // and after React removes the flap. Pixel comparison is run on these PNGs.
    await page.addStyleTag({
      content: ".hero-skills-bg{visibility:hidden!important}",
    });
    for (const direction of ["next", "previous"]) {
      await page
        .locator(".pencil-book")
        .screenshot({ path: path.join(dir, `${direction}-before.png`) });
      await page
        .getByRole("button", {
          name: direction === "next" ? "Next book page" : "Previous book page",
          exact: true,
        })
        .click();
      await page.waitForFunction(
        () =>
          document.querySelector(".turning-page")?.getAnimations().length > 0,
      );
      await page.locator(".pencil-book").evaluate((element) => {
        for (const animation of element.getAnimations({ subtree: true })) {
          animation.pause();
          animation.currentTime = 0;
        }
      });
      await settleFrame(page);
      await page.locator(".pencil-book").screenshot({
        path: path.join(dir, `${direction}-start.png`),
        animations: "allow",
      });
      for (const progress of [0.25, 0.5, 0.75, 0.99999]) {
        await page.locator(".pencil-book").evaluate((element, progress) => {
          for (const animation of element.getAnimations({ subtree: true }))
            animation.currentTime =
              animation.effect.getTiming().duration * progress;
        }, progress);
        await settleFrame(page);
        await page.locator(".pencil-book").screenshot({
          path: path.join(
            dir,
            `${direction}-${progress === 0.99999 ? "end" : progress * 100}.png`,
          ),
          animations: "allow",
        });
      }
      await page
        .locator(".turning-page")
        .evaluate((element) =>
          element.getAnimations().forEach((animation) => animation.finish()),
        );
      await rest(page);
      await settleFrame(page);
      await page
        .locator(".pencil-book")
        .screenshot({ path: path.join(dir, `${direction}-after.png`) });
      assert.equal(
        await page.locator(".book-incoming-half, .turning-page").count(),
        0,
      );
    }
    console.log(
      "PASS forward/backward animation samples and clean final handoff",
    );

    await page.reload({ waitUntil: "networkidle" });
    await page.waitForTimeout(900);
    assert.equal(
      (await page.evaluate(() => window.bookTrace.turns)).filter(
        (turn) => turn.state === "intro",
      ).length,
      0,
    );
    console.log("PASS intro plays once per browser session");
    await page.emulateMedia({ reducedMotion: "reduce" });
    const layout = [];
    for (const viewport of [
      { width: 1440, height: 1000 },
      { width: 768, height: 1024 },
      { width: 390, height: 844 },
      { width: 320, height: 740 },
    ]) {
      await page.setViewportSize(viewport);
      for (let index = 0; index < config.spreads.length; index++) {
        await rest(page);
        const result = await page
          .locator(".pencil-book > .book-spread")
          .evaluate((spread) =>
            [...spread.children].map((paper) => {
              const title = paper.querySelector("h2"),
                drawing = paper.querySelector(".book-drawing-area"),
                note = paper.querySelector(".handwritten"),
                footer = paper.querySelector(".book-page-footer");
              return {
                number: footer.textContent,
                titleBottom: title.getBoundingClientRect().bottom,
                drawingTop: drawing.getBoundingClientRect().top,
                noteBottom: note.getBoundingClientRect().bottom,
                footerTop: footer.getBoundingClientRect().top,
                paperBottom: paper.getBoundingClientRect().bottom,
                clippedDrawingText: [
                  ...paper.querySelectorAll(".book-illustration text"),
                ]
                  .filter((text) => {
                    const bounds = text.getBoundingClientRect(),
                      page = paper.getBoundingClientRect();
                    return bounds.left < page.left || bounds.right > page.right;
                  })
                  .map((text) => text.textContent),
              };
            }),
          );
        layout.push({ viewport, index, pages: result });
        for (const paper of result) {
          assert(
            paper.titleBottom <= paper.drawingTop + 2,
            `Title/drawing collision ${viewport.width}, spread ${index}`,
          );
          assert.deepEqual(
            paper.clippedDrawingText,
            [],
            `Drawing text clipped ${viewport.width}, spread ${index}`,
          );
          // Allow the handwriting's natural ascenders and descenders.
          assert(
            paper.noteBottom <= paper.footerTop + 5,
            `Note/footer collision ${viewport.width}, spread ${index}`,
          );
        }
        assert(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          `Horizontal overflow at ${viewport.width}`,
        );
        if (viewport.width === 1440 || viewport.width === 390)
          await page.locator(".pencil-book").screenshot({
            path: path.join(dir, `spread-${index + 1}-${viewport.width}.png`),
          });
        await page
          .getByRole("button", { name: "Next book page", exact: true })
          .click();
      }
    }
    fs.writeFileSync(
      path.join(dir, "layout.json"),
      JSON.stringify(layout, null, 2),
    );
    console.log(
      "PASS all twelve pages at desktop, tablet, 390px, and 320px widths",
    );

    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page
      .getByRole("button", { name: "Next book page", exact: true })
      .click();
    await page.setViewportSize({ width: 1024, height: 800 });
    await rest(page);
    assert.equal(
      await page.locator(".pencil-book").getAttribute("data-current"),
      "1",
    );
    await page
      .getByRole("button", { name: "Next book page", exact: true })
      .click();
    await page.emulateMedia({ reducedMotion: "reduce" });
    await rest(page);
    assert.equal(
      await page.locator(".pencil-book").getAttribute("data-current"),
      "2",
    );
    console.log(
      "PASS resizing and reduced-motion changes settle an active turn",
    );
    await page
      .getByRole("button", { name: "Switch to dark mode", exact: true })
      .click();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: path.join(dir, "hero-mobile-dark.png") });
    const ids = await page
      .locator(".pencil-book [id]")
      .evaluateAll((elements) => elements.map((element) => element.id));
    assert.equal(ids.length, new Set(ids).size);
    assert.deepEqual(errors, []);
    await context.close();

    const interruptContext = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
    });
    const interruptPage = await interruptContext.newPage();
    await interruptPage.goto(base, { waitUntil: "domcontentloaded" });
    await interruptPage.waitForFunction(
      () =>
        document.querySelector(".pencil-book")?.dataset.bookState === "intro",
    );
    await interruptPage
      .getByRole("button", { name: "Next book page", exact: true })
      .click();
    await rest(interruptPage);
    const stoppedAt = await interruptPage
      .locator(".pencil-book")
      .getAttribute("data-current");
    await interruptPage.waitForTimeout(1000);
    assert.equal(
      await interruptPage.locator(".pencil-book").getAttribute("data-current"),
      stoppedAt,
    );
    await interruptContext.close();
    console.log(
      "PASS user interaction cancels the remaining intro, unique SVG IDs, no runtime errors",
    );
    fs.writeFileSync(
      path.join(dir, "verified.json"),
      JSON.stringify(
        {
          intro: true,
          geometry: true,
          handoff: true,
          responsive: true,
          interruptions: true,
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
