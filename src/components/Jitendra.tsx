"use client";
import React from "react";

interface JitendraNameProps {
  onToggleTheme: () => void;
}

const JitendraName: React.FC<JitendraNameProps> = ({ onToggleTheme }) => {
  return (
    <h1 className="text-[55px] md:text-[96px] font-bold leading-none tracking-tight text-[var(--text-primary)] select-none">
      <span>J</span>
      <span
        onClick={onToggleTheme}
        className="relative cursor-pointer group"
        title="Toggle theme"
      >
        <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 md:w-6 md:h-6 rounded-full animate-bounce delay-500 border-4 transition-all bg-[#ffeccf] border-[#ffbb52] dark:bg-[#bc938c] dark:border-[#845443] offset_ring" />

        <span className="inline-block transform -translate-y-[2px] text-[50px] md:text-[86px]">
          l
        </span>
      </span>
      <span>tendra</span>
    </h1>
  );
};

export default JitendraName;
