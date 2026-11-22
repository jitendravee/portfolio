"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { projects } from "@/data/portfolio";

export default function LegacyProjectLink() {
  const router = useRouter();
  useEffect(() => {
    const name = new URLSearchParams(window.location.search).get("project");
    const project = projects.find((item) => item.projectName === name);
    if (project) router.replace(`/work/${project.slug}`);
    else if (window.location.hash === "#about") router.replace("/about");
    if (window.location.hash === "#work")
      document.getElementById("projects")?.scrollIntoView();
  }, [router]);
  return null;
}
