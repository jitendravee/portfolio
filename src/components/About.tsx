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
              text="Hey there, I’m Jitendra. I’m a 21-year-old full-stack developer in my 3rd year of B.Tech. I have experience building production-ready mobile apps, web platforms, and admin tools with a focus on clean architecture, performance, and user experience. My work spans across Flutter, Next.js, Redux, Firebase, and integrations such as UPI, deep linking, real-time analytics, and secure authentication.

I’m also exploring AI, model development, and software design principles like SOLID and layered architecture. Outside of tech, I’m interested in football, geopolitics, and system design."
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
