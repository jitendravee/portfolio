"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FiCheck,
  FiCommand,
  FiEye,
  FiGitMerge,
  FiScissors,
  FiWind,
} from "react-icons/fi";
import PixelEye from "./PixelEye";
import SignalPath from "./SignalPath";
import MerchLab from "./MerchLab";
import {
  emptyProgress,
  initialPlay,
  readProgress,
  validPlay,
  type PlayConfig,
  type Progress,
} from "./play-data";
import styles from "./playground.module.css";

const tabs = [
  {
    id: "pixel-eye",
    label: "Pixel Eye",
    descriptor: "Train your design instinct",
    Icon: FiEye,
  },
  {
    id: "signal-path",
    label: "Signal Path",
    descriptor: "Find the flow in a little logic",
    Icon: FiGitMerge,
  },
  {
    id: "merch-lab",
    label: "Merch Lab",
    descriptor: "Make a little Bandadda your own",
    Icon: FiScissors,
  },
] as const;
type Tab = (typeof tabs)[number]["id"];
const origins: Record<Tab, { href: string; label: string }> = {
  "pixel-eye": {
    href: "/work/bandadda-graphics",
    label: "Behind the play: graphic & product design",
  },
  "signal-path": {
    href: "/work/lead-automation",
    label: "Behind the play: a real lead automation",
  },
  "merch-lab": {
    href: "/work/bandadda",
    label: "Behind the play: the Bandadda story",
  },
};
const storageKey = "jitendra-play-stamps-v1";

export default function Playground() {
  const [config, setConfig] = useState<PlayConfig>(initialPlay),
    [active, setActive] = useState<Tab>("pixel-eye"),
    [progress, setProgress] = useState<Progress>(emptyProgress),
    [loaded, setLoaded] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const pageRoot = useRef<HTMLDivElement>(null), tabBar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = tabBar.current;
    if (!element) return;
    const update = () => pageRoot.current?.style.setProperty("--play-tabs-height", `${Math.ceil(element.getBoundingClientRect().height)}px`);
    const observer = new ResizeObserver(update);
    observer.observe(element);
    update();
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    try {
      setProgress(
        readProgress(JSON.parse(localStorage.getItem(storageKey) || "null")),
      );
    } catch {}
    setLoaded(true);
    const syncHash = () => {
      const hash = location.hash.slice(1);
      if (tabs.some((tab) => tab.id === hash)) setActive(hash as Tab);
    };
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);
  useEffect(() => {
    if (loaded)
      try {
        localStorage.setItem(storageKey, JSON.stringify(progress));
      } catch {}
  }, [progress, loaded]);
  useEffect(() => {
    const controller = new AbortController();
    void fetch("/data/play.json", {
      cache: "no-store",
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((value) => {
        if (validPlay(value)) setConfig(value);
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);
  const select = (id: Tab) => {
    setActive(id);
    history.replaceState(history.state, "", `#${id}`);
  };
  const onScore = useCallback(
    (score: number) =>
      setProgress((value) => ({
        ...value,
        pixel: Math.max(value.pixel, score),
      })),
    [],
  );
  const onWin = useCallback(
    (moves: number) =>
      setProgress((value) => ({
        ...value,
        signal: value.signal === null ? moves : Math.min(value.signal, moves),
      })),
    [],
  );
  const onMade = useCallback(
    () => setProgress((value) => ({ ...value, merch: true })),
    [],
  );
  const stamps = [
    { name: "Good eye", earned: progress.pixel >= 95, Icon: FiEye },
    { name: "Flow state", earned: progress.signal !== null, Icon: FiGitMerge },
    { name: "Made it", earned: progress.merch, Icon: FiScissors },
  ];
  return (
    <div ref={pageRoot} className={styles.page}>
      <header className={styles.intro}>
        <div>
          <p className={styles.eyebrow}>{config.eyebrow}</p>
          <h1>
            {config.title}
            <br />
            <em>{config.accent}</em>
            <svg
              className={styles.titleSpark}
              viewBox="0 0 100 100"
              aria-hidden="true"
            >
              <path d="M50 4v92M4 50h92M18 18l64 64M18 82l64-64" />
            </svg>
          </h1>
          <p className={styles.description}>{config.description}</p>
        </div>
        <div className={styles.stampCollection}>
          <p>Your studio stamps</p>
          <ul aria-label="Your studio stamps">
            {stamps.map(({ name, earned, Icon }) => (
              <li
                key={name}
                data-earned={earned}
                aria-label={`${name}: ${earned ? "earned" : "not earned yet"}`}
              >
                <span className={styles.stampSeal}>
                  {earned ? <FiCheck /> : <Icon />}
                </span>
                <span>{name}</span>
              </li>
            ))}
          </ul>
          <span>Little wins, kept in this browser.</span>
        </div>
      </header>
      <section className={styles.console} aria-label="Interactive studio">
        <div className={styles.consoleBar}>
          <span>
            <FiCommand /> THE AFTER-HOURS STUDIO
          </span>
          <span>Pick something. Have a go.</span>
        </div>
        <div
          ref={tabBar}
          className={styles.tabBar}
          role="tablist"
          aria-label="Choose an experiment"
        >
          {tabs.map(({ id, label, descriptor, Icon }, index) => (
            <button
              key={id}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              id={`tab-${id}`}
              role="tab"
              aria-selected={active === id}
              aria-controls={`panel-${id}`}
              tabIndex={active === id ? 0 : -1}
              onClick={() => select(id)}
              onKeyDown={(event) => {
                let next: number | null = null;
                if (event.key === "ArrowRight")
                  next = (index + 1) % tabs.length;
                if (event.key === "ArrowLeft")
                  next = (index - 1 + tabs.length) % tabs.length;
                if (event.key === "Home") next = 0;
                if (event.key === "End") next = tabs.length - 1;
                if (next !== null) {
                  event.preventDefault();
                  select(tabs[next].id);
                  tabRefs.current[next]?.focus();
                }
              }}
            >
              <Icon />
              <span>
                <strong>{label}</strong>
                <small>{descriptor}</small>
              </span>
            </button>
          ))}
        </div>
        <div
          id="panel-pixel-eye"
          role="tabpanel"
          aria-labelledby="tab-pixel-eye"
          hidden={active !== "pixel-eye"}
          className={styles.panel}
        >
          <PixelEye
            rounds={config.pixelRounds}
            best={progress.pixel}
            onScore={onScore}
          />
        </div>
        <div
          id="panel-signal-path"
          role="tabpanel"
          aria-labelledby="tab-signal-path"
          hidden={active !== "signal-path"}
          className={styles.panel}
        >
          <SignalPath
            config={config.signal}
            best={progress.signal}
            onWin={onWin}
          />
        </div>
        <div
          id="panel-merch-lab"
          role="tabpanel"
          aria-labelledby="tab-merch-lab"
          hidden={active !== "merch-lab"}
          className={styles.panel}
        >
          <MerchLab
            artworks={config.artworks}
            colors={config.teeColors}
            onMade={onMade}
          />
        </div>
        <footer className={styles.consoleFoot}>
          <Link href={origins[active].href}>{origins[active].label}</Link>
          <span>
            {stamps.filter((stamp) => stamp.earned).length} of 3 stamps
            collected
          </span>
        </footer>
      </section>
      <section className={styles.more} aria-labelledby="more-play">
        <div className={styles.moreHeading}>
          <p className={styles.eyebrow}>One more rabbit hole</p>
          <h2 id="more-play">Follow a different kind of flow.</h2>
        </div>
        <Link href="/play/flow-field" className={styles.flowLink}>
          <div className={styles.flowArt} aria-hidden="true">
            <svg viewBox="0 0 700 200" preserveAspectRatio="xMidYMid slice">
              {Array.from({ length: 20 }, (_, index) => (
                <path
                  key={index}
                  d={`M-40 ${15 + index * 9}C150 ${250 - index * 7} 170 ${-180 + index * 14} 350 ${45 + index * 6}S570 ${280 - index * 6} 740 ${-10 + index * 12}`}
                />
              ))}
            </svg>
          </div>
          <div>
            <span>
              <FiWind /> Flow field
            </span>
            <strong>A small experiment in repetition.</strong>
            <p>Move the lines. Change the rhythm. Save something unexpected.</p>
            <span className={styles.flowCta}>Open the experiment</span>
          </div>
        </Link>
      </section>
      <section
        className={styles.notes}
        aria-label="A few things behind the play"
      >
        <p>
          Made from the same curiosity behind{" "}
          <Link href="/work/bandadda">Bandadda</Link>,{" "}
          <Link href="/work/flowpdf">FlowPDF</Link>, and{" "}
          <Link href="/work/wayvia">Wayvia</Link>.
        </p>
        <p>
          Playful inspiration:{" "}
          <a href="https://method.ac/" target="_blank" rel="noreferrer">
            Method of Action
          </a>
          ,{" "}
          <a href="https://neal.fun/" target="_blank" rel="noreferrer">
            Neal.fun
          </a>
          , and{" "}
          <a href="https://bruno-simon.com/" target="_blank" rel="noreferrer">
            Bruno Simon
          </a>
          .
        </p>
      </section>
    </div>
  );
}
