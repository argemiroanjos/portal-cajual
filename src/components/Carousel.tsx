"use client"

import React, { useState, useEffect, useMemo } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { photoService } from "@/services/photoService"
import type { Photo } from "@/components/gallery/types"

export default function Carousel() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const fetchPhotos = async () => {
      const data = await photoService.fetchCarouselPhotos()
      setPhotos(data)
    }
    fetchPhotos()
  }, [])

  const rotations = useMemo(
    () => photos.map(() => (Math.random() * 12 - 6).toFixed(2)),
    [photos]
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (photos.length ? (prev + 1) % photos.length : 0))
    }, 4000)
    return () => clearInterval(interval)
  }, [photos])

  const prev = () => setCurrent((c) => (photos.length ? (c - 1 + photos.length) % photos.length : 0))
  const next = () => setCurrent((c) => (photos.length ? (c + 1) % photos.length : 0))
  const goTo = (i: number) => setCurrent(i)

  if (!photos.length) return null

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-[920px] h-[420px]">
      <div className="relative flex items-center justify-center w-full h-full overflow-hidden">
        {photos.map((photo, i) => (
          <div
            key={photo.id}
            className={`absolute transition-all duration-700 ease-in-out transform ${
              i === current ? "opacity-100 scale-100 z-20" : "opacity-0 scale-90 z-10"
            }`}
            style={{ rotate: `${rotations[i]}deg` }}
          >
            <div className="relative transition-transform duration-300 hover:scale-105 active:scale-95">
              <svg width="260" height="320" viewBox="0 0 260 320" className="block">
                {/* Sombra atrás da borda */}
                <defs>
                  <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.15" />
                  </filter>
                </defs>

                {/* Polaroid com borda amarela e sombra */}
                <rect
                  x="0"
                  y="0"
                  width="260"
                  height="320"
                  rx="14"
                  fill="#ffffff"
                  stroke="#F6C85F"
                  strokeWidth="6"
                  filter="url(#shadow)"
                />

                {/* Imagem */}
                <image
                  href={photo.src}
                  x="12"
                  y="12"
                  width="236"
                  height="236"
                  preserveAspectRatio="xMidYMid slice"
                />

                {/* Legenda */}
                <rect x="0" y="256" width="260" height="64" fill="#ffffff" />
                <text x="130" y="296" textAnchor="middle" fontSize="14" fontWeight="600" fill="#0f172a">
                  #Cajual2025
                </text>
              </svg>
            </div>
          </div>
        ))}

        {/* arrows */}
        <button
          onClick={prev}
          aria-label="Anterior"
          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-yellow-400 rounded-full shadow-lg hover:bg-yellow-500 z-30"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        <button
          onClick={next}
          aria-label="Próximo"
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-yellow-400 rounded-full shadow-lg hover:bg-yellow-500 z-30"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* indicadores */}
      <div className="flex mt-4 space-x-2">
        {photos.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            aria-label={`Ir para ${idx + 1}`}
            className={`w-3 h-3 rounded-full transition-all ${current === idx ? "bg-yellow-500 scale-110" : "bg-gray-300"}`}
          />
        ))}
      </div>
    </div>
  )
}
