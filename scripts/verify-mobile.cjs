const { chromium, webkit, devices } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const engine = process.env.PORTFOLIO_BROWSER_ENGINE || "chromium";
const base = process.env.PORTFOLIO_BASE_URL || "http://localhost:3000";
const dir = path.resolve(process.env.PORTFOLIO_MOBILE_QA_DIR || `.artifacts/mobile-audit/${engine}`);
fs.mkdirSync(dir, { recursive: true });
const rest = page => page.waitForFunction(() => document.querySelector(".pencil-book")?.dataset.bookState === "rest");
const frame = page => page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
const bookShot = async (page, name) => {
  const clip = await page.locator(".pencil-book").boundingBox();
  await page.screenshot({ path: path.join(dir, name), clip, animations: "allow" });
};

(async () => {
  const executablePath = process.env.PORTFOLIO_BROWSER_EXECUTABLE;
  const browser = await (engine === "webkit" ? webkit : chromium).launch(executablePath ? { executablePath } : {});
  try {
    const context = await browser.newContext({
      ...devices[engine === "webkit" ? "iPhone 13" : "Pixel 5"],
      // WPE's software renderer is used on Linux; Chromium also checks high DPR.
      ...(engine === "webkit" ? { deviceScaleFactor: 1 } : {}),
      viewport: { width: 390, height: 844 },
    });
    const page = await context.newPage(), errors = [];
    page.on("pageerror", error => errors.push(error.message));
    page.setDefaultNavigationTimeout(120000);
    await page.goto(base, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => document.querySelector(".book-arrow.next")?.onclick);
    await page.waitForTimeout(2200);
    console.log(`${engine}: loaded mobile home`);
    const stage = page.locator(".pencil-book");
    assert.equal(await stage.getAttribute("data-current"), "0");
    await rest(page);
    const arrows = await page.locator(".book-arrow").evaluateAll(elements => elements.map(element => {
      const r = element.getBoundingClientRect(); return { x: r.x, right: r.right, width: r.width };
    }));
    arrows.forEach(r => assert(r.x >= 0 && r.right <= 390 && r.width >= 44, "Arrow clipped or too small"));
    await page.screenshot({ path: path.join(dir, "home.png") });
    await page.addStyleTag({ content: ".hero-skills-bg{visibility:hidden!important}" });
    for (const direction of ["next", "previous"]) {
      await bookShot(page, `${direction}-before.png`);
      const frozen = await page.evaluate(direction => new Promise(resolve => {
        const element = document.querySelector(".pencil-book");
        const observer = new MutationObserver(() => {
          if (!element.querySelector(".turning-page")) return;
          observer.disconnect();
          const animations = element.getAnimations({ subtree: true });
          animations.forEach(a => { a.pause(); a.currentTime = 0; });
          resolve(animations.length);
        });
        observer.observe(element, { childList: true, attributes: true, subtree: true });
        document.querySelector(`.book-arrow.${direction}`).click();
      }), direction);
      assert.equal(await stage.getAttribute("data-book-state"), "turning");
      console.log(`${engine}: ${direction} frozen (${frozen} animations)`);
      for (const progress of [0, .25, .5, .75, .99999]) {
        await stage.evaluate((element, progress) => element.getAnimations({ subtree: true }).forEach(a => { a.currentTime = a.effect.getTiming().duration * progress; }), progress);
        await frame(page);
        await bookShot(page, `${direction}-${progress === 0 ? "start" : progress === .99999 ? "end" : progress * 100}.png`);
      }
      await stage.evaluate(element => element.getAnimations({ subtree: true }).forEach(a => a.finish()));
      await rest(page); await frame(page);
      await bookShot(page, `${direction}-after.png`);
      assert.equal(await page.locator(".turning-page,.book-incoming-half").count(), 0);
      console.log(`${engine}: ${direction} frames captured`);
    }
    if (process.env.PORTFOLIO_MOBILE_FRAMES_ONLY) return;
    if (engine === "chromium") {
      const cdp = await context.newCDPSession(page);
      await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
      const r = await stage.boundingBox(), y = r.y + r.height / 2;
      await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: r.x + r.width * .8, y }] });
      for (let i = 1; i <= 8; i++) {
        await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: r.x + r.width * (.8 - i * .07), y }] });
        await page.waitForTimeout(16);
      }
      await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
      await rest(page); await page.waitForTimeout(700);
      assert.equal(await stage.getAttribute("data-current"), "1", "Swipe turned twice or failed");
      await page.getByRole("button", { name: "Next book page", exact: true }).tap();
      await rest(page);
      assert.equal(await stage.getAttribute("data-current"), "2", "Tap after swipe blocked");
      await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });
      const current = await stage.getAttribute("data-current");
      await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: r.x + r.width / 2, y }] });
      for (let i = 1; i <= 8; i++) await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: r.x + r.width / 2, y: y - i * 15 }] });
      await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
      await page.waitForTimeout(600);
      assert.equal(await stage.getAttribute("data-current"), current, "Vertical scroll turned a page");
      await page.evaluate(() => scrollTo(0, 0));
    }
    await page.getByRole("button", { name: "Next book page", exact: true }).tap();
    await page.setViewportSize({ width: 844, height: 390 }); await rest(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const width of [320, 375, 390, 430]) {
      await page.setViewportSize({ width, height: 844 });
      for (let i = 0; i < 6; i++) {
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Home overflow ${width}`);
        const collisions = await page.locator(".pencil-book > .book-spread > .book-paper").evaluateAll(papers => papers.some(p => p.querySelector("h2").getBoundingClientRect().bottom > p.querySelector(".book-drawing-area").getBoundingClientRect().top + 2 || p.querySelector(".handwritten").getBoundingClientRect().bottom > p.querySelector(".book-page-footer").getBoundingClientRect().top + 5));
        assert(!collisions, `Book content collides at ${width}`);
        await page.getByRole("button", { name: "Next book page", exact: true }).tap(); await rest(page);
      }
    }
    await page.getByRole("button", { name: "Switch to dark mode", exact: true }).tap();
    await page.screenshot({ path: path.join(dir, "home-dark.png") });
    await page.locator(".project-card").first().tap();
    await page.locator("dialog[open] h1").waitFor();
    const close = page.getByRole("button", { name: "Close project", exact: true });
    assert(await close.isVisible());
    await close.tap();
    assert.equal(await page.locator("dialog[open]").count(), 0);
    for (const route of ["/work", "/about", "/inspiration", "/play/flow-field", "/play#merch-lab"]) {
      console.log(`${engine}: checking ${route}`);
      await page.goto(base + route, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(400);
      for (const width of [320, 390, 430]) {
        await page.setViewportSize({ width, height: 844 });
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Overflow ${route} ${width}`);
      }
    }
    await page.setViewportSize({ width: 390, height: 844 });
    const slider = page.getByRole("slider", { name: /Print size/ });
    await slider.scrollIntoViewIfNeeded();
    assert(await slider.evaluate(e => { const r = e.getBoundingClientRect(); return document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2) === e; }), "Sticky preview covers slider");
    const centered = await page.getByRole("img", { name: /artwork on a .*T-shirt/ }).evaluate(svg => {
      const preview = svg.parentElement.parentElement.getBoundingClientRect(), r = svg.getBoundingClientRect();
      return Math.abs(r.x + r.width / 2 - preview.x - preview.width / 2) < 2;
    });
    assert(centered, "T-shirt preview is off center");
    await page.screenshot({ path: path.join(dir, "play.png") });
    await page.setViewportSize({ width: 844, height: 390 });
    await slider.scrollIntoViewIfNeeded();
    assert(await slider.isVisible());
    assert.deepEqual(errors, []);
    fs.writeFileSync(path.join(dir, "verified.json"), JSON.stringify({ engine, arrows, runtimeErrors: errors, touch: true, portraitLandscape: true, widths: [320, 375, 390, 430] }, null, 2));
    console.log(`PASS ${engine}: touch, page handoff frames, all book spreads, responsive routes, reachable Play controls`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
