/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { projects, type Project } from "@/data/portfolio";
import ProjectVisual from "./ProjectVisual";
export default function ProjectDetails({
  project,
  onClose,
  onNavigate,
}: {
  project: Project;
  onClose?: () => void;
  onNavigate?: (slug: string) => void;
}) {
  const next =
    projects[
      (projects.findIndex((item) => item.slug === project.slug) + 1) %
        projects.length
    ];
  const sections =
    project.sections ??
    [
      { title: "The brief", points: project.objectivePoints },
      { title: "The challenges", points: project.challenges },
      { title: "How I built it", points: project.issuesSolved },
      { title: "What I took away", points: project.learnings },
    ].filter((section) => section.points.length > 0);
  return (
    <article className="project-page">
      <Link
        href="/#projects"
        className="back-link"
        onClick={
          onClose
            ? (event) => {
                event.preventDefault();
                onClose();
              }
            : undefined
        }
      >
        All projects
      </Link>
      <div className="project-heading">
        <p className="eyebrow">{project.companyName}</p>
        <h1>{project.title}</h1>
      </div>
      <dl className="project-facts">
        <div>
          <dt>Type</dt>
          <dd>{project.category}</dd>
        </div>
        <div>
          <dt>Platform</dt>
          <dd>{project.platform}</dd>
        </div>
        <div>
          <dt>
            {project.group === "graphics" || project.group === "stories"
              ? "Focus"
              : "Stack"}
          </dt>
          <dd>{project.techStack.slice(0, 5).join(" · ")}</dd>
        </div>
        <div>
          <dt>Links</dt>
          <dd>
            {project.iframeSrc ? (
              <a href={project.iframeSrc} target="_blank" rel="noreferrer">
                {project.iframeSrc.includes("play.google")
                  ? "View on Google Play"
                  : "Visit live project"}
              </a>
            ) : (
              "Preview below"
            )}
          </dd>
        </div>
      </dl>
      <div className="project-feature">
        <ProjectVisual
          key={project.slug}
          project={{ ...project, video: project.detailVideo || project.video }}
          detail
        />
      </div>
      <div className="case-study">
        <section>
          <h2>Overview</h2>
          <p>{project.overview}</p>
          <p>{project.description}</p>
        </section>
        {sections.map(
          (section: { title: string; body?: string; points?: string[] }) => (
            <section key={section.title}>
              <h2>{section.title}</h2>
              {section.body && <p>{section.body}</p>}
              {!!section.points?.length && (
                <ul>
                  {section.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              )}
            </section>
          ),
        )}
        {!!project.gallery?.length && (
          <section
            className={`case-gallery gallery-${project.kind}`}
            aria-label={`${project.title} gallery`}
          >
            <h2>
              {project.kind === "artwork" ? "The collection" : "A closer look"}
            </h2>
            <div className="case-gallery-grid">
              {project.gallery.map((item) => (
                <figure key={item.src}>
                  <div
                    style={
                      item.background
                        ? { background: item.background }
                        : undefined
                    }
                  >
                    <img src={item.src} alt={item.alt} loading="lazy" />
                  </div>
                  <figcaption>{item.caption}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}
        <section>
          <h2>
            {project.group === "graphics"
              ? "Practice & tools"
              : project.group === "stories"
                ? "The craft"
                : "Built with"}
          </h2>
          <div className="stack-tags">
            {project.techStack.map((tech) => (
              <span key={tech}>{tech}</span>
            ))}
          </div>
        </section>
        {project.fallbackImageSrcMobile &&
          !project.fallbackImageSrcMobile.startsWith("http") &&
          project.fallbackImageSrcMobile !== "/playstore.gif" && (
            <figure className="mobile-figure">
              <img
                src={project.fallbackImageSrcMobile}
                alt={`${project.title} mobile interface`}
                loading="lazy"
              />
              <figcaption>A closer look at the mobile experience.</figcaption>
            </figure>
          )}
      </div>
      <Link
        className="next-project"
        href={`/work/${next.slug}`}
        onClick={
          onNavigate
            ? (event) => {
                if (
                  !event.metaKey &&
                  !event.ctrlKey &&
                  !event.shiftKey &&
                  !event.altKey
                ) {
                  event.preventDefault();
                  onNavigate(next.slug);
                }
              }
            : undefined
        }
      >
        <span>Next project</span>
        <strong>{next.title}</strong>
        <span>{next.category}</span>
      </Link>
    </article>
  );
}
