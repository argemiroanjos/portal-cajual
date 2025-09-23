"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Slide from "./Slide";
import Controlls from "./Controlls";
import { Photo } from "../gallery/interfaces";
import { useViewportLayout } from "@/hooks/useViewportLayout";
// import { photoService } from "@/services/photoService";
// import type { ApiPhoto } from "@/services/photoService/types";

type SizeName = "large" | "medium" | "small";
type Mode = "mobile" | "tablet" | "desktop";

/* ========= Helpers ========= */
function getCenterSize(mode: Mode, vw: number) {
  if (typeof window === "undefined") return 240;
  if (mode === "desktop") return 420;
  if (mode === "tablet") return 320;
  return Math.min(vw * 0.9, 240);
} // [MDN position]
function getSpacingFactor(mode: Mode) {
  return mode === "desktop" ? 0.54 : 0.6;
}
function getArrowSize(mode: Mode) {
  return mode === "desktop" ? 50 : mode === "tablet" ? 44 : 40;
}

function getGutter(mode: Mode) {
  const half = getArrowSize(mode) / 2;
  const pad =
    mode === "desktop" ? 60 :
    mode === "tablet"  ? 52 :
                         40;
  return Math.round(half + pad);
}

function computeParams(
  offset: number,
  centerSize: number,
  spacingFactor: number,
  mode: Mode
): { size: SizeName; z: number; scale: number; blur: number; opacity: number; tx: number } {
  const abs = Math.abs(offset);
  const tx = offset * centerSize * spacingFactor;

  if (mode === "mobile") {
    if (abs === 0) return { size: "medium", z: 30, scale: 0.92, blur: 0, opacity: 1, tx };
    if (abs === 1) return { size: "small", z: 20, scale: 0.86, blur: 0, opacity: 0.9, tx };
    if (abs === 2) return { size: "small", z: 10, scale: 0.8, blur: 2, opacity: 0.75, tx };
    return { size: "small", z: 0, scale: 0.7, blur: 4, opacity: 0, tx };
  }

  if (abs === 0) return { size: "large", z: 30, scale: 1, blur: 0, opacity: 1, tx };
  if (abs === 1) return { size: "medium", z: 20, scale: 0.9, blur: 0, opacity: 0.85, tx };
  if (abs === 2) return { size: "small", z: 10, scale: 0.75, blur: 3, opacity: 0.7, tx };
  return { size: "small", z: 0, scale: 0.6, blur: 6, opacity: 0, tx };
}

/* ======= Componente ====== */
export default function Carousel() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [current, setCurrent] = useState(0);
  const rotationsRef = useRef<number[]>([]);
  const autoplayRef = useRef<number | null>(null);

  const { vw, vh, safeBottom, mode } = useViewportLayout(); // [MDN position]

  /* Carregamento (mock → backend futuro) */
  useEffect(() => {
    let mounted = true;
    async function load() {

      /*
      // 🔹 Integração API futura
      const apiData = await photoService.fetchCarouselPhotos();
      const adaptedPhotos = apiData.map((item:any) => ({
        id: item._id,
        src: item.imageUrl,
      }));
      setPhotos(adaptedPhotos);
      rotationsRef.current = adaptedPhotos.map(() => Math.random() * 12 - 6);
      */

      const local: Photo[] = [
        { id: "1", src: "/photos/photo1.png" },
        { id: "2", src: "/photos/photo2.png" },
        { id: "3", src: "/photos/photo3.png" },
        { id: "4", src: "/photos/photo4.png" },
        { id: "5", src: "/photos/photo5.png" },
        { id: "6", src: "/photos/photo6.png" },
      ];
      if (!mounted) return;
      setPhotos(local);
      rotationsRef.current = local.map(() => Math.random() * 12 - 6);
    }
    load();
    return () => { mounted = false; };
  }, []);

  /* Autoplay */
  useEffect(() => {
    if (!photos.length) return;
    const INTERVAL_MS = mode === "mobile" ? 4500 : 4000;

    function start() {
      stop();
      autoplayRef.current = window.setInterval(() => {
        setCurrent((curr) => (photos.length ? (curr + 1) % photos.length : 0));
      }, INTERVAL_MS);
    }
    function stop() {
      if (autoplayRef.current !== null) {
        clearInterval(autoplayRef.current);
        autoplayRef.current = null;
      }
    }
    function onVisibilityChange() { if (document.hidden) stop(); else start(); }

    start();
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => { stop(); document.removeEventListener("visibilitychange", onVisibilityChange); };
  }, [photos, mode]);

  /* Controles */
  const prev = useCallback(() => setCurrent((c) => (photos.length ? (c - 1 + photos.length) % photos.length : 0)), [photos]); // [MDN position]
  const next = useCallback(() => setCurrent((c) => (photos.length ? (c + 1) % photos.length : 0)), [photos]); // [MDN position]
  const goTo = useCallback((idx: number) => setCurrent(idx), []);

  if (!photos.length) return null;

  const visibleHalf = mode === "desktop" ? 2 : mode === "tablet" ? 1 : 0;
  const centerSize = getCenterSize(mode, vw);
  const spacingFactor = getSpacingFactor(mode);
  const gutter = getGutter(mode);

  /* Preparação dos slides visíveis */
  const slides = [];
  for (let i = 0; i < photos.length; i++) {
    let offset = i - current;
    if (offset > photos.length / 2) offset -= photos.length;
    if (offset < -photos.length / 2) offset += photos.length;

    if (Math.abs(offset) <= visibleHalf) {
      slides.push({
        idx: i,
        ...computeParams(offset, centerSize, spacingFactor, mode),
        photo: photos[i],
        rotation: rotationsRef.current[i] ?? 0,
      });
    }
  }

  /* Altura do container */
  const CTA_RESERVE = 60;
  const mobileHeightPx = Math.max(260, vh - CTA_RESERVE - safeBottom);
  const mobileMax = Math.min(440, Math.round(vh * 0.52));
  const containerHeight = mode === "desktop" ? 560 : mode === "tablet" ? 500 : Math.min(mobileHeightPx, mobileMax); // [MDN position]

  /* Cálculo da posição das setas */
  // Referência: polaroid central (mobile) ou vizinho (desk/tablet)
  // + folga de segurança + metade do diâmetro do botão
  const ARROW = getArrowSize(mode);
  const POLA_CENTER_W = mode === "mobile" ? 320 : 420;  
  const POLA_NEIGHBOR_W = 320;
  const txNeighbor = getCenterSize(mode, vw) * getSpacingFactor(mode);

  const SAFE_INNER = 26;  // mobile: folga fora da borda amarela do central
  const SAFE_OUTER = 24;  // desk/tablet: folga fora do card vizinho (blur)

  // Posição final da seta (distância da borda esquerda da seção)
  const anchorPx = mode === "mobile"
    ? (POLA_CENTER_W / 2) + SAFE_INNER + (ARROW / 2)
    : txNeighbor + (POLA_NEIGHBOR_W / 2) + SAFE_OUTER + (ARROW / 2);

  /* ========== Render ========= */
  return (
    <section
      className="relative w-full flex flex-col items-center"
      aria-label="Carousel de fotos"
      aria-roledescription="carousel"
      style={{
        maxWidth: mode === "mobile" ? "95vw" : "1040px",
        minWidth: mode === "mobile" ? "220px" : "320px",
        marginTop: mode === "mobile" ? 12 : 16,
        padding: mode === "mobile" ? "0 0.25rem" : undefined,
      }}
    >
      <div
        className="relative w-full flex justify-center items-center"
        style={{
          height: containerHeight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: mode === "mobile" ? `${safeBottom}px` : undefined,
        }}
        aria-live="polite"
      >
        {/* Controles */}
        <Controlls mode={mode} onPrev={prev} onNext={next} anchorPx={anchorPx} />

        {/* Slides */}
        <div
          id="carousel-slides"
          className="absolute top-0 bottom-0 flex items-center justify-center"
          style={{ left: gutter + 12, right: gutter + 12 }}
        >
          {slides.map((s) => (
            <Slide
              key={s.photo.id}
              photo={s.photo}
              rotation={s.rotation}
              offsetPx={s.tx}
              size={s.size}
              z={s.z}
              scale={s.scale}
              blur={s.blur}
              opacity={s.opacity}
              isCenter={s.idx === current}
              fitMode={mode === "mobile" ? "contain-mobile-large" : "cover"}
              onClick={() => {}}
            />
          ))}
        </div>
      </div>

      {/* Indicadores */}
      <div className={`flex gap-2 ${mode === "mobile" ? "mt-1 mb-1" : "mt-6 mb-6"}`}>
        {photos.map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full ${idx === current ? "bg-yellow-500" : "bg-gray-300"}`}
            onClick={() => goTo(idx)}
            aria-label={`Slide ${idx + 1}`}
            aria-current={idx === current ? "true" : "false"}
          />
        ))}
      </div>
    </section>
  );
}
