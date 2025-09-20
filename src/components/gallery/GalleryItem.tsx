"use client";

import Image from "next/image";
import { forwardRef } from "react";
import type { Photo } from "./types";

type GalleryItemProps = {
  photo: Photo;
  onClick?: () => void;
};

const GalleryItem = forwardRef<HTMLDivElement, GalleryItemProps>(
  ({ photo, onClick }, ref) => (
    <div
      ref={ref}
      onClick={onClick}
      className="cursor-pointer rounded-xl overflow-hidden bg-white shadow-sm border border-yellow-200 animate-fadeIn"
    >
      <Image
        src={photo.src}
        alt={photo.alt ?? "Foto do festival"}
        width={photo.width ?? 600}
        height={photo.height ?? 600}
        className="w-full h-40 object-cover"
        placeholder="blur"
        blurDataURL="/assets/blur-placeholder.png"
      />
    </div>
  )
);

GalleryItem.displayName = "GalleryItem";

export default GalleryItem;
