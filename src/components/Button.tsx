import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  "aria-label"?: string;
}

export default function Button({ children, onClick, className, ...rest }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      {...rest}
      className={`
        flex items-center justify-center gap-2
        px-6 py-2
        rounded-full
        bg-yellow-400
        text-white font-bold text-lg
        shadow-[0_4px_0_0_#001f54,0_4px_8px_rgba(0,0,0,0.4)]
        border-2 border-[#001f54]
        hover:bg-yellow-300
        transition
        ${className || ""}
      `}
    >
      {children}
    </button>
  );
}
