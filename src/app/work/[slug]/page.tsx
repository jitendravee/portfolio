import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { projects, projectBySlug } from "@/data/portfolio";
import ProjectDetails from "@/components/portfolio/ProjectDetails";
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const project = projectBySlug((await params).slug);
  return {
    title: project?.title ?? "Project",
    description: project?.description,
  };
}
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const project = projectBySlug((await params).slug);
  if (!project) notFound();
  return <ProjectDetails project={project} />;
}
