"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type MouseEvent,
} from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { FiMaximize2, FiMinimize2, FiX } from "react-icons/fi";
import { projectBySlug } from "@/data/portfolio";

const ProjectDetails = dynamic(() => import("./ProjectDetails"), {
  loading: () => <p className="project-loading">Opening project…</p>,
});
const ProjectContext = createContext<((slug: string) => void) | null>(null);

export function ProjectNavigationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [slug, setSlug] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const scrollArea = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const open = useCallback((next: string) => {
    if (!projectBySlug(next)) return;
    const state = { ...window.history.state, portfolioProject: next };
    if (window.history.state?.portfolioProject)
      window.history.replaceState(state, "", `/work/${next}`);
    else {
      trigger.current = document.activeElement as HTMLElement;
      window.history.pushState(state, "", `/work/${next}`);
    }
    setSlug(next);
    scrollArea.current?.scrollTo({ top: 0, behavior: "instant" });
  }, []);
  const close = useCallback(() => {
    if (window.history.state?.portfolioProject) window.history.back();
    else setSlug(null);
  }, []);
  useEffect(() => {
    const restore = () =>
      setSlug(window.history.state?.portfolioProject ?? null);
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, []);
  const active = Boolean(slug);
  useEffect(() => {
    if (!active) return;
    const element = dialog.current;
    element?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      element?.close();
      document.body.style.overflow = previous;
      setExpanded(false);
      trigger.current?.focus({ preventScroll: true });
    };
  }, [active]);
  const project = slug ? projectBySlug(slug) : undefined;
  return (
    <ProjectContext.Provider value={open}>
      {children}
      <dialog
        ref={dialog}
        className={`project-dialog${expanded ? " dialog-expanded" : ""}`}
        aria-label={
          project ? `${project.title} project details` : "Project details"
        }
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        {project && (
          <div className="dialog-frame">
            <div className="dialog-toolbar">
              <button
                onClick={() => setExpanded(!expanded)}
                aria-label={expanded ? "Exit full screen" : "Expand project"}
              >
                {expanded ? <FiMinimize2 /> : <FiMaximize2 />}
              </button>
              <button onClick={close} aria-label="Close project">
                <FiX />
              </button>
            </div>
            <div className="dialog-scroll" ref={scrollArea}>
              <ProjectDetails
                project={project}
                onClose={close}
                onNavigate={open}
              />
            </div>
          </div>
        )}
      </dialog>
    </ProjectContext.Provider>
  );
}

export function ProjectLink({
  slug,
  children,
  className,
  order,
  label,
}: {
  slug: string;
  children: ReactNode;
  className?: string;
  order?: number;
  label: string;
}) {
  const open = useContext(ProjectContext);
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      open &&
      event.button === 0 &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.shiftKey &&
      !event.altKey
    ) {
      event.preventDefault();
      open(slug);
    }
  };
  return (
    <Link
      href={`/work/${slug}`}
      prefetch={false}
      className={className}
      style={{ order }}
      aria-label={label}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
}
