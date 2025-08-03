"use client";
import { TechItem } from "@/reusable/WorkCard";
import React, { useState } from "react";
import { IoClose } from "react-icons/io5";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  iframeSrc: string;
  fallbackImageSrc?: string;
  fallbackImageSrcMobile?: string;

  projectName: string;
  overview: string;
  objectivePoints: string[];
  techStack: TechItem[];
  challenges: string[];
  issuesSolved: string[];
  learnings: string[];
}

const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  iframeSrc,
  projectName,
  overview,
  objectivePoints,
  fallbackImageSrc,
  fallbackImageSrcMobile,
  techStack,
  challenges,
  issuesSolved,
  learnings,
}) => {
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50  text-justify flex items-center justify-center bg-[var(--elevation-one)]/90 backdrop-blur-sm px-4 py-8">
      <div className="relative w-full max-w-6xl max-h-[95vh] overflow-y-auto bg-[var(--elevation-two)] border border-[var(--elevation-four)] rounded-[12px] p-6 text-[var(--text-primary)] shadow-lg">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xl"
        >
          <IoClose />
        </button>

        {/* Live Preview */}
        <div className="w-full h-[60vh] sm:h-[70vh] lg:h-[65vh] mt-4 mb-6 border border-[var(--elevation-four)] rounded-[8px] overflow-hidden relative">
          {fallbackImageSrc ? (
            <>
              <img
              src={fallbackImageSrcMobile}
              alt={`${projectName} Preview`}
              className=" md:hidden w-full h-full object-contain"
            />
             <img
              src={fallbackImageSrc}
              alt={`${projectName} Preview`}
              className="hidden md:block w-full h-full object-contain"
            />
            </>
           
          ) : (
            <>
              {!isIframeLoaded && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-[var(--elevation-two)] text-sm text-[var(--text-secondary)]">
                  Loading preview...
                </div>
              )}
              <iframe
                src={iframeSrc}
                title={`${projectName} Website Preview`}
                className="w-full h-full"
                loading="lazy"
                onLoad={() => setIsIframeLoaded(true)}
              />
            </>
          )}
        </div>

        <a
          href={iframeSrc}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[var(--accent)] hover:underline mt-2 inline-block"
        >
          Open Full Website ↗
        </a>

        {/* Modal Content */}
        <div className="space-y-6 mt-6 ">
          <h2 className="text-2xl font-semibold text-start">{projectName}</h2>

          <section>
            <h3 className="text-lg font-medium mb-2">Overview</h3>
            <p className="text-sm text-justify text-[var(--text-secondary)]">
              {overview}
            </p>
          </section>

          <section>
            <h3 className="text-lg font-medium mb-2">
              What the Project Is For
            </h3>
            <ul className="list-disc list-inside text-sm text-[var(--text-secondary)] space-y-1">
              {objectivePoints.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-medium mb-2">Tech Stack</h3>
            <div className="flex flex-wrap gap-4">
              {techStack.map((tech, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  {tech.icon}
                  <span>{tech.name}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-lg font-medium mb-2">Challenges</h3>
            <ul className="list-disc list-inside text-sm text-[var(--text-secondary)] space-y-1">
              {challenges.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-medium mb-2">Issues Solved</h3>
            <ul className="list-disc list-inside text-sm text-[var(--text-secondary)] space-y-1">
              {issuesSolved.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-medium mb-2">Key Learnings</h3>
            <ul className="list-disc list-inside text-sm text-[var(--text-secondary)] space-y-1">
              {learnings.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
