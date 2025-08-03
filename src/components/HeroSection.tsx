"use client";
import React from "react";
import TextBuilder from "@/reusable/TextBuilder";
import {
  DiscordIcon,
  GithubIcon,
  GmailIcon,
  XIcon,
} from "@/utility/SvgUtility";
import Image from "next/image";
import { useTheme } from "next-themes";
import JitendraName from "./Jitendra";

export const socialLinks = [
  {
    icon: <GithubIcon />,
    href: "https://github.com/jitendravee",
    title: "GitHub",
  },
  {
    icon: <DiscordIcon />,
    href: "https://discord.com/users/yourid",
    title: "Discord",
  },
  {
    icon: <XIcon />,
    href: "https://x.com/yourhandle",
    title: "X (Twitter)",
  },
  {
    icon: <GmailIcon />,
    href: "mailto:jitendrajat6397@gmail.com",
    title: "Email",
  },
];

const HeroSection = () => {
  const { theme, setTheme } = useTheme();

  return (
    <section id="home" className="scroll-mt-20">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-4 md:w-[40%] ">
          <JitendraName
            onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
          />{" "}
          <TextBuilder
            text="Full-Stack Developer Crafting Web & Mobile Apps — From Pixel to Production."
            className="text-[22px] md:[26px]"
          />
          <div className="flex gap-4">
            {socialLinks.map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                title={item.title}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-all flex justify-center items-center w-[50px] h-[50px] bg-transparent border-none rounded-[10px] cursor-pointer hover:bg-[var(--elevation-one)] active:scale-[95%] offset_ring"
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>
        <div className='img rounded-[48px] w-[400px] h-[370px] aspect-square z-10 md:block self-start bg-[var(--elevation-one)] bg-cover bg-center bg-no-repeat bg-[url("https://imgs.search.brave.com/iky9_GfnXCjBDrS9JAZPqBbuSUoQ6O3zz3HXwignm4w/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA5LzcwLzAyLzA4/LzM2MF9GXzk3MDAy/MDg2Ml9xQjJ6NjZ6/WXgxRjRBTGF0T21w/cFlqclF2dnRIRjg4/UC5qcGc")] hidden md:block' />
      </div>
    </section>
  );
};

export default HeroSection;
