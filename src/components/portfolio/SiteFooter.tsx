import Link from "next/link";
import { profile } from "@/data/portfolio";

export default function SiteFooter() {
  return (
    <footer className="site-footer" id="contact">
      <div>
        <p>
          © {profile.name} {new Date().getFullYear()}
        </p>
        <p className="footer-note">Made with care, from pixel to production.</p>
      </div>
      <nav aria-label="Social links">
        <a href={profile.github} target="_blank" rel="noreferrer">
          GitHub
        </a>
        <a href={profile.linkedin} target="_blank" rel="noreferrer">
          LinkedIn
        </a>
        <a href={`mailto:${profile.email}`}>Email</a>
        <a href={profile.resume} target="_blank" rel="noreferrer">
          Résumé
        </a>
      </nav>
      <nav aria-label="Footer navigation">
        <Link href="/">Home</Link>
        <Link href="/#projects">Work</Link>
        <Link href="/play">Play</Link>
        <Link href="/about">About</Link>
      </nav>
    </footer>
  );
}
