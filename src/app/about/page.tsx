import type { Metadata } from "next";
import { profile } from "@/data/portfolio";
import ExperienceTimeline from "@/components/portfolio/ExperienceTimeline";
export const metadata: Metadata = { title: "About" };
export default function AboutPage() {
  return (
    <article className="about-page interior-page">
      <p className="eyebrow">A little about me</p>
      <div className="about-intro">
        <div className="bio">
          <h1>Hey, I’m Jitendra.</h1>
          <p>
            I’m a product designer and software engineer who likes turning
            complicated problems into things that feel simple to use.
          </p>
          <p>
            I take ideas from the first sketch to the things people use. My work
            spans product design, software, graphic design, automation, and
            content — including Bandadda, the music-led brand and community I’m
            building, and Wayvia, my journey-planning product.
          </p>
          <p>
            I’m studying Computer Science at MIT ADT University in Pune.
            Alongside building, I’m exploring AI, system design, and the small
            architectural decisions that make software easier to grow.
          </p>
          <p>
            Outside of code: football, geopolitics, and a good conversation
            about how things work.
          </p>
          <div className="about-links">
            <a href={profile.resume} target="_blank" rel="noreferrer">
              Read my résumé
            </a>
            <a href={`mailto:${profile.email}`}>Say hello</a>
          </div>
        </div>
        <div
          className="about-art"
          aria-label="Jitendra’s developer field notes"
        >
          <span className="about-monogram">jc.</span>
          <div className="about-art-note">
            a curious mind,
            <br />a builder at heart.
          </div>
          <span className="about-art-bottom">PUNE, INDIA · WEB & MOBILE</span>
        </div>
      </div>
      <ExperienceTimeline />
      <section className="about-bottom">
        <div>
          <h2>My toolkit</h2>
          <p>
            Flutter, Dart, React, Next.js, TypeScript, Node.js, Django,
            Firebase, MongoDB, and a healthy respect for clean architecture.
          </p>
        </div>
        <div>
          <h2>Let’s make something.</h2>
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
        </div>
      </section>
    </article>
  );
}
