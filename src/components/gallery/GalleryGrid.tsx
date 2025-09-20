"use client";

import React from "react";
import type { Photo } from "./types";
import GalleryItem from "./GalleryItem";

type GalleryGridProps = {
  photos: Photo[];
  onPhotoClick?: (photo: Photo) => void;
  hasMore?: boolean;
  onLoadMore?: () => void;
  loading?: boolean;
};

export default function GalleryGrid({
  photos,
  onPhotoClick,
  hasMore = false,
  onLoadMore,
  loading = false,
}: GalleryGridProps) {
  return (
    <>
      <div className="mt-4 grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {photos.map((photo) => (
          <GalleryItem
            key={photo.id}
            photo={photo}
            onClick={() => onPhotoClick?.(photo)}
          />
        ))}

        {/* skeleton placeholders enquanto carrega */}
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className="rounded-xl bg-slate-300 animate-pulse h-40 w-full"
            />
          ))}
      </div>

      {/* vazio */}
      {photos.length === 0 && !loading && (
        <div className="text-center text-slate-600 mt-8">Nenhuma foto por aqui ainda.</div>
      )}

      {/* botão carregar mais */}
      {hasMore && onLoadMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={onLoadMore}
            className="px-6 py-2 bg-yellow-500 text-white font-semibold rounded-full shadow hover:bg-yellow-600 transition"
          >
            Carregar mais
          </button>
        </div>
      )}
    </>
  );
}
