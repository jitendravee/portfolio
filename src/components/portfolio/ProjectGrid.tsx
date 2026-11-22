"use client";
import { useRef, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { ProjectLink } from "./ProjectNavigation";
import { projects, type Project } from "@/data/portfolio";
import ProjectVisual from "./ProjectVisual";
import GalleryCursor from "./GalleryCursor";

const INITIAL_VISIBLE = 6;

const filters = [
  { id: "all", label: "All work" },
  { id: "products", label: "Products" },
  { id: "graphics", label: "Graphic design" },
  { id: "stories", label: "Stories & community" },
  { id: "systems", label: "Systems" },
] as const;
export default function ProjectGrid({
  items = projects,
}: {
  items?: Project[];
}) {
  const [filter, setFilter] = useState<string>("all");
  const [expanded, setExpanded] = useState<boolean>(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const selected =
    filter === "all"
      ? items
      : items.filter((project) => project.group === filter);
  const hasMore = selected.length > INITIAL_VISIBLE;
  const columns = [
    selected.filter((_, i) => i % 2 === 0),
    selected.filter((_, i) => i % 2 === 1),
  ];
  const initialPerCol = INITIAL_VISIBLE / 2;

  const handleToggle = () => {
    if (expanded) {
      setExpanded(false);
      const initialCards = gridRef.current?.querySelectorAll<HTMLElement>(
        ".project-card-initial",
      );
      if (initialCards && initialCards.length > 0) {
        let maxBottom = 0;
        initialCards.forEach((el) => {
          maxBottom = Math.max(
            maxBottom,
            el.getBoundingClientRect().bottom + window.scrollY,
          );
        });
        const targetTop = Math.max(0, maxBottom - window.innerHeight + 120);
        window.scrollTo({ top: targetTop, behavior: "smooth" });
      }
    } else {
      setExpanded(true);
    }
  };

  const renderCard = (project: Project, isInitial: boolean) => (
    <ProjectLink
      slug={project.slug}
      order={selected.indexOf(project)}
      className={`project-card${isInitial ? " project-card-initial" : " project-card-extra"}`}
      key={project.slug}
      label={`View ${project.title}: ${project.category}`}
    >
      <ProjectVisual project={project} />
      <div className="project-caption">
        <span>{project.title}</span>
        <span>{project.category}</span>
      </div>
    </ProjectLink>
  );

  return (
    <>
      <div className="gallery-filterbar">
        <div role="group" aria-label="Filter work by discipline">
          {filters.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setFilter(item.id);
                setExpanded(false);
              }}
              aria-pressed={filter === item.id}
            >
              {item.label}
            </button>
          ))}
        </div>
        <span className="gallery-count" aria-live="polite">
          {selected.length} {selected.length === 1 ? "work" : "works"}
        </span>
      </div>
      <div className="project-grid" ref={gridRef}>
        {columns.map((column, index) => {
          const initialCards = column.slice(0, initialPerCol);
          const extraCards = expanded ? column.slice(initialPerCol) : [];
          return (
            <div className="project-column" key={`${filter}-${index}`}>
              {initialCards.map((project) => renderCard(project, true))}
              {extraCards.map((project) => renderCard(project, false))}
            </div>
          );
        })}
      </div>
      {hasMore && (
        <div className="gallery-expand">
          <button
            type="button"
            className="gallery-expand-btn"
            aria-expanded={expanded}
            onClick={handleToggle}
          >
            <span>{expanded ? "Show less" : "View all"}</span>
            <FiChevronDown
              className={`gallery-expand-icon${expanded ? " is-open" : ""}`}
              aria-hidden="true"
            />
          </button>
        </div>
      )}
      <GalleryCursor />
    </>
  );
}
