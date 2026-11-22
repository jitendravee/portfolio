const { chromium } = require("playwright");
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");

const baseURL = process.env.PORTFOLIO_BASE_URL || "http://127.0.0.1:3000";
const output = path.resolve(".artifacts/experience");
const data = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, "../public/data/experience.json"),
    "utf8",
  ),
);
fs.mkdirSync(output, { recursive: true });

(async () => {
  const browser = await chromium.launch({
    ...(process.env.PORTFOLIO_BROWSER_EXECUTABLE
      ? { executablePath: process.env.PORTFOLIO_BROWSER_EXECUTABLE }
      : {}),
    headless: true,
  });
  try {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 1000 },
      colorScheme: "light",
    });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const showTimeline = async () => {
      await page.locator("#experience").evaluate((element) =>
        window.scrollTo({
          top: scrollY + element.getBoundingClientRect().top - 140,
          behavior: "instant",
        }),
      );
      await page.waitForTimeout(800);
    };
    await page.goto(baseURL, { waitUntil: "networkidle" });
    assert.equal(
      await page.locator(".experience-item").count(),
      data.entries.length,
    );
    await showTimeline();
    const fillBefore = await page
      .locator(".experience-track")
      .evaluate((element) =>
        parseFloat(element.style.getPropertyValue("--track-fill")),
      );
    const positions = await page
      .locator(".experience-item")
      .evaluateAll((rows) =>
        rows.slice(0, 2).map((row) => ({
          card: row.querySelector(".experience-card").getBoundingClientRect().x,
          mark: row.querySelector(".experience-mark").getBoundingClientRect().x,
        })),
      );
    assert(
      positions[0].card < positions[0].mark &&
        positions[1].card > positions[1].mark,
    );
    await page.screenshot({ path: path.join(output, "timeline-light.png") });
    await page.mouse.wheel(0, 650);
    await page.waitForTimeout(850);
    const fillAfter = await page
      .locator(".experience-track")
      .evaluate((element) =>
        parseFloat(element.style.getPropertyValue("--track-fill")),
      );
    assert(fillAfter > fillBefore, "Timeline fill must advance with scroll");
    assert((await page.locator(".experience-item.is-visible").count()) >= 2);
    assert((await page.locator(".experience-item.is-reached").count()) >= 1);
    await page.screenshot({ path: path.join(output, "timeline-scroll.png") });
    console.log("PASS alternating cards, scroll fill, and reveals");

    // Visit every mark so lazy logos load before checking their network/fallback behavior.
    for (const row of await page.locator(".experience-item").all())
      await row.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    assert.deepEqual(
      await page
        .locator(".experience-mark img")
        .evaluateAll((images) =>
          images
            .filter((image) => !image.complete || !image.naturalWidth)
            .map((image) => image.src),
        ),
      [],
    );
    assert.equal(
      await page
        .locator(".experience-links a[href='https://rimigo.com/']")
        .count(),
      1,
    );
    await showTimeline();
    await page
      .getByRole("button", { name: "Switch to dark mode", exact: true })
      .click();
    await page.waitForTimeout(450);
    await page.screenshot({ path: path.join(output, "timeline-dark.png") });
    assert.equal(await page.locator("html.dark").count(), 1);
    console.log("PASS logos, links, and dark theme");

    await page.setViewportSize({ width: 390, height: 844 });
    await showTimeline();
    const mobile = await page
      .locator(".experience-item")
      .first()
      .evaluate((row) => ({
        card: row
          .querySelector(".experience-card")
          .getBoundingClientRect()
          .toJSON(),
        label: row
          .querySelector(".experience-label")
          .getBoundingClientRect()
          .toJSON(),
        mark: row
          .querySelector(".experience-mark")
          .getBoundingClientRect()
          .toJSON(),
        overflow: document.documentElement.scrollWidth > innerWidth,
      }));
    assert(!mobile.overflow);
    assert(
      mobile.mark.x < mobile.card.x && mobile.label.bottom < mobile.card.top,
    );
    assert(
      Math.abs(
        mobile.mark.y +
          mobile.mark.height / 2 -
          (mobile.card.y + mobile.card.height / 2),
      ) < 2,
    );
    await page.screenshot({ path: path.join(output, "timeline-mobile.png") });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.waitForFunction(
      () =>
        !document
          .querySelector(".experience-track")
          ?.classList.contains("timeline-enhanced"),
    );
    assert.equal(
      await page.locator(".experience-track.timeline-enhanced").count(),
      0,
    );
    assert.equal(
      await page
        .locator(".experience-card")
        .last()
        .evaluate((element) => getComputedStyle(element).opacity),
      "1",
    );
    console.log("PASS mobile layout and reduced motion");

    const added = {
      id: "future-role",
      company: "Future Company",
      role: "Software Engineer",
      start: "2027-01",
      end: null,
      icon: "code",
      logo: { src: "/missing-logo-for-fallback.svg" },
      points: ["A role added through JSON."],
      links: [],
    };
    await page.route("**/data/experience.json", (route) =>
      route.fulfill({ json: { ...data, entries: [...data.entries, added] } }),
    );
    await page.goto(`${baseURL}/about`, { waitUntil: "networkidle" });
    const future = page.locator('[data-experience-id="future-role"]');
    await future.waitFor();
    await future.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    assert.equal(
      await page.locator(".experience-item").count(),
      data.entries.length + 1,
    );
    assert.equal(await future.locator(".experience-mark svg").count(), 1);
    assert.equal(await future.locator(".experience-mark img").count(), 0);
    console.log(
      "PASS new entries loaded from runtime JSON and missing-logo fallback",
    );
    await page.unroute("**/data/experience.json");
    await page.route("**/data/experience.json", (route) =>
      route.fulfill({ json: { entries: "invalid" } }),
    );
    await page.reload({ waitUntil: "networkidle" });
    assert.equal(
      await page.locator(".experience-item").count(),
      data.entries.length,
    );
    assert.deepEqual(errors, []);
    console.log("PASS invalid JSON fallback and no browser runtime errors");
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
