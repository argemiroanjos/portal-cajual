"use client";

import Image from "next/image";
import type { Photo } from "@/components/gallery/interfaces";

type SizeName = "large" | "medium" | "small";
type FitMode = "cover" | "contain-mobile-large";

const SIZES: Record<SizeName, { outerW: number; outerH: number; imgH: number; lateralPad: number; bottomPad: number }> = {
  large:  { outerW: 420, outerH: 520, imgH: 392, lateralPad: 14, bottomPad: 32 },
  medium: { outerW: 320, outerH: 420, imgH: 292, lateralPad: 10, bottomPad: 26 },
  small:  { outerW: 240, outerH: 300, imgH: 180, lateralPad: 8,  bottomPad: 20 },
};

interface SlideProps {
  photo: Photo;
  rotation: number;
  offsetPx: number;
  size: SizeName;
  z: number;
  scale: number;
  blur: number;
  opacity: number;
  isCenter: boolean;
  onClick?: () => void;
  fitMode?: FitMode;
}

export default function Slide({
  photo,
  rotation,
  offsetPx,
  size,
  z,
  scale,
  blur,
  opacity,
  isCenter,
  onClick,
  fitMode = "cover",
}: SlideProps) {
  const s = SIZES[size];

  const polaroidTopSpace = size === "large" ? 18 : size === "medium" ? 12 : 8;
  const imgBoxH =
    fitMode === "contain-mobile-large"
      ? Math.min(
          s.outerH - polaroidTopSpace - s.bottomPad - 8,
          s.imgH + 36
        )
      : s.imgH;

  const objectFit = fitMode === "contain-mobile-large" ? "contain" : "cover";

  return (
    <div
      role={isCenter ? "group" : undefined}
      aria-hidden={!isCenter}
      className="absolute top-1/2 left-1/2"
      style={{
        width: `${s.outerW}px`,
        maxWidth: "96vw",
        height: `${s.outerH}px`,
        maxHeight: "72vh",
        transform: `translate(-50%, -50%) translateX(${offsetPx}px) scale(${scale}) rotate(${rotation}deg)`,
        zIndex: z,
        opacity,
        filter: blur ? `blur(${blur}px)` : "none",
      }}
      onClick={onClick}
    >
      {/* 🔹 Estilização da borda com sombra e rotação */}
      <div
        className={`
          bg-slate-50 rounded-lg overflow-hidden flex flex-col h-full w-full
          border-4 border-[#001f54]
          shadow-[-8px_8px_0px_0px_#001f54]
          transform transition-transform
          hover:rotate-0 hover:shadow-[-2px_2px_0px_0px_#001f54]
          -rotate-1
        `}
        className={`
          bg-slate-50 rounded-lg overflow-hidden flex flex-col h-full w-full
          border-4 border-[#001f54]
          shadow-[-8px_8px_0px_0px_#001f54]
          transform transition-transform
          hover:rotate-0 hover:shadow-[-2px_2px_0px_0px_#001f54]
          -rotate-1
        `}
      >
        {/* Espaço superior */}
        <div style={{ height: polaroidTopSpace, background: "#fff" }} />

        {/* Imagem */}
        <div
          className="relative flex items-center justify-center bg-white"
          className="relative flex items-center justify-center bg-white"
          style={{ height: imgBoxH, paddingLeft: s.lateralPad, paddingRight: s.lateralPad }}
        >
          <Image
            src={photo.src}
            alt={`Foto ${photo.id}`}
            width={s.outerW}
            height={imgBoxH}
            className="w-full h-full"
            style={{ objectFit }}
            priority={isCenter}
            loading={isCenter ? "eager" : "lazy"}
            decoding="sync"
          />
        </div>

        {/* Faixa inferior com usuário e hashtags */}
        <div
          style={{
            height: s.bottomPad,
            background: "#fff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <span className="text-sm font-semibold text-slate-900">#Cajual2025</span>
        </div>
      </div>
    </div>
  );
}