import ProjectBook from "@/components/portfolio/ProjectBook";
import ProjectGrid from "@/components/portfolio/ProjectGrid";
import LegacyProjectLink from "@/components/portfolio/LegacyProjectLink";
import ExperienceTimeline from "@/components/portfolio/ExperienceTimeline";
export default function Home() {
  return (
    <>
      <LegacyProjectLink />
      <ProjectBook />
      <section id="projects" className="projects-section">
        <h2 className="section-label">Selected work</h2>
        <ProjectGrid />
      </section>
      <div className="home-experience">
        <ExperienceTimeline />
      </div>
    </>
  );
}
