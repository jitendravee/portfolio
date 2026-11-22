const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const book = require("../public/data/book.json");
const base = process.env.PORTFOLIO_BASE_URL || "http://127.0.0.1:3000";
const dir = path.resolve(".artifacts/creative/book-qa");
fs.mkdirSync(dir, { recursive: true });

(async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.PORTFOLIO_BROWSER_EXECUTABLE
      ? { executablePath: process.env.PORTFOLIO_BROWSER_EXECUTABLE }
      : {}),
  });
  try {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 1000 },
    });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(base, { waitUntil: "networkidle" });
    await page.waitForTimeout(3000);
    await page.waitForFunction(
      () =>
        document.querySelector(".book-pagination")?.textContent.trim() ===
          "1 / 6" && !document.querySelector(".turning-page"),
    );
    await page.screenshot({ path: path.join(dir, "hero-light.png") });
    const next = page.getByRole("button", {
      name: "Next book page",
      exact: true,
    });
    await next.evaluate((button) => {
      button.click();
      button.click();
      button.click();
    });
    await page.waitForFunction(
      () =>
        document.querySelector(".book-pagination")?.textContent.trim() ===
          "4 / 6" && !document.querySelector(".turning-page"),
    );
    console.log(
      "PASS intro returns to artwork and rapid navigation keeps every turn",
    );
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.reload({ waitUntil: "networkidle" });
    for (let i = 0; i < book.spreads.length; i++) {
      const bad = await page
        .locator(".book-stage img")
        .evaluateAll((images) =>
          images
            .filter((image) => !image.complete || !image.naturalWidth)
            .map((image) => image.src),
        );
      assert.deepEqual(bad, []);
      assert.equal(
        await page.locator(".book-pagination").innerText(),
        `${i + 1} / ${book.spreads.length}`,
      );
      await page.screenshot({ path: path.join(dir, `spread-${i + 1}.png`) });
      await next.click();
    }
    await page
      .getByRole("button", { name: "Previous book page", exact: true })
      .click();
    assert.equal(await page.locator(".book-pagination").innerText(), "6 / 6");
    await page.locator(".book-carousel").focus();
    await page.keyboard.press("ArrowRight");
    assert.equal(await page.locator(".book-pagination").innerText(), "1 / 6");
    console.log(
      "PASS all six spreads, original images, wraparound, keyboard, reduced motion",
    );
    await page
      .getByRole("button", { name: "Switch to dark mode", exact: true })
      .click();
    await page.screenshot({ path: path.join(dir, "hero-dark.png") });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: path.join(dir, "hero-mobile-dark.png") });
    const stage = page.locator(".book-stage");
    const swipe = async (x, y) => stage.evaluate((element, end) => {
      const options = { bubbles: true, pointerId: 1, pointerType: "touch", isPrimary: true };
      element.dispatchEvent(new PointerEvent("pointerdown", { ...options, clientX: 300, clientY: 400 }));
      element.dispatchEvent(new PointerEvent("pointerup", { ...options, clientX: end.x, clientY: end.y }));
    }, { x, y });
    await swipe(100, 402);
    assert.equal(await page.locator(".book-pagination").innerText(), "2 / 6");
    const before = await page.locator(".book-pagination").innerText();
    await swipe(270, 200);
    assert.equal(await page.locator(".book-pagination").innerText(), before);
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    console.log(
      "PASS mobile horizontal swipe without intercepting vertical gestures",
    );
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(base + "/work/bandadda-graphics", {
      waitUntil: "networkidle",
    });
    await page.locator(".gallery-artwork").scrollIntoViewIfNeeded();
    await page.waitForFunction(() =>
      [...document.querySelectorAll(".gallery-artwork img")].every(
        (image) => image.complete && image.naturalWidth,
      ),
    );
    assert.equal(await page.locator(".gallery-artwork img").count(), 13);
    await page.screenshot({ path: path.join(dir, "artwork-gallery.png") });
    const custom = {
      ...book,
      name: "A live sketchbook",
      spreads: [book.spreads[0]],
    };
    await page.route("**/data/book.json", (route) =>
      route.fulfill({ json: custom }),
    );
    await page.goto(base, { waitUntil: "networkidle" });
    await page
      .getByRole("heading", { name: "A live sketchbook", exact: true })
      .waitFor();
    assert.equal(await page.locator(".book-pagination").innerText(), "1 / 1");
    await page.unroute("**/data/book.json");
    await page.route("**/data/book.json", (route) =>
      route.fulfill({
        json: {
          ...custom,
          spreads: [
            {
              ...custom.spreads[0],
              left: { ...custom.spreads[0].left, layout: "invalid" },
            },
          ],
        },
      }),
    );
    await page.reload({ waitUntil: "networkidle" });
    assert.equal(await page.locator("h1").innerText(), "Jitendra");
    assert.deepEqual(errors, []);
    console.log(
      "PASS editable runtime book JSON, invalid layout fallback, no runtime errors",
    );
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
