export type Mode = "mobile" | "tablet" | "desktop";
export type SizeName = "large" | "medium" | "small";

export type Photo = {
  id: string;
  src: string;
  alt?: string;
  width?: number;
  height?: number;
};
