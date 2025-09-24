"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Mode } from "./types";

interface Props {
  onPrev?: () => void;
  onNext?: () => void;
  mode: Mode;
  brandBlue?: string;
  anchorPx: number;
}

export default function Controlls({ onPrev, onNext, mode, anchorPx, brandBlue = "var(--brand-blue, #0C50A8)" }: Props) {
  const size = mode === "desktop" ? 50 : mode === "tablet" ? 44 : 40;
  const icon = mode === "desktop" ? 22 : mode === "tablet" ? 20 : 18;
  const debounceRef = useRef(false);

  const handlePrev = () => {
    if (debounceRef.current) return;
    debounceRef.current = true;
    onPrev?.();
    setTimeout(() => { debounceRef.current = false }, 200);
  };

  const handleNext = () => {
    if (debounceRef.current) return;
    debounceRef.current = true;
    onNext?.();
    setTimeout(() => { debounceRef.current = false }, 200);
  };

  const common =
    "flex items-center justify-center rounded-full bg-yellow-400 text-white shadow-lg hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600";

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        zIndex: 200, // garantir que fique acima do conteúdo do carrossel
      }}
    >
      <button
        onClick={handlePrev}
        aria-label="Anterior"
        className={`pointer-events-auto absolute ${common}`}
        style={{
          width: size,
          height: size,
          top: "50%",
          left: `calc(50% - ${anchorPx}px)`,
          transform: "translateY(-50%)",
          borderWidth: 4,
          borderStyle: "solid",
          borderColor: brandBlue,
        }}
      >
        <ChevronLeft style={{ width: icon, height: icon }} />
      </button>

      <button
        onClick={handleNext}
        aria-label="Próximo"
        className={`pointer-events-auto absolute ${common}`}
        style={{
          width: size,
          height: size,
          top: "50%",
          right: `calc(50% - ${anchorPx}px)`,
          transform: "translateY(-50%)",
          borderWidth: 4,
          borderStyle: "solid",
          borderColor: brandBlue,
        }}
      >
        <ChevronRight style={{ width: icon, height: icon }} />
      </button>
    </div>
  );
}
