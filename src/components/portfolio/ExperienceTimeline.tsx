/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import {
  FiBriefcase,
  FiCode,
  FiGlobe,
  FiLayers,
  FiSmartphone,
  FiExternalLink,
} from "react-icons/fi";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import initialExperience from "../../../public/data/experience.json";

type ExperienceLink = { label: string; href: string; icon?: string };
type ExperienceEntry = {
  id: string;
  company: string;
  role: string;
  start: string;
  end: string | null;
  logo?: { src: string; background?: string };
  icon?: string;
  points: string[];
  links?: ExperienceLink[];
};
type ExperienceData = {
  heading: string;
  eyebrow: string;
  description?: string;
  entries: ExperienceEntry[];
};

const icons = {
  briefcase: FiBriefcase,
  code: FiCode,
  globe: FiGlobe,
  layers: FiLayers,
  smartphone: FiSmartphone,
  apple: FaApple,
  "play-store": FaGooglePlay,
};
function EntryIcon({ name }: { name?: string }) {
  const Icon = icons[name as keyof typeof icons] ?? FiBriefcase;
  return <Icon aria-hidden="true" />;
}
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
function isMonth(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-(0[1-9]|1[0-2])$/.test(value);
}
function isHref(value: unknown): value is string {
  return (
    typeof value === "string" &&
    (/^https?:\/\//.test(value) ||
      (value.startsWith("/") && !value.startsWith("//")))
  );
}
function isExperienceData(value: unknown): value is ExperienceData {
  if (
    !isRecord(value) ||
    typeof value.heading !== "string" ||
    typeof value.eyebrow !== "string" ||
    (value.description !== undefined &&
      typeof value.description !== "string") ||
    !Array.isArray(value.entries)
  )
    return false;
  const valid = value.entries.every(
    (entry) =>
      isRecord(entry) &&
      [entry.id, entry.company, entry.role].every(
        (field) => typeof field === "string" && field.length > 0,
      ) &&
      isMonth(entry.start) &&
      (entry.end === null || isMonth(entry.end)) &&
      (entry.icon === undefined || typeof entry.icon === "string") &&
      Array.isArray(entry.points) &&
      entry.points.every((point) => typeof point === "string") &&
      (entry.logo === undefined ||
        (isRecord(entry.logo) &&
          isHref(entry.logo.src) &&
          (entry.logo.background === undefined ||
            typeof entry.logo.background === "string"))) &&
      (entry.links === undefined ||
        (Array.isArray(entry.links) &&
          entry.links.every(
            (link) =>
              isRecord(link) &&
              typeof link.label === "string" &&
              isHref(link.href) &&
              (link.icon === undefined || typeof link.icon === "string"),
          ))),
  );
  return (
    valid &&
    new Set(value.entries.map((entry) => entry.id)).size ===
      value.entries.length
  );
}
const monthFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});
function formatMonth(value: string) {
  return monthFormatter.format(new Date(`${value}-01T00:00:00Z`));
}

export default function ExperienceTimeline() {
  const [data, setData] = useState<ExperienceData>(initialExperience);
  const [failedLogos, setFailedLogos] = useState<Set<string>>(new Set());
  const list = useRef<HTMLOListElement>(null);

  // The public JSON is fetched on each visit; replacing it does not require changing this component.
  useEffect(() => {
    const controller = new AbortController();
    void fetch("/data/experience.json", {
      cache: "no-store",
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error("Experience data unavailable");
        return response.json() as Promise<unknown>;
      })
      .then((value) => {
        if (isExperienceData(value)) setData(value);
        else
          console.warn(
            "Experience JSON is invalid; using the bundled experience data.",
          );
      })
      .catch((error) => {
        if (error.name !== "AbortError")
          console.warn("Using the bundled experience data.");
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const element = list.current;
    if (!element) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const rows = Array.from(
      element.querySelectorAll<HTMLElement>(".experience-item"),
    );
    let frame = 0,
      cancelled = false;
    let reveal: IntersectionObserver | undefined;

    const measure = () => {
      frame = 0;
      const marks = rows.map((row) =>
        row.querySelector<HTMLElement>(".experience-mark")!,
      );
      if (!marks.length) return;
      const bounds = element.getBoundingClientRect();
      const first = marks[0].getBoundingClientRect();
      const last = marks[marks.length - 1].getBoundingClientRect();
      const start = first.top + first.height / 2;
      const length = Math.max(0, last.top + last.height / 2 - start);
      const progress = preference.matches
        ? length
        : Math.max(0, Math.min(length, innerHeight * 0.5 - start));
      element.style.setProperty("--track-start", `${start - bounds.top}px`);
      element.style.setProperty("--track-length", `${length}px`);
      element.style.setProperty("--track-fill", `${progress}px`);
      rows.forEach((row, index) => {
        const mark = marks[index].getBoundingClientRect();
        row.classList.toggle(
          "is-reached",
          preference.matches ||
            mark.top + mark.height / 2 <= innerHeight * 0.5 + 1,
        );
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    const setupReveal = () => {
      reveal?.disconnect();
      element.classList.toggle("timeline-enhanced", !preference.matches);
      if (preference.matches)
        rows.forEach((row) => row.classList.add("is-visible"));
      else {
        reveal = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                reveal?.unobserve(entry.target);
              }
            });
          },
          { rootMargin: "0px 0px -150px 0px", threshold: 0 },
        );
        rows.forEach((row) => reveal?.observe(row));
      }
      schedule();
    };
    setupReveal();
    const resize = new ResizeObserver(schedule);
    resize.observe(element);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    preference.addEventListener("change", setupReveal);
    void document.fonts.ready.then(() => {
      if (!cancelled) schedule();
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      reveal?.disconnect();
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      preference.removeEventListener("change", setupReveal);
    };
  }, [data]);

  return (
    <section
      className="experience-timeline"
      id="experience"
      aria-labelledby="experience-heading"
    >
      <header className="experience-heading">
        <p className="eyebrow">{data.eyebrow}</p>
        <h2 id="experience-heading">
          {data.heading}
          <span aria-hidden="true">.</span>
        </h2>
        {data.description && (
          <p className="experience-intro">{data.description}</p>
        )}
      </header>
      <ol className="experience-track" ref={list}>
        {data.entries.map((entry) => (
          <li
            className="experience-item"
            key={entry.id}
            data-experience-id={entry.id}
          >
            <div className="experience-label">
              <h3>{entry.company}</h3>
              <p>
                <time dateTime={entry.start}>{formatMonth(entry.start)}</time>
                <span aria-hidden="true"> — </span>
                {entry.end ? (
                  <time dateTime={entry.end}>{formatMonth(entry.end)}</time>
                ) : (
                  <span className="experience-present">Present</span>
                )}
              </p>
            </div>
            <span
              className={`experience-mark${entry.logo && !failedLogos.has(entry.logo.src) ? " has-logo" : ""}`}
              style={
                entry.logo && !failedLogos.has(entry.logo.src)
                  ? ({
                      "--brand-color":
                        entry.logo.background ?? "var(--surface)",
                    } as CSSProperties)
                  : undefined
              }
              aria-hidden="true"
            >
              {entry.logo && !failedLogos.has(entry.logo.src) ? (
                <img
                  src={entry.logo.src}
                  alt=""
                  loading="lazy"
                  onError={() =>
                    setFailedLogos((previous) =>
                      new Set(previous).add(entry.logo!.src),
                    )
                  }
                />
              ) : (
                <EntryIcon name={entry.icon} />
              )}
            </span>
            <article
              className="experience-card"
              aria-label={`${entry.role} at ${entry.company}`}
            >
              <h4>{entry.role}</h4>
              <ul>
                {entry.points.map((point, index) => (
                  <li key={`${entry.id}-${index}`}>{point}</li>
                ))}
              </ul>
              {!!entry.links?.length && (
                <div className="experience-links">
                  {entry.links.map((link) => {
                    const content = (
                      <>
                        <EntryIcon name={link.icon ?? "globe"} />
                        <span>{link.label}</span>
                        {link.href.startsWith("http") && (
                          <FiExternalLink
                            aria-hidden="true"
                            className="experience-external"
                          />
                        )}
                      </>
                    );
                    return link.href.startsWith("/") ? (
                      <Link key={link.href} href={link.href}>
                        {content}
                      </Link>
                    ) : (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {content}
                      </a>
                    );
                  })}
                </div>
              )}
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}
