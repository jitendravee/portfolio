/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
export const metadata = { title: "Inspiration" };
export default function InspirationPage() {
  return (
    <div className="interior-page inspiration-page">
      <p className="eyebrow">A working collection</p>
      <h1 className="page-title">Things I come back to.</h1>
      <p className="page-intro">
        Good interfaces. Thoughtful systems. Spaces with a little soul.
      </p>
      <div className="inspiration-board">
        <Link
          className="inspiration-tile inspiration-photo"
          href="/work/saharsh-cabins"
        >
          <img
            src="/projects/saharsh.webp"
            alt="Saharsh cabin surrounded by greenery"
          />
          <span>Space to think.</span>
        </Link>
        <div className="inspiration-tile note-tile">
          <span className="eyebrow">A principle</span>
          <p>
            Make it work.
            <br />
            Make it clear.
            <br />
            <em>Make it feel right.</em>
          </p>
        </div>
        <Link
          className="inspiration-tile console-tile"
          href="/work/skillspe-admin"
        >
          <img src="/admin_console.png" alt="SkillsPe dashboard interface" />
          <span>Clarity in the details.</span>
        </Link>
        <div className="inspiration-tile code-tile">
          <span className="eyebrow">The architecture underneath</span>
          <pre>
            <code>
              {
                "idea\n  └── interface\n       └── domain\n            └── data\n\nsmall pieces.\nclear boundaries."
              }
            </code>
          </pre>
        </div>
        <div className="inspiration-tile interests-tile">
          <span>Beyond the screen</span>
          <p>
            football
            <br />
            geopolitics
            <br />
            system design
            <br />
            <em>why things work.</em>
          </p>
        </div>
        <a
          className="inspiration-tile reference-tile"
          href="https://matthewyu.dev/"
          target="_blank"
          rel="noreferrer"
        >
          <span className="eyebrow">Design reference</span>
          <p>Matthew Yu</p>
          <span>
            The sketchbook, the simplicity,
            <br />
            the sense of discovery.
          </span>
        </a>
      </div>
    </div>
  );
}
