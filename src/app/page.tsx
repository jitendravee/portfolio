import About from "@/components/About";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import WorkSection from "@/components/WorkSection";
import TextBuilder from "@/reusable/TextBuilder";

export default function Home() {
  return (
    <div className="w-full max-w-[1124px] p-4 px-8 mx-auto">
      <div className="w-full relative">
        <Navbar />
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute z-20 right-0 w-[48px] h-[48px] bg-[var(--accent-opacity)] flex items-center justify-center rounded-full animate-[spin_15s_linear_infinite] hover:animate-none hover:scale-125 transition-all offset_ring cursor-pointer"
          title="Download CV"
        >
          <TextBuilder text="CV" className="text-[16px]" />
        </a>

        <div className="pt-12 md:pt-20 flex flex-col gap-8">
          <HeroSection />
          <About />
          <WorkSection />
          <Footer />
        </div>
      </div>
    </div>
  );
}
