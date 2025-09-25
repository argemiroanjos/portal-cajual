"use client";

import React from "react";
import Image from "next/image";
import type { Photo, SocialMedia } from "../gallery/interfaces";

type SizeName = "large" | "medium" | "small";

const SIZES: Record<
  SizeName,
  { outerW: number; outerH: number; imgH: number; lateralPad: number }
> = {
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
  onClick?: () => void;
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
}: SlideProps) {
  const s = SIZES[size];
  const polaroidTopSpace = size === "large" ? 18 : size === "medium" ? 12 : 8;
  const baseBottomPad = size === "large" ? 36 : size === "medium" ? 32 : 28;
  const bottomPad = Math.round(baseBottomPad * 1.3);
  const imgBoxH = s.outerH - polaroidTopSpace - bottomPad - 8;
  const objectFit: "cover" | "contain" = "contain";

  // Nome do usuário
  const userName = photo.user
    ? `${photo.user.name} ${photo.user.lastName ?? ""}`.trim()
    : "Usuário";

  // Pega o Instagram e extrai o username da URL
  const instagramObj: SocialMedia | undefined = photo.user?.socialMedia?.find(
    (sm) => sm.platform === "instagram" && sm.url
  );

  const instagramLink = instagramObj?.url ?? null;
  const instagramUsername = instagramLink
    ? "@" + instagramLink.replace(/\/$/, "").split("/").pop()
    : null;

  // Hashtags separadas por espaço
  const hashtags = Array.isArray(photo.hashtags)
    ? photo.hashtags.map((tag) => tag.trim()).join(" ")
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
        transform: `translate(-50%, -50%) translateX(${offsetPx}px) scale(${scale}) rotate(${rotation}deg)`,
        zIndex: z,
        opacity,
        filter: blur ? `blur(${blur}px)` : "none",
      }}
      onClick={onClick}
    >
      <div
        className={`
          bg-slate-50 rounded-lg overflow-hidden flex flex-col h-full w-full
          border-4 border-[#001f54]
          shadow-[-8px_8px_0px_0px_#001f54]
          transform transition-transform
          -rotate-1
          hover:rotate-0 hover:shadow-[-2px_2px_0px_0px_#001f54]
          active:rotate-0 active:shadow-[-2px_2px_0px_0px_#001f54] active:scale-95
        `}
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
            className="w-full h-full rounded-t-md"
            style={{ objectFit }}
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
          {/* Nome + Instagram link com fallback */}
          <span className="text-sm font-semibold text-slate-900 text-center">
            {userName}
            {instagramUsername && instagramLink ? (
              <>
                {" · "}
                <a
                  href={instagramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {instagramUsername}
                </a>
              </>
            ) : null}
          </span>

          {/* Hashtags separadas por espaço */}
          {hashtags && (
            <span className="text-xs font-medium text-slate-600 mt-1">{hashtags}</span>
          )}
        </div>
      </div>
    </div>
  );
}
