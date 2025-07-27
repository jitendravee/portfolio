import ThemeToggle from "@/components/ToggleButton";
import TextBuilder from "@/reusable/TextBuilder";
import Image from "next/image";

export default function Home() {
  return (
<div className="w-full max-w-7xl p-4">
  <div className="w-full relative">
    <div className="absolute z-20 right-0 w-[48px] bg-[var(--accent-opacity)] h-[48px] flex items-center justify-center rounded-full animate-[spin_15s_linear_infinite] hover:animate-none hover:scale-125 transition-all offset_ring cursor-pointer
    ">
      <TextBuilder text="CV" className="text-[16px]"/>
    </div>

  </div>

</div>

  );
}
