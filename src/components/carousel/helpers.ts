import type { Mode, SizeName } from "./types";

export function getCenterSize(mode: Mode, vw: number) {
  if (typeof window === "undefined") return 240;
  if (mode === "desktop") return 420;
  if (mode === "tablet") return 320;
  return Math.min(vw * 0.9, 240);
}

export function getSpacingFactor(mode: Mode) {
  return mode === "desktop" ? 0.54 : 0.6;
}

export function getArrowSize(mode: Mode) {
  return mode === "desktop" ? 50 : mode === "tablet" ? 44 : 40;
}

export function getGutter(mode: Mode) {
  const half = getArrowSize(mode) / 2;
  const pad = mode === "desktop" ? 60 : mode === "tablet" ? 52 : 40;
  return Math.round(half + pad);
}

export function computeParams(
  offset: number,
  centerSize: number,
  spacingFactor: number,
  mode: Mode
) {
  const abs = Math.abs(offset);
  const tx = offset * centerSize * spacingFactor;

  if (mode === "mobile") {
    if (abs === 0) return { size: "medium" as SizeName, z: 30, scale: 0.92, blur: 0, opacity: 1, tx };
    if (abs === 1) return { size: "small" as SizeName, z: 20, scale: 0.86, blur: 0, opacity: 0.9, tx };
    if (abs === 2) return { size: "small" as SizeName, z: 10, scale: 0.8, blur: 2, opacity: 0.75, tx };
    return { size: "small" as SizeName, z: 0, scale: 0.7, blur: 4, opacity: 0, tx };
  }

  if (abs === 0) return { size: "large" as SizeName, z: 30, scale: 1, blur: 0, opacity: 1, tx };
  if (abs === 1) return { size: "medium" as SizeName, z: 20, scale: 0.9, blur: 0, opacity: 0.85, tx };
  if (abs === 2) return { size: "small" as SizeName, z: 10, scale: 0.75, blur: 3, opacity: 0.7, tx };
  return { size: "small" as SizeName, z: 0, scale: 0.6, blur: 6, opacity: 0, tx };
}
