import records from "./projects.json";

export interface Project {
  slug: string;
  title: string;
  projectName: string;
  companyName: string;
  companyLogo: string;
  category: string;
  group: "products" | "graphics" | "stories" | "systems";
  kind: string;
  tone: string;
  image: string;
  video?: string;
  detailVideo?: string;
  subtitle: string;
  platform: string;
  iframeSrc: string;
  description: string;
  overview: string;
  techStack: string[];
  objectivePoints: string[];
  challenges: string[];
  issuesSolved: string[];
  learnings: string[];
  fallbackImageSrc?: string;
  fallbackImageSrcMobile?: string;
  gallery?: {
    src: string;
    alt: string;
    caption: string;
    background?: string;
  }[];
  sections?: { title: string; body?: string; points?: string[] }[];
}

export const projects = records as Project[];
export const projectBySlug = (slug: string) =>
  projects.find((project) => project.slug === slug);
export const profile = {
  name: "Jitendra Choudhary",
  email: "jitendrajat6397@gmail.com",
  github: "https://github.com/jitendravee",
  linkedin: "https://www.linkedin.com/in/jitendra-choudhary-525504252/",
  resume: "/Jitendra_Choudhary_Resume.pdf",
};
