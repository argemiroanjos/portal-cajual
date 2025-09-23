"use client";

import Image from "next/image";
import type { Photo } from "@/components/gallery/interfaces";

type SizeName = "large" | "medium" | "small";
type FitMode = "cover" | "contain-mobile-large";

const SIZES: Record<SizeName, { outerW: number; outerH: number; imgH: number; lateralPad: number; bottomPad: number }> = {
  large:  { outerW: 420, outerH: 520, imgH: 392, lateralPad: 14, bottomPad: 32 },
  medium: { outerW: 320, outerH: 420, imgH: 292, lateralPad: 10, bottomPad: 26 }, // ↑ leve ajuste p/ consistência
  small:  { outerW: 240, outerH: 300, imgH: 180, lateralPad: 8,  bottomPad: 20 }, // ↑ leve ajuste p/ consistência
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
  fitMode?: FitMode; // mobile: "contain-mobile-large", tablet/desktop: "cover"
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

  // Espaço no topo do polaroid (acima da imagem):
  // - Garante espaço para sombra da borda arredondada
  // - Evita que a imagem fique muito próxima da borda superior
  // - Varia conforme o tamanho do slide
  const polaroidTopSpace = size === "large" ? 18 : size === "medium" ? 12 : 8;

  // Altura da caixa da imagem (dentro do polaroid):
  // - "contain-mobile-large": aumenta a altura da caixa no mobile para melhorar a visibilidade da imagem
  // - Garante que a imagem não ultrapasse os limites do polaroid
  // - Garante um aumento perceptível no mobile
  const imgBoxH =
    fitMode === "contain-mobile-large"
      ? Math.min(
          s.outerH - polaroidTopSpace - s.bottomPad - 8, // margem extra para evitar overflow
          s.imgH + 36                                   // aumento perceptível no mobile
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
        borderRadius: 14,
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        background: "#fff",
      }}
      onClick={onClick}
    >
      <div
        className="bg-white rounded-lg shadow-lg border-4 border-white overflow-hidden flex flex-col h-full w-full"
        style={{
          boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
          borderColor: "#F6C85F",
          borderWidth: 6,
          borderStyle: "solid",
        }}
      >
        <div style={{ height: polaroidTopSpace, background: "#fff" }} />
        <div
          className="relative flex items-center justify-center"
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
