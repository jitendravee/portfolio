"use client";
import React, { useState } from "react";
import TextBuilder from "@/reusable/TextBuilder";
import { GmailIcon, GithubIcon } from "@/utility/SvgUtility";

const contactLinks = [
  {
    label: "Email",
    value: "jitendrajat6397@gmail.com",
    href: "mailto:jitendrajat6397@gmail.com",
    icon: <GmailIcon />,
    cta: "Send a mail",
  },
  {
    label: "GitHub",
    value: "github.com/jitendravee",
    href: "https://github.com/jitendravee",
    icon: <GithubIcon />,
    cta: "View my work",
  },
  {
    label: "LinkedIn",
    value: "https://www.linkedin.com/in/jitendra-choudhary-525504252/",
    href: "https://www.linkedin.com/in/jitendra-choudhary-525504252/",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect
          x="2"
          y="9"
          width="4"
          height="12"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="4"
          cy="4"
          r="2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    cta: "Connect with me",
  },
];

const GetInTouch = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("jitendrajat6397@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="scroll-mt-20 w-full">
      <div className="flex flex-col items-center gap-2 mb-8">
        <TextBuilder text="Get In Touch" isMain={true} className="text-[30px]" />
        {/* <TextBuilder
          text="Open to freelance, full-time, and interesting problems."
          className="text-[15px] text-center"
        /> */}
      </div>

      {/* Email copy block — the fastest way to reach out */}
      <div
        onClick={handleCopyEmail}
        title="Click to copy email"
        className="
          group relative w-full cursor-pointer
          flex items-center justify-between gap-4
          bg-[var(--elevation-one)] border border-[var(--elevation-four)]
          hover:border-[var(--accent)] hover:bg-[var(--accent-opacity)]
          rounded-[12px] px-6 py-5 mb-4
          transition-all duration-300
        "
      >
        <div className="flex items-center gap-4">
          <div className="w-[42px] h-[42px] flex items-center justify-center rounded-[10px] bg-[var(--elevation-four)] text-[var(--text-primary)] group-hover:bg-[var(--accent-opacity)] transition-colors duration-300">
            <GmailIcon />
          </div>
          <div className="flex flex-col">
            <span
              style={{ fontFamily: "var(--font-two, monospace)" }}
              className="text-[13px] text-[var(--text-secondary)]"
            >
              quickest way
            </span>
            <span className="text-[16px] text-[var(--text-primary)] font-medium">
              jitendrajat6397@gmail.com
            </span>
          </div>
        </div>

        <div
          className="
            text-[12px] px-3 py-1 rounded-full shrink-0
            bg-[var(--elevation-four)] text-[var(--text-secondary)]
            group-hover:bg-[var(--accent)] group-hover:text-[var(--bg-color)]
            transition-all duration-300
          "
        >
          {copied ? "Copied ✓" : "Copy"}
        </div>
      </div>

      {/* Other links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {contactLinks.slice(1).map((link, idx) => (
          <a
            key={idx}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="
              group flex items-center justify-between gap-4
              bg-[var(--elevation-one)] border border-[var(--elevation-four)]
              hover:border-[var(--accent)] hover:bg-[var(--accent-opacity)]
              rounded-[12px] px-6 py-4
              transition-all duration-300 cursor-pointer
            "
          >
            <div className="flex items-center gap-4">
              <div className="w-[42px] h-[42px] flex items-center justify-center rounded-[10px] bg-[var(--elevation-four)] text-[var(--text-primary)] group-hover:bg-[var(--accent-opacity)] transition-colors duration-300">
                {link.icon}
              </div>
              <div className="flex flex-col">
                <span
                  style={{ fontFamily: "var(--font-two, monospace)" }}
                  className="text-[13px] text-[var(--text-secondary)]"
                >
                  {link.label}
                </span>
                {/* <span className="text-[15px] text-[var(--text-primary)] font-medium">
                  {link.value}
                </span> */}
              </div>
            </div>

            <span className="text-[20px] text-[var(--text-secondary)] group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all duration-300">
              ↗
            </span>
          </a>
        ))}
      </div>

      {/* Availability badge */}
      <div className="flex justify-center mt-6">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--elevation-one)] border border-[var(--elevation-four)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <TextBuilder
            text="Available for new projects"
            className="text-[13px]"
          />
        </div>
      </div>
    </section>
  );
};

export default GetInTouch;