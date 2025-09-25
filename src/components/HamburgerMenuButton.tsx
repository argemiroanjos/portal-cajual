"use client";

import * as React from "react";

interface HamburgerMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
  buttonRef?: React.RefObject<HTMLButtonElement | null>; // ⬅ agora é opcional
}

export default function HamburgerMenuButton({
  isOpen,
  onClick,
  className,
  buttonRef,
}: HamburgerMenuButtonProps) {
  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      className={`
        group flex items-center justify-center
        w-12 h-12
        rounded-full
        bg-yellow-400 border-2 border-[#001f54]
        shadow-[0_4px_0_0_#001f54,0_4px_8px_rgba(0,0,0,0.4)]
        hover:bg-yellow-300
        focus:outline-none
        ${className || ""}
      `}
      aria-label="Abrir menu"
    >
      <div className="grid justify-items-center gap-1.5">
        <span
          className={`
            block h-1 w-8 rounded-full bg-white
            transition-transform duration-300 ease-in-out
            ${isOpen ? "rotate-45 translate-y-2.5" : ""}
          `}
        />
        <span
          className={`
            block h-1 w-8 rounded-full bg-white
            transition-transform duration-300 ease-in-out
            ${isOpen ? "scale-x-0" : ""}
          `}
        />
        <span
          className={`
            block h-1 w-8 rounded-full bg-white
            transition-transform duration-300 ease-in-out
            ${isOpen ? "-rotate-45 -translate-y-2.5" : ""}
          `}
        />
      </div>
    </button>
  );
}
