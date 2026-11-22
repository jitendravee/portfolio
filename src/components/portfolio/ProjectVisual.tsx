/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";
import type { Project } from "@/data/portfolio";

export default function ProjectVisual({
  project,
  detail = false,
}: {
  project: {
    title: string;
    companyName: string;
    subtitle: string;
    image: string;
    video?: string;
    tone: Project["tone"];
    kind: Project["kind"];
    gallery?: Project["gallery"];
  };
  detail?: boolean;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const element = video.current;
    if (!element) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const update = () => {
      if (preference.matches || document.hidden || !visible) element.pause();
      else void element.play().catch(() => {});
    };
    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting;
        update();
      },
      { threshold: 0.15 },
    );
    observer.observe(element);
    preference.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  return (
    <div
      className={`project-visual visual-${project.tone} kind-${project.kind}${detail ? " visual-detail" : ""}${project.video?.includes("/reels/") && !failed ? " has-recording" : ""}`}
    >
      {project.video && !failed ? (
        <video
          ref={video}
          src={project.video}
          poster={project.image}
          muted
          loop
          playsInline
          preload="metadata"
          onError={() => setFailed(true)}
          controls={detail}
          aria-label={`${project.title} product walkthrough`}
        />
      ) : project.kind === "artwork" ? (
        <div
          className="artwork-mosaic"
          aria-label="A collection of original apparel graphics"
        >
          {project.gallery?.slice(0, 6).map((item, index) => (
            <div
              key={item.src}
              className={`artwork-tile tile-${index}`}
              style={
                item.background ? { background: item.background } : undefined
              }
            >
              <img
                src={item.src}
                alt={item.alt}
                loading={detail ? "eager" : "lazy"}
              />
            </div>
          ))}
          <span className="artwork-mosaic-label">
            Bandadda · Graphic studies
          </span>
        </div>
      ) : project.kind === "community" ? (
        <div className="community-art">
          <img
            src="/creative/community.webp"
            alt="Bandadda music community brand imagery"
            className="community-scene"
          />
          <svg
            className="hanging-string"
            viewBox="0 0 1000 120"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M -10 22 Q 500 84 1010 18"
              fill="none"
              stroke="rgba(248, 241, 223, 0.55)"
              strokeWidth="2.2"
            />
          </svg>
          <div
            className="hanging-gallery"
            aria-label="Bandadda live music event posters hanging on threads"
          >
            {[
              {
                src: "/creative/events/event-1.jpg",
                alt: "Octopus Metal Fest event poster",
                className: "hang-1",
              },
              {
                src: "/creative/events/event-2.jpg",
                alt: "November 21st live music event poster",
                className: "hang-2",
              },
              {
                src: "/creative/events/event-3.png",
                alt: "An Evening of Rhythm event poster",
                className: "hang-3",
              },
              {
                src: "/creative/events/event-5.jpg",
                alt: "Bandadda gig night poster",
                className: "hang-4",
              },
              {
                src: "/creative/events/event-4.jpg",
                alt: "Bandadda community music showcase",
                className: "hang-5",
              },
            ].map((poster) => (
              <div
                key={poster.src}
                className={`hanging-item ${poster.className}`}
              >
                <span className="hanging-thread" aria-hidden="true" />
                <span className="hanging-clip" aria-hidden="true" />
                <div className="hanging-frame">
                  <img
                    src={poster.src}
                    alt={poster.alt}
                    loading={detail ? "eager" : "lazy"}
                  />
                </div>
              </div>
            ))}
          </div>
          <span>
            Good things
            <br />
            bring people together.
          </span>
        </div>
      ) : project.kind === "workflow" && project.image ? (
        <div className="automation-scene">
          <img
            src={project.image}
            alt={`${project.title} — automated pipeline from web form to sheets and email`}
            loading={detail ? "eager" : "lazy"}
          />
          <svg
            className="automation-wires"
            viewBox="0 0 1376 768"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            <defs>
              <filter
                id="wire-glow"
                x="-30%"
                y="-30%"
                width="160%"
                height="160%"
              >
                <feGaussianBlur stdDeviation="4.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {/* Wire 1: Form -> Sheets */}
            <path
              className="wire-base"
              d="M 432 348 C 472 340, 502 390, 562 384"
              filter="url(#wire-glow)"
            />
            <path
              className="wire-current wire-current-1"
              d="M 432 348 C 472 340, 502 390, 562 384"
              filter="url(#wire-glow)"
            />
            <path
              className="wire-spark wire-spark-1"
              d="M 432 348 C 472 340, 502 390, 562 384"
            />
            <circle className="wire-node wire-node-1" cx="432" cy="348" r="5" />
            <circle className="wire-node wire-node-2" cx="562" cy="384" r="5" />

            {/* Wire 2: Sheets -> Gmail */}
            <path
              className="wire-base"
              d="M 862 281 C 894 270, 926 306, 972 294"
              filter="url(#wire-glow)"
            />
            <path
              className="wire-current wire-current-2"
              d="M 862 281 C 894 270, 926 306, 972 294"
              filter="url(#wire-glow)"
            />
            <path
              className="wire-spark wire-spark-2"
              d="M 862 281 C 894 270, 926 306, 972 294"
            />
            <circle className="wire-node wire-node-3" cx="862" cy="281" r="5" />
            <circle className="wire-node wire-node-4" cx="972" cy="294" r="5" />
          </svg>
        </div>
      ) : project.kind === "workflow" && !project.image ? (
        <div
          className="workflow-art"
          aria-label="Website enquiry to Google Sheets to Gmail automation"
        >
          <span className="workflow-node">
            Website
            <br />
            <small>New enquiry</small>
          </span>
          <i />
          <span className="workflow-node sheets-node">
            Sheets
            <br />
            <small>Organise & qualify</small>
          </span>
          <i />
          <span className="workflow-node gmail-node">
            Gmail
            <br />
            <small>Personal follow-up</small>
          </span>
        </div>
      ) : project.kind === "type" ? (
        <div className="type-art">
          <span className="forge-mark">pf.</span>
          <strong>Praxis Forge</strong>
          <span>Ideas. Engineered.</span>
        </div>
      ) : project.kind === "brand" ? (
        <div className="brand-art">
          <img src={project.image} alt="SkillsPe" />
          <p>
            Train your skills.
            <br />
            <em>Trade your skills.</em>
          </p>
        </div>
      ) : project.kind === "phones" ? (
        <div className="phones-art">
          <div className="phones-glow" aria-hidden="true" />
          <div className="phones-rings" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="visual-wordmark">
            twig<span>g</span>
          </div>
          <div className="phones-stage">
            <div className="phone-wrap phone-left">
              <img
                src="/projects/twigg-2.webp"
                alt="Twigg app spending and balance breakdown"
                loading={detail ? "eager" : "lazy"}
              />
            </div>
            <div className="phone-wrap phone-center">
              <img
                src="/projects/twigg-1.webp"
                alt="Twigg app financial overview and peer insights"
                loading={detail ? "eager" : "lazy"}
              />
            </div>
            <div className="phone-wrap phone-right">
              <img
                src="/projects/twigg-3.webp"
                alt="Twigg AI financial co-pilot chat"
                loading={detail ? "eager" : "lazy"}
              />
            </div>
          </div>
        </div>
      ) : project.image ? (
        <img
          src={project.image}
          alt={`${project.title} — ${project.kind === "world" ? "travel product imagery" : "project preview"}`}
          loading={detail ? "eager" : "lazy"}
          onError={(event) => {
            event.currentTarget.style.display = "none";
            setFailed(true);
          }}
        />
      ) : null}
      {(!project.video || failed) &&
        (project.kind === "world" || project.kind === "photo" || failed) && (
          <div className="image-title">
            <span>{project.companyName}</span>
            <strong>{project.subtitle}</strong>
          </div>
        )}
      {project.kind === "browser" && (!project.video || failed) && (
        <div className="browser-chrome" aria-hidden="true">
          <i />
          <i />
          <i />
          <span>{project.title}</span>
        </div>
      )}
    </div>
  );
}
