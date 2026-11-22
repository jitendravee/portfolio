const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const plans = require("./recording-plans.json");

// An actual browser recording: camera effects are added during encoding.
async function installCursor() {
  if (document.getElementById("capture-pointer")) return;
  const style = document.createElement("style");
  style.textContent = `*{cursor:none!important}#capture-pointer{position:fixed;left:0;top:0;z-index:2147483647;pointer-events:none;filter:drop-shadow(0 3px 5px #25214c66)}#capture-pointer svg{width:25px;height:32px;display:block;transition:scale .16s}#capture-pointer.pressed svg{scale:.83}#capture-pointer span{position:absolute;left:25px;top:25px;padding:5px 9px;border:1px solid #ffffffaa;border-radius:20px;background:#28243bba;backdrop-filter:blur(12px);font:500 11px system-ui;color:white;white-space:nowrap}#capture-halo{position:fixed;left:0;top:0;width:34px;height:34px;border:1px solid #b4a5ff88;border-radius:50%;background:#b4a5ff18;pointer-events:none;z-index:2147483646}.capture-ripple{position:fixed;width:12px;height:12px;border:2px solid #a696ff;border-radius:50%;z-index:2147483647;pointer-events:none;animation:capture-ripple .6s ease-out forwards}@keyframes capture-ripple{to{transform:translate(-50%,-50%) scale(4);opacity:0}}`;
  document.documentElement.append(style);
  const pointer = document.createElement("div");
  pointer.id = "capture-pointer";
  pointer.innerHTML = `<svg viewBox="0 0 25 32" fill="none"><path d="M3 2L22 19L13 20L9 28L3 2Z" fill="#B4A5FF" stroke="white" stroke-width="2" stroke-linejoin="round"/></svg><span>Explore</span>`;
  const halo = document.createElement("div");
  halo.id = "capture-halo";
  document.documentElement.append(halo, pointer);
  let x = 1080,
    y = 650,
    hx = x,
    hy = y;
  document.addEventListener("pointermove", (e) => {
    x = e.clientX;
    y = e.clientY;
    pointer.querySelector("span").textContent = e.target.closest("a,button")
      ? "Open"
      : "Explore";
  });
  document.addEventListener("pointerdown", () => {
    pointer.classList.add("pressed");
    const pulse = document.createElement("i");
    pulse.className = "capture-ripple";
    pulse.style.cssText = `left:${x}px;top:${y}px;transform:translate(-50%,-50%)`;
    document.documentElement.append(pulse);
    setTimeout(() => pulse.remove(), 650);
  });
  document.addEventListener("pointerup", () =>
    pointer.classList.remove("pressed"),
  );
  const frame = () => {
    hx += (x - hx) * 0.13;
    hy += (y - hy) * 0.13;
    pointer.style.transform = `translate3d(${x}px,${y}px,0)`;
    halo.style.transform = `translate3d(${hx - 13}px,${hy - 13}px,0)`;
    requestAnimationFrame(frame);
  };
  frame();
}

(async () => {
  const slug = process.argv[2],
    plan = plans[slug];
  if (!plan) throw new Error(`Unknown capture: ${slug}`);
  const dir = path.resolve(
    process.env.PORTFOLIO_CAPTURE_DIR || ".artifacts/capture",
  );
  fs.mkdirSync(dir, { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.PORTFOLIO_BROWSER_EXECUTABLE
      ? { executablePath: process.env.PORTFOLIO_BROWSER_EXECUTABLE }
      : {}),
  });
  try {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      recordVideo: { dir, size: { width: 1440, height: 900 } },
      colorScheme: "light",
    });
    await context.addInitScript(() =>
      document.addEventListener("DOMContentLoaded", () => {
        // The function itself is installed below after every navigation.
      }),
    );
    const page = await context.newPage();
    const response = await page.goto(plan.url, {
      waitUntil: "domcontentloaded",
      timeout: 90000,
    });
    await page.waitForTimeout(slug === "praxis" ? 6500 : 3000);
    if (slug === "rimigo")
      await page
        .getByRole("button", { name: "Destination", exact: true })
        .waitFor({ timeout: 30000 });
    await page.evaluate(installCursor);
    const started = Date.now(),
      actions = [],
      cues = [];
    let px = 1080,
      py = 650;
    const at = () => (Date.now() - started) / 1000;
    const move = async (x, y) => {
      const ax = px,
        ay = py,
        start = Date.now();
      for (let n = 1; n <= 32; n++) {
        const t = n / 32,
          e = t * t * (3 - 2 * t);
        await page.mouse.move(ax + (x - ax) * e, ay + (y - ay) * e);
        await page.waitForTimeout(Math.max(0, 650 * t - (Date.now() - start)));
      }
      px = x;
      py = y;
    };
    const cue = (x, y, scale = 1.17) => {
      if (cues.length < 2) cues.push({ at: at() - 0.4, x, y, scale });
    };
    await move(1060, 520);
    await page.waitForTimeout(1700);
    await page.screenshot({ path: path.join(dir, `${slug}-poster.png`) });
    for (const step of plan.steps) {
      if (step.escape) {
        await page.keyboard.press("Escape");
        actions.push({ at: at(), type: "escape" });
      } else if (step.navigate) {
        await move(1100, 240);
        await page.goto(step.navigate, {
          waitUntil: "domcontentloaded",
          timeout: 60000,
        });
        await page.waitForTimeout(1900);
        await page.evaluate(installCursor);
        actions.push({ at: at(), type: "navigate", url: step.navigate });
      } else if (step.scroll !== undefined || step.scrollBy !== undefined) {
        await move(1110, 570);
        cue(760, 480, 1.14);
        const top =
          step.scroll ?? (await page.evaluate(() => scrollY)) + step.scrollBy;
        await page.evaluate(async (top) => {
          const from = scrollY,
            start = performance.now();
          await new Promise((resolve) => {
            function frame(now) {
              const t = Math.min(1, (now - start) / 1100),
                eased = t * t * (3 - 2 * t);
              scrollTo(0, from + (top - from) * eased);
              if (t < 1) requestAnimationFrame(frame);
              else resolve();
            }
            requestAnimationFrame(frame);
          });
        }, top);
        actions.push({ at: at(), type: "scroll", top });
      } else {
        const target = step.href
          ? page.locator(`a[href="${step.href}"]`).first()
          : step.linkText
            ? page
                .getByRole("link", { name: step.linkText, exact: true })
                .first()
            : page
                .getByRole(step.click, { name: step.name, exact: true })
                .first();
        await target.waitFor({ state: "visible", timeout: 20000 });
        await target.scrollIntoViewIfNeeded();
        const box = await target.boundingBox();
        if (!box) throw new Error(`Missing target for ${JSON.stringify(step)}`);
        await move(box.x + box.width / 2, box.y + box.height / 2);
        cue(px, py);
        await page.waitForTimeout(450);
        await page.mouse.click(px, py);
        await page.waitForTimeout(1800);
        await page.evaluate(installCursor);
        actions.push({ at: at(), type: "click", target: step });
      }
      await page.waitForTimeout(1300);
    }
    await page.waitForTimeout(1800);
    const seconds = at(),
      video = page.video();
    await context.close();
    const file = path.join(dir, `${slug}.webm`);
    await video.saveAs(file);
    fs.writeFileSync(
      path.join(dir, `${slug}.json`),
      JSON.stringify(
        {
          slug,
          url: plan.url,
          status: response.status(),
          file,
          seconds,
          actions,
          cues,
          cursor:
            "spring-smoothed lavender pointer, glass label, trailing halo and click feedback",
        },
        null,
        2,
      ) + "\n",
    );
    console.log(`Recorded ${slug}: ${seconds.toFixed(1)}s`);
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
