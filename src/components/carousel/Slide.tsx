"use client";

import React from "react";
import Image from "next/image";
import type { Photo } from "../gallery/interfaces";
import { Instagram } from "lucide-react";

type SizeName = "large" | "medium" | "small";

const SIZES: Record<SizeName, { outerW: number; outerH: number; imgH: number; lateralPad: number }> = {
  large: { outerW: 420, outerH: 520, imgH: 392, lateralPad: 14 },
  medium: { outerW: 320, outerH: 420, imgH: 292, lateralPad: 10 },
  small: { outerW: 240, outerH: 300, imgH: 180, lateralPad: 8 },
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
  fitMode?: "contain" | "cover";
  onClick?: () => void;
  activeTab?: "all" | "user";
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
  fitMode = "contain",
  onClick,
  activeTab = "user",
}: SlideProps) {
  const s = SIZES[size];
  const polaroidTopSpace = size === "large" ? 18 : size === "medium" ? 12 : 8;
  const baseBottomPad = size === "large" ? 36 : size === "medium" ? 32 : 28;
  const bottomPad = Math.round(baseBottomPad * 1.3);
  const imgBoxH = s.outerH - polaroidTopSpace - bottomPad - 8;

  const userName = photo?.user ? `${photo.user.name} ${photo.user.lastName}`.trim() : "Usuário";

  const mainSocial = photo.user?.socialMedia?.find((s) => s.isPrincipal) || photo.user?.socialMedia?.[0];

  // Construir URL Instagram a partir do username
  const instagramUrl =
    mainSocial && mainSocial.platform === "instagram" && mainSocial.username
      ? `https://instagram.com/${mainSocial.username.replace(/^@/, "")}`
      : mainSocial?.url || "";

  const hasValidInstagramUrl = instagramUrl && instagramUrl !== "";

  const hashtags = Array.isArray(photo.hashtags)
    ? photo.hashtags.slice(0, 2).map((tag) => tag.trim()).join(" ")
    : "";

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
        transform: `translate(-50%, -50%) translateX(${offsetPx}px) rotate(${rotation}deg) scale(${scale})`,
        zIndex: z,
        opacity,
        filter: blur ? `blur(${blur}px)` : "none",
      }}
      onClick={onClick}
    >
      <div
        className="bg-slate-50 rounded-lg overflow-hidden flex flex-col h-full w-full border-4 border-[#001f54] shadow-[-8px_8px_0_0_#001f54] transition-transform -rotate-1 hover:rotate-0 hover:shadow-[-2px_2px_0_0_#001f54] active:rotate-0 active:shadow-[-2px_2px_0_0_#001f54] active:scale-95"
      >
        <div style={{ height: polaroidTopSpace, background: "#fff" }} />
        <div
          className="relative flex items-center justify-center"
          style={{
            height: imgBoxH,
            paddingLeft: s.lateralPad,
            paddingRight: s.lateralPad,
            width: "100%",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f3f4f6",
          }}
        >
          <Image
            src={photo.src}
            alt={`Foto ${photo.id}`}
            width={s.outerW}
            height={imgBoxH}
            className="w-full h-full object-contain"
            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
            priority={isCenter}
            loading={isCenter ? "eager" : "lazy"}
            decoding="sync"
          />
        </div>
        <div
          style={{
            height: bottomPad,
            background: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "0 4px",
          }}
        >
          <span className="text-sm font-semibold text-slate-900 text-center flex items-center gap-1">
            {activeTab === "all" && hasValidInstagramUrl ? (
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 text-blue-800 hover:text-yellow-500 transition-colors"
                tabIndex={0}
              >
                <Instagram size={16} />
                <span>{userName}</span>
              </a>
            ) : (
              <span>{userName}</span>
            )}
          </span>
          {hashtags && (
            <span className="text-xs font-medium text-slate-700 mt-1">{hashtags}</span>
          )}
        </div>
      </div>
    </div>
  );
}
