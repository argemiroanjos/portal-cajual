"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Slide from "./Slide";
import Controlls from "./Controlls";
import { Photo } from "../gallery/interfaces";
import { useViewportLayout } from "@/hooks/useViewportLayout";
import api from "@/lib/api";
import toast from "react-hot-toast";

type SizeName = "large" | "medium" | "small";
type Mode = "mobile" | "tablet" | "desktop";

type SlideData = {
  idx: number;
  size: SizeName;
  z: number;
  scale: number;
  blur: number;
  opacity: number;
  tx: number;
  photo: Photo;
  rotation: number;
};

/* ======= Helpers ====== */
function getCenterSize(mode: Mode, vw: number) {
  if (typeof window === "undefined") return 240;
  if (mode === "desktop") return 420;
  if (mode === "tablet") return 320;
  return Math.min(vw * 0.9, 240);
}

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
    mode === "tablet" ? 52 :
    40;
  return Math.round(half + pad);
}

function computeParams(
  offset: number,
  centerSize: number,
  spacingFactor: number,
  mode: Mode
) {
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
  const actionRef = useRef(false);
  const prevCurrentRef = useRef<number | undefined>(undefined);
  const lastFetchTimeRef = useRef<number>(0);

  const { vw, vh, safeBottom, mode } = useViewportLayout();

  const loadPhotos = useCallback(async (isInitialLoad = false) => {
    const now = Date.now();
    const COOLDOWN_MS = 60000; // 60 segundos
    if (!isInitialLoad && now - lastFetchTimeRef.current < COOLDOWN_MS) {
      return;
    }
    
    try {
      const response = await api.get('/fotos?limit=20');
      const photosFromApi = response.data.docs;

      const adaptedPhotos: Photo[] = photosFromApi.map((item: any) => ({
        id: item._id,
        src: item.imageUrl,
      }));
      
      lastFetchTimeRef.current = Date.now();
      sessionStorage.setItem('carouselPhotos', JSON.stringify(adaptedPhotos));
      
      setPhotos((currentPhotos) => {
        const currentIds = new Set(currentPhotos.map(p => p.id));
        const newIds = new Set(adaptedPhotos.map(p => p.id));
        if (currentIds.size === newIds.size && [...currentIds].every(id => newIds.has(id))) {
          return currentPhotos;
        }
        rotationsRef.current = adaptedPhotos.map(() => Math.random() * 12 - 6);
        return adaptedPhotos;
      });

    } catch (error) {
      console.error("Erro ao carregar fotos para o carrossel:", error);
      if (isInitialLoad) {
        toast.error("Não foi possível carregar as fotos da galeria.");
      }
    }
  }, []);

  useEffect(() => {
    const cachedPhotos = sessionStorage.getItem('carouselPhotos');
    if (cachedPhotos) {
      const parsedPhotos = JSON.parse(cachedPhotos);
      setPhotos(parsedPhotos);
      rotationsRef.current = parsedPhotos.map(() => Math.random() * 12 - 6);
    }
    loadPhotos(true);

    const POLLING_INTERVAL_MS = 120000; // 2 minutos
    const intervalId = setInterval(() => {
      loadPhotos(false);
    }, POLLING_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [loadPhotos]);

  // EFEITO ATUALIZADO: A notificação foi removida
  useEffect(() => {
    if (prevCurrentRef.current === photos.length - 1 && current === 0 && photos.length > 1) {
      loadPhotos(false);
    }
    prevCurrentRef.current = current;
  }, [current, photos, loadPhotos]);

  useEffect(() => {
    if (!photos.length) return;
    const INTERVAL_MS = mode === "mobile" ? 4500 : 4000;

    function start() {
      stop();
      autoplayRef.current = window.setInterval(() => {
        if (!actionRef.current) {
          setCurrent((curr) => (photos.length ? (curr + 1) % photos.length : 0));
          actionRef.current = true;
          setTimeout(() => { actionRef.current = false; }, 200);
        }
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

  const prev = useCallback(() => {
    if (actionRef.current) return;
    actionRef.current = true;
    setCurrent((c) => (photos.length ? (c - 1 + photos.length) % photos.length : 0));
    setTimeout(() => { actionRef.current = false; }, 200);
  }, [photos]);

  const next = useCallback(() => {
    if (actionRef.current) return;
    actionRef.current = true;
    setCurrent((c) => (photos.length ? (c + 1) % photos.length : 0));
    setTimeout(() => { actionRef.current = false; }, 200);
  }, [photos]);

  if (!photos.length) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-white text-lg text-shadow-dark">Carregando fotos...</p>
      </div>
    );
  }
  
  const visibleHalf = mode === "desktop" ? 2 : mode === "tablet" ? 1 : 0;
  const centerSize = getCenterSize(mode, vw);
  const spacingFactor = getSpacingFactor(mode);
  const gutter = getGutter(mode);

  const slides: SlideData[] = photos.map((photo, i) => {
    let offset = i - current;
    if (offset > photos.length / 2) offset -= photos.length;
    if (offset < -photos.length / 2) offset += photos.length;
    if (Math.abs(offset) > visibleHalf) return null;

    return {
      idx: i,
      ...computeParams(offset, centerSize, spacingFactor, mode),
      photo,
      rotation: rotationsRef.current[i] ?? 0,
    };
  }).filter((s): s is SlideData => s !== null);

  const CTA_RESERVE = 60;
  const mobileHeightPx = Math.max(260, vh - CTA_RESERVE - safeBottom);
  const mobileMax = Math.min(440, Math.round(vh * 0.52));
  const containerHeight = mode === "desktop" ? 560 : mode === "tablet" ? 500 : Math.min(mobileHeightPx, mobileMax);

  const ARROW = getArrowSize(mode);
  const POLA_CENTER_W = mode === "mobile" ? 320 : 420;
  const POLA_NEIGHBOR_W = 320;
  const txNeighbor = getCenterSize(mode, vw) * getSpacingFactor(mode);
  const SAFE_INNER = 26;
  const SAFE_OUTER = 24;
  const anchorPx = mode === "mobile"
    ? (POLA_CENTER_W / 2) + SAFE_INNER + (ARROW / 2)
    : txNeighbor + (POLA_NEIGHBOR_W / 2) + SAFE_OUTER + (ARROW / 2);

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
        <Controlls mode={mode} onPrev={prev} onNext={next} anchorPx={anchorPx} />

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
            />
          ))}
        </div>
      </div>

      <div className={`flex gap-2 ${mode === "mobile" ? "mt-1 mb-1" : "mt-6 mb-6"}`}>
        {photos.map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full ${idx === current ? "bg-yellow-500" : "bg-gray-300"}`}
            aria-label={`Slide ${idx + 1}`}
            aria-current={idx === current ? "true" : "false"}
            onClick={() => setCurrent(idx)}
          />
        ))}
      </div>
    </section>
  );
}