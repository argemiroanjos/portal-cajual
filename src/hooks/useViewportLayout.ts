"use client";

import { useEffect, useMemo, useState } from "react";

export type Mode = "mobile" | "tablet" | "desktop";

export interface ViewportLayout {
  vw: number;
  vh: number;
  safeBottom: number;
  mode: Mode;
  dvhSupported: boolean;
}

export function useViewportLayout(): ViewportLayout {
  const [vw, setVw] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 0);
  const [vh, setVh] = useState<number>(typeof window !== "undefined" ? window.innerHeight : 0);
  const [safeBottom, setSafeBottom] = useState<number>(0);
  const [mode, setMode] = useState<Mode>("desktop");

  // Verifica se a unidade dvh é suportada
  const dvhSupported = useMemo<boolean>(() => {
    if (typeof window === "undefined") return false;
    if (!("CSS" in window)) return false;
    try {
      return window.CSS.supports("height: 100dvh");
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Configurações de safe-area-inset
    const root = document.documentElement;
    root.style.setProperty("--safe-bottom", "env(safe-area-inset-bottom)");
    const readSafeBottom = () => {
      const v = getComputedStyle(root).getPropertyValue("--safe-bottom");
      const parsed = parseFloat(v || "0");
      setSafeBottom(Number.isFinite(parsed) ? parsed : 0);
    };

    const onViewportChange = () => {
      // Largura e altura da viewport
      // Preferência para VisualViewport (corrige zoom e teclado virtual)
      const vv = window.visualViewport; // VisualViewport | null
      setVw(vv?.width ?? window.innerWidth);
      setVh(vv?.height ?? window.innerHeight);
      readSafeBottom();
    };

    onViewportChange();

    // Eventos do VisualViewport
    const vv = window.visualViewport;
    vv?.addEventListener("resize", onViewportChange);
    vv?.addEventListener("scroll", onViewportChange);

    // Eventos de janela (fallback)
    window.addEventListener("resize", onViewportChange);
    window.addEventListener("orientationchange", onViewportChange);

    // Breakpoints reativos (mobile, tablet, desktop)
    const mTablet = window.matchMedia("(min-width: 768px)");
    const mDesktop = window.matchMedia("(min-width: 1024px)");
    const updateMode = () => {
      if (mDesktop.matches) setMode("desktop");
      else if (mTablet.matches) setMode("tablet");
      else setMode("mobile");
    };
    updateMode();
    mTablet.addEventListener("change", updateMode);
    mDesktop.addEventListener("change", updateMode);

    return () => {
      vv?.removeEventListener("resize", onViewportChange);
      vv?.removeEventListener("scroll", onViewportChange);
      window.removeEventListener("resize", onViewportChange);
      window.removeEventListener("orientationchange", onViewportChange);
      mTablet.removeEventListener("change", updateMode);
      mDesktop.removeEventListener("change", updateMode);
    };
  }, []);

  return { vw, vh, safeBottom, mode, dvhSupported };
}
