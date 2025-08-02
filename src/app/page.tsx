import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import ThemeToggle from "@/components/ToggleButton";
import TextBuilder from "@/reusable/TextBuilder";
import Image from "next/image";

export default function Home() {
  return (
<div className="w-full max-w-[1024px] p-4 px-8 mx-auto">
  <div className="w-full relative">
              <Navbar />

              {/* CV Button */}
              <div
                className="absolute z-20 right-0 w-[48px] h-[48px] bg-[var(--accent-opacity)] flex items-center justify-center rounded-full animate-[spin_15s_linear_infinite] hover:animate-none hover:scale-125 transition-all offset_ring cursor-pointer"
                title="Download CV"
              >
                <TextBuilder text="CV" className="text-[16px]" />
              </div>

              {/* Theme Toggle (optional to layout) */}
    <div className="pt-12 md:pt-20">
      <HeroSection />

    </div>
      
    

  </div>
<ThemeToggle />
</div>

  );
}
