"use client";
import TextBuilder from "@/reusable/TextBuilder";
import Lottie from "lottie-react";
import React from "react";
import aboutLottie from "../../public/about.json";

const About = () => {
  return (
    <section id="about" className="scroll-mt-20">
      <div className="pb-4 flex flex-col items-center ">
        <TextBuilder text="About" isMain={true} className="text-[30px] mb-4" />

        <div className="flex flex-col   md:flex-col lg:flex-row items-center ">
          <div className="w-full lg:w-1/2 h-[240px] md:h-[300px]">
            <Lottie
              animationData={aboutLottie}
              loop={true}
              className="w-full h-full object-contain"
            />
          </div>

          <div className="w-full  lg:w-1/2">
            <TextBuilder
              className="text-[18px] text-justify"
              text="Hey there, I’m Jitendra! 👋🙂 I’m a 21-year-old full-stack developer currently in my 3rd year of B.Tech 🎓. I’ve been building and shipping production-grade mobile apps 📱, web platforms 💻, and admin tools 🛠️ since early in my degree — blending clean architecture 🧱, performance optimization ⚡, and great UX 🎨 into every product. I’ve worked across the stack with Flutter, Next.js, Redux, Firebase, and deeply integrated systems like UPI 💸, deep linking 🔗, real-time analytics 📊, and secure authentication 🔐. I'm also learning about AI 🧠 and model development, and I love exploring architectural patterns like SOLID 🧩 and layered design 🏗️. 

Outside of tech, I’m into football ⚽, geopolitics 🌍, and late-night rabbit holes 🕳️ on system design and world affairs. Always building, always learning — one repo at a time 🧑‍💻🚀."
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
