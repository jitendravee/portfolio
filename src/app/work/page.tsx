import ProjectGrid from "@/components/portfolio/ProjectGrid";
export const metadata = { title: "Work" };
export default function WorkPage() {
  return (
    <section className="interior-page">
      <p className="eyebrow">From pixel to production</p>
      <h1 className="page-title">Selected work.</h1>
      <ProjectGrid />
    </section>
  );
}
