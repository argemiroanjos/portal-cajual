"use client"

import React from "react"
import { X } from "lucide-react"
import Image from "next/image"
import type { Photo } from "./types"

type LightboxProps = {
  photo: Photo
  onClose: () => void
}

export default function Lightbox({ photo, onClose }: LightboxProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 overflow-auto">
      {/* Botão Fechar */}
      <button
        onClick={onClose}
        aria-label="Fechar"
        className="fixed top-6 right-6 p-2 rounded-full bg-yellow-400 hover:bg-yellow-500 text-white shadow-lg z-50"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Container da imagem */}
      <div className="relative max-w-full max-h-full flex items-center justify-center">
        <Image
          src={photo.src}
          alt={photo.id}
          width={1024}
          height={1024}
          className="object-contain max-w-[95vw] max-h-[95vh] rounded-lg shadow-lg"
        />
      </div>
    </div>
  )
}
