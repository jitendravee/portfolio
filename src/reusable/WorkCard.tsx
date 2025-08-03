"use client";
import React, { useState } from "react";
import TextBuilder from "./TextBuilder";
import { IoClose } from "react-icons/io5";
import ProjectModal from "@/components/ProjectModal";

interface WorkCardProps {
  companyName: string;
  companyLogo: string;
  projectName: string;
  description: string;
  techStack: TechItem[];
  fallbackImageSrc?: string;
  fallbackImageSrcMobile?: string;

  iframeSrc: string;
  overview: string;
  objectivePoints: string[];
  challenges: string[];
  issuesSolved: string[];
  learnings: string[];
}

export interface TechItem {
  name: string;
  icon: React.ReactNode;
}
const WorkCard: React.FC<WorkCardProps> = ({
  companyName,
  companyLogo,
  projectName,
  description,
  techStack,
  fallbackImageSrcMobile,
  iframeSrc,
  overview,
  fallbackImageSrc,
  objectivePoints,
  issuesSolved,
  learnings,
  challenges,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);

  const toggleFlip = () => {
    if (window.innerWidth < 768) {
      setIsFlipped(!isFlipped);
    }
  };

  return (
    <>
      {/* Card */}
      <div
        className="group relative w-full h-full [perspective:1200px]"
        onClick={toggleFlip}
      >
        <div
          className={`relative h-full w-full  transition-transform duration-700 [transform-style:preserve-3d] 
          ${isFlipped ? "-rotate-y-180" : ""}
          md:group-hover:-rotate-y-180`}
        >
          {/* Front */}
          <div className="relative w-full h-full flex flex-col gap-2 backface-hidden [transform:rotateY(0deg)] bg-[var(--elevation-one)] border border-[var(--elevation-four)] rounded-[8px] px-6 py-4 text-[var(--text-primary)]">
            <div className="flex items-center mb-2">
              <img
                src={companyLogo}
                alt={companyName}
                className="w-[38px] h-[30px] object-contain"
              />
              <TextBuilder
                text={companyName}
                isMain={true}
                className="text-[26px]"
              />
            </div>

            <TextBuilder
              text={projectName}
              className="text-[23px]"
              isMain={true}
            />
            <TextBuilder
              text={description}
              className="text-[15px] text-justify"
            />

            <div className="mt-4 flex flex-wrap gap-4">
              {techStack.map((tech, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  {tech.icon}
                  <span>{tech.name}</span>
                </div>
              ))}
            </div>

            {!isFlipped && (
              <div className="md:hidden absolute top-5 right-2 text-[10px] bg-[var(--elevation-four)] text-[var(--text-secondary)] px-2 py-[2px] rounded-full shadow">
                Tap to Flip
              </div>
            )}
            {!isFlipped && (
              <div className="hidden md:block absolute top-5 right-2 text-[10px] bg-[var(--elevation-four)] text-[var(--text-secondary)] px-2 py-[2px] rounded-full shadow">
                Hover to Flip
              </div>
            )}
          </div>

          {/* Back */}
          <div className="absolute top-0 left-0 w-full h-full [transform:rotateY(180deg)] backface-hidden bg-[var(--elevation-two)] border border-[var(--elevation-four)] rounded-[8px] flex items-center justify-center">
            <button
              className="cursor-pointer px-6 py-2 text-sm font-semibold text-[var(--text-primary)] bg-[var(--accent-opacity)] rounded hover:scale-105 transition-transform"
              onClick={(e) => {
                e.stopPropagation(); // prevent card flip
                setIsModalOpen(true);
              }}
            >
              View Project
            </button>
          </div>
        </div>
      </div>

      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        iframeSrc={iframeSrc}
        projectName={projectName}
        overview={overview}
        objectivePoints={objectivePoints}
        techStack={techStack}
        challenges={challenges}
        issuesSolved={issuesSolved}
        fallbackImageSrcMobile={fallbackImageSrcMobile}
        learnings={learnings}
        fallbackImageSrc={fallbackImageSrc}
      />
    </>
  );
};

export default WorkCard;
