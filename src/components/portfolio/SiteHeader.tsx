"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { FiGithub, FiLinkedin, FiMail, FiMoon, FiSun } from "react-icons/fi";
import { profile } from "@/data/portfolio";

export const navigation = [
  { label: "work", href: "/#projects" },
  { label: "play", href: "/play" },
  { label: "about", href: "/about" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const header = useRef<HTMLElement>(null);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const element = header.current;
    if (!element) return;
    const update = () => document.documentElement.style.setProperty("--site-header-height", `${Math.ceil(element.getBoundingClientRect().height)}px`);
    const observer = new ResizeObserver(update);
    observer.observe(element);
    update();
    return () => observer.disconnect();
  }, []);
  const dark = mounted && resolvedTheme === "dark";
  return (
    <header ref={header} className="site-header">
      <Link href="/" className="site-name">
        {profile.name}
      </Link>
      <nav aria-label="Main navigation" className="main-nav">
        {navigation.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            aria-current={
              (
                item.label === "work"
                  ? pathname === "/" || pathname.startsWith("/work")
                  : pathname.startsWith(item.href)
              )
                ? "page"
                : undefined
            }
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="header-tools">
        <a
          href={profile.github}
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
        >
          <FiGithub />
        </a>
        <a
          href={profile.linkedin}
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn"
        >
          <FiLinkedin />
        </a>
        <a
          href={`mailto:${profile.email}`}
          aria-label={`Email ${profile.email}`}
        >
          <FiMail />
        </a>
        <span className="tool-divider" />
        <button
          type="button"
          onClick={() => setTheme(dark ? "light" : "dark")}
          aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {dark ? <FiSun /> : <FiMoon />}
        </button>
      </div>
    </header>
  );
}
