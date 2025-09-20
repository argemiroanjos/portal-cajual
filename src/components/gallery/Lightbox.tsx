"use client"
import Image from "next/image"
import type { Photo } from "./types"

type LightboxProps = {
  photo: Photo | null
  onClose: () => void
}

export default function Lightbox({ photo, onClose }: LightboxProps) {
  if (!photo) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      <div className="relative max-w-[90vw] max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-black/60 text-white text-2xl font-bold hover:bg-black/80 transition"
        >
          ×
        </button>
        <Image
          src={photo.src}
          alt={photo.alt ?? "Foto do festival"}
          width={photo.width ?? 800}
          height={photo.height ?? 800}
          className="object-contain w-full h-full"
        />
      </div>
    </div>
  )
}
