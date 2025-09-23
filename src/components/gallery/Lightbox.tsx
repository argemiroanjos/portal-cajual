"use client"

import React, { useState, useEffect } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { useSwipeable } from "react-swipeable"
import type { Photo } from "./interfaces"

type LightboxProps = {
  photos: Photo[]
  startIndex: number
  onClose: () => void
}

export default function Lightbox({ photos, startIndex, onClose }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(startIndex)

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0))
  }

  // Declarar hooks antes
  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrev,
    trackMouse: true,
  })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev()
      if (e.key === "ArrowRight") handleNext()
      if (e.key === "Escape") onClose()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose, photos.length])

  // Agora sim a verificação condicional do array
  if (!photos || photos.length === 0) return null

  const photo = photos[currentIndex]

  return (
    <div
      {...swipeHandlers}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 overflow-auto"
      onClick={onClose}
    >
      {/* Botão Fechar */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
        aria-label="Fechar"
        className="fixed top-6 right-6 p-2 rounded-full bg-yellow-400 hover:bg-yellow-500 text-white shadow-lg z-[60]"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Seta esquerda */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          handlePrev()
        }}
        aria-label="Foto anterior"
        className="absolute left-2 sm:left-4 md:left-8 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white shadow-lg z-[60]"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>

      {/* Imagem */}
      <div
        className="relative max-w-full max-h-full flex items-center justify-center z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={photo.src}
          alt={photo.alt ?? photo.id}
          width={1024}
          height={1024}
          className="object-contain max-w-[95vw] max-h-[95vh] rounded-lg shadow-lg"
        />
      </div>

      {/* Seta direita */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          handleNext()
        }}
        aria-label="Próxima foto"
        className="absolute right-2 sm:right-4 md:right-8 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white shadow-lg z-[60]"
      >
        <ChevronRight className="w-8 h-8" />
      </button>
    </div>
  )
}
