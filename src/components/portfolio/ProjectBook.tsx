"use client";

import {
  memo,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { FiChevronLeft, FiChevronRight, FiChevronsDown } from "react-icons/fi";
import initialBook from "../../../public/data/book.json";
import HeroSkillIcons from "./HeroSkillIcons";
import BookIllustration, {
  sketchKinds,
  type SketchKind,
} from "./BookIllustration";

type BookPage = {
  layout: "sketch";
  illustration: SketchKind;
  eyebrow: string;
  title: string;
  note: string;
  images: { src: string; alt: string }[];
  tags: string[];
};
type BookConfig = {
  kicker: string;
  name: string;
  spreads: { id: string; label: string; left: BookPage; right: BookPage }[];
};
type Request = { direction: number; duration: number; intro: boolean };
type Turn = Request & { from: number; to: number; id: number };
type State = {
  index: number;
  count: number;
  serial: number;
  turn: Turn | null;
  queue: Request[];
};
type Action =
  | { type: "turn"; request: Request }
  | { type: "complete"; id: number }
  | { type: "immediate"; direction: number }
  | { type: "reset"; count: number }
  | { type: "settle" };
const wrap = (index: number, count: number) =>
  ((index % count) + count) % count;
const INTRO_KEY = "portfolio-field-notes-intro-v3";
const handheldQuery = "(max-width: 700px), (pointer: coarse)";

function begin(state: State, request: Request): State {
  const id = state.serial + 1;
  return {
    ...state,
    serial: id,
    turn: {
      ...request,
      from: state.index,
      to: wrap(state.index + request.direction, state.count),
      id,
    },
  };
}
function reducer(state: State, action: Action): State {
  if (action.type === "reset")
    return { ...state, count: action.count, index: 0, turn: null, queue: [] };
  if (action.type === "settle")
    return {
      ...state,
      index: state.turn?.intro ? 0 : (state.turn?.to ?? state.index),
      turn: null,
      queue: [],
    };
  if (action.type === "immediate")
    return {
      ...state,
      index: wrap(
        (state.turn?.to ?? state.index) + action.direction,
        state.count,
      ),
      turn: null,
      queue: [],
    };
  if (action.type === "turn") {
    if (state.count < 2) return state;
    if (state.turn)
      return {
        ...state,
        queue: [
          ...state.queue.filter((item) => action.request.intro || !item.intro),
          action.request,
        ].slice(0, Math.max(6, state.count * 2)),
      };
    return begin(state, action.request);
  }
  if (!state.turn || action.id !== state.turn.id) return state;
  const committed = { ...state, index: state.turn.to, turn: null };
  if (!state.queue.length) return { ...committed, queue: [] };
  const [next, ...queue] = state.queue;
  return begin({ ...committed, queue }, next);
}

function validPage(value: unknown): value is BookPage {
  if (!value || typeof value !== "object") return false;
  const page = value as BookPage;
  return (
    page.layout === "sketch" &&
    sketchKinds.includes(page.illustration) &&
    [page.title, page.eyebrow, page.note].every(
      (item) => typeof item === "string",
    ) &&
    Array.isArray(page.images) &&
    page.images.every(
      (image) =>
        image && typeof image.src === "string" && typeof image.alt === "string",
    ) &&
    Array.isArray(page.tags) &&
    page.tags.every((tag) => typeof tag === "string")
  );
}
function validBook(value: unknown): value is BookConfig {
  if (!value || typeof value !== "object") return false;
  const book = value as BookConfig;
  return (
    typeof book.name === "string" &&
    typeof book.kicker === "string" &&
    Array.isArray(book.spreads) &&
    book.spreads.length > 0 &&
    book.spreads.every(
      (spread) =>
        spread &&
        typeof spread.id === "string" &&
        typeof spread.label === "string" &&
        validPage(spread.left) &&
        validPage(spread.right),
    )
  );
}

const Paper = memo(function Paper({
  page,
  side,
  number,
}: {
  page: BookPage;
  side: "left" | "right";
  number: number;
}) {
  return (
    <div className={`book-paper paper-${side} page-sketch`}>
      <span className="book-eyebrow">{page.eyebrow}</span>
      <h2>{page.title}</h2>
      <div className="book-drawing-area">
        <BookIllustration
          kind={page.illustration}
          images={page.images}
          label={`${page.eyebrow}: ${page.note}`}
        />
      </div>
      <p className="handwritten">{page.note}</p>
      <div className="book-page-footer">
        <p className="book-tags">{page.tags.join(" · ")}</p>
        <span className="book-page-number">
          {String(number).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
});
const Spread = memo(function Spread({
  book,
  index,
  decorative = false,
}: {
  book: BookConfig;
  index: number;
  decorative?: boolean;
}) {
  const bounded = wrap(index, book.spreads.length),
    spread = book.spreads[bounded];
  return (
    <div
      className={`book-spread spread-${spread.id}`}
      aria-hidden={decorative || undefined}
    >
      <Paper page={spread.left} side="left" number={bounded * 2 + 1} />
      <Paper page={spread.right} side="right" number={bounded * 2 + 2} />
    </div>
  );
});

export default function ProjectBook() {
  const [book, setBook] = useState<BookConfig>(initialBook as BookConfig);
  const [loaded, setLoaded] = useState(false),
    [assetsReady, setAssetsReady] = useState(false);
  const [state, dispatch] = useReducer(reducer, {
    index: 0,
    count: book.spreads.length,
    turn: null,
    queue: [],
    serial: 0,
  });
  const stage = useRef<HTMLDivElement>(null),
    interacted = useRef(false),
    introStarted = useRef(false);
  const introTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gesture = useRef<{ id: number; x: number; y: number } | null>(null);
  const consumedSwipe = useRef(false);
  const clearIntro = useCallback(() => {
    if (introTimer.current) clearTimeout(introTimer.current);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void fetch("/data/book.json", {
      cache: "no-store",
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((value) => {
        if (validBook(value)) setBook(value);
      })
      .catch(() => {})
      .finally(() => {
        if (!controller.signal.aborted) setLoaded(true);
      });
    return () => controller.abort();
  }, []);
  useEffect(() => {
    dispatch({ type: "reset", count: book.spreads.length });
  }, [book.spreads.length]);

  useEffect(() => {
    if (!loaded) return;
    let cancelled = false,
      timeout: ReturnType<typeof setTimeout>;
    const paths = [
      ...new Set(
        book.spreads.flatMap((spread) =>
          [...spread.left.images, ...spread.right.images].map(
            (image) => image.src,
          ),
        ),
      ),
    ];
    const images = paths.map((src) => {
      const image = new Image();
      image.src = src;
      return image.decode().catch(() => {});
    });
    // Never riffle incomplete pages on a slow connection. Keep the first spread
    // still if the ink and lettering have not finished loading in time.
    void Promise.race([
      Promise.allSettled([
        ...images,
        document.fonts.load('500 20px "Field Notes"'),
      ]).then(() => true),
      new Promise<boolean>((resolve) => {
        timeout = setTimeout(() => resolve(false), 1800);
      }),
    ]).then((ready) => {
      if (!cancelled) {
        if (!ready) introStarted.current = true;
        setAssetsReady(true);
      }
    });
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [book, loaded]);

  useEffect(() => {
    if (!assetsReady || introStarted.current || interacted.current) return;
    let seen = false;
    try {
      seen = sessionStorage.getItem(INTRO_KEY) === "1";
    } catch {}
    if (
      seen ||
      book.spreads.length < 2 ||
      matchMedia(handheldQuery).matches ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      introStarted.current = true;
      return;
    }
    introTimer.current = setTimeout(() => {
      if (interacted.current) return;
      introStarted.current = true;
      try {
        sessionStorage.setItem(INTRO_KEY, "1");
      } catch {}
      const turns = book.spreads.length * 2;
      for (let i = 0; i < turns; i++) {
        const progress = i / (turns - 1);
        dispatch({
          type: "turn",
          request: {
            direction: 1,
            intro: true,
            duration: Math.round(68 + 430 * Math.pow(progress, 3.4)),
          },
        });
      }
    }, 320);
    return clearIntro;
  }, [assetsReady, book.spreads.length, clearIntro]);

  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const settle = () => {
      clearIntro();
      dispatch({ type: "settle" });
    };
    const visibility = () => {
      if (document.hidden) settle();
    };
    const change = () => {
      if (preference.matches) settle();
    };
    preference.addEventListener("change", change);
    document.addEventListener("visibilitychange", visibility);
    const element = stage.current;
    let width = element?.getBoundingClientRect().width ?? 0;
    const observer = new ResizeObserver((entries) => {
      const nextWidth = entries[0].contentRect.width;
      if (Math.abs(width - nextWidth) > 1) settle();
      width = nextWidth;
    });
    if (element) {
      width = element.clientWidth;
      observer.observe(element);
    }
    return () => {
      preference.removeEventListener("change", change);
      document.removeEventListener("visibilitychange", visibility);
      observer.disconnect();
      clearIntro();
    };
  }, [clearIntro]);
  useEffect(() => {
    if (!state.turn) return;
    const { id, duration } = state.turn;
    const timer = setTimeout(() => {
      // A paused animation (for example in browser motion tools) still owns its
      // final frame; do not swap the paper underneath it on a wall-clock timer.
      const paused = stage.current
        ?.querySelector(".turning-page")
        ?.getAnimations()
        .some((animation) => animation.playState === "paused");
      if (!paused) dispatch({ type: "complete", id });
    }, duration + 120);
    return () => clearTimeout(timer);
  }, [state.turn]);

  const navigate = (direction: number) => {
    interacted.current = true;
    clearIntro();
    if (matchMedia("(prefers-reduced-motion: reduce)").matches)
      dispatch({ type: "immediate", direction });
    else
      dispatch({
        type: "turn",
        request: { direction, intro: false, duration: matchMedia(handheldQuery).matches ? 520 : 820 },
      });
  };
  const index = wrap(state.index, book.spreads.length),
    turn = state.turn;
  return (
    <section className="portfolio-hero" aria-label="Introduction" id="home">
      <HeroSkillIcons />
      <p className="hero-kicker">{book.kicker}</p>
      <h1 className="hero-name">{book.name}</h1>
      <div
        className="book-carousel field-notebook"
        role="region"
        aria-roledescription="carousel"
        aria-label="Creative field notes"
        tabIndex={0}
        onKeyDown={(event) => {
          if (
            (event.key === "ArrowRight" || event.key === "ArrowLeft") &&
            !event.altKey &&
            !event.ctrlKey &&
            !event.metaKey
          ) {
            event.preventDefault();
            navigate(event.key === "ArrowRight" ? 1 : -1);
          }
        }}
      >
        <button
          className="book-arrow previous"
          onClick={() => navigate(-1)}
          aria-label="Previous book page"
          disabled={book.spreads.length < 2}
        >
          <FiChevronLeft />
        </button>
        <div
          ref={stage}
          className={`book-stage creative-book pencil-book${turn?.intro ? " book-riffle" : ""}`}
          style={
            {
              "--riffle-blur": turn?.intro
                ? `${Math.max(0, (180 - turn.duration) / 70)}px`
                : "0px",
            } as CSSProperties
          }
          data-book-state={turn ? (turn.intro ? "intro" : "turning") : "rest"}
          data-current={index}
          data-from={turn?.from}
          data-to={turn?.to}
          data-duration={turn?.duration}
          onPointerDown={(event) => {
            consumedSwipe.current = false;
            if (!event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) {
              gesture.current = null;
              return;
            }
            gesture.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
          }}
          onPointerMove={(event) => {
            const start = gesture.current;
            if (!start || start.id !== event.pointerId) return;
            const dx = Math.abs(event.clientX - start.x), dy = Math.abs(event.clientY - start.y);
            if (dy > 12 && dy > dx) { gesture.current = null; return; }
            if (dx > 12 && dx > dy && !event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerCancel={() => { gesture.current = null; }}
          onPointerUp={(event) => {
            const start = gesture.current;
            gesture.current = null;
            if (!start || start.id !== event.pointerId) return;
            const dx = start.x - event.clientX, dy = start.y - event.clientY;
            if (Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(dy) * 1.2) {
              event.preventDefault();
              consumedSwipe.current = true;
              navigate(dx > 0 ? 1 : -1);
            }
          }}
          onClickCapture={(event) => {
            // A touch swipe can synthesize a click on its release target. That
            // click must not turn a second page; the next pointer-down resets it.
            if (consumedSwipe.current && event.detail > 0) {
              consumedSwipe.current = false;
              event.preventDefault();
              event.stopPropagation();
            }
          }}
        >
          <div className="book-cover" />
          <div className="book-page-stack" />
          <Spread book={book} index={index} />
          {turn && (
            <>
              <div
                key={`incoming-${turn.id}`}
                className={`book-incoming-half ${turn.direction > 0 ? "incoming-right" : "incoming-left"}`}
                aria-hidden="true"
              >
                <Spread book={book} index={turn.to} decorative />
              </div>
              <div
                key={turn.id}
                className={`turning-page ${turn.direction > 0 ? "turn-forward" : "turn-backward"}${turn.intro ? " intro-turn" : ""}`}
                style={
                  {
                    "--turn-duration": `${turn.duration}ms`,
                    animationDuration: `${turn.duration}ms`,
                  } as CSSProperties
                }
                onAnimationEnd={(event) => {
                  if (event.target === event.currentTarget)
                    dispatch({ type: "complete", id: turn.id });
                }}
                aria-hidden="true"
              >
                <div className="turn-face turn-front">
                  <Spread book={book} index={turn.from} decorative />
                  <i className="paper-turn-shade" />
                </div>
                <div className="turn-face turn-reverse">
                  <Spread book={book} index={turn.to} decorative />
                  <i className="paper-turn-shade" />
                </div>
              </div>
            </>
          )}
          <div className="book-binding" />
          <button
            className="book-hit-area hit-left"
            onClick={() => navigate(-1)}
            aria-label="Turn to previous spread"
            tabIndex={-1}
            disabled={book.spreads.length < 2}
          />
          <button
            className="book-hit-area hit-right"
            onClick={() => navigate(1)}
            aria-label="Turn to next spread"
            tabIndex={-1}
            disabled={book.spreads.length < 2}
          />
        </div>
        <button
          className="book-arrow next"
          onClick={() => navigate(1)}
          aria-label="Next book page"
          disabled={book.spreads.length < 2}
        >
          <FiChevronRight />
        </button>
      </div>
      <div className="book-caption" aria-live={turn?.intro ? "off" : "polite"}>
        <span>
          {turn?.intro
            ? "A few pages from my world"
            : book.spreads[index].label}
        </span>
        <span className="book-pagination">
          {index + 1} / {book.spreads.length}
        </span>
      </div>
      <a href="#projects" className="hero-down" aria-label="Explore projects">
        <FiChevronsDown />
      </a>
    </section>
  );
}
