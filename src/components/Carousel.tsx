"use client"

import React, { useState, useEffect, useMemo } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const photos = [
  "/photos/photo1.png",
  "/photos/photo2.png",
  "/photos/photo3.png",
  "/photos/photo4.png",
  "/photos/photo5.png",
  "/photos/photo6.png",
]

export default function Carousel() {
  const [current, setCurrent] = useState(0)

  // rotações estáveis entre -6 e +6 graus
  const rotations = useMemo(
    () => photos.map(() => (Math.random() * 12 - 6).toFixed(2)),
    []
  )

  // autoplay
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % photos.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const prev = () => setCurrent((c) => (c - 1 + photos.length) % photos.length)
  const next = () => setCurrent((c) => (c + 1) % photos.length)
  const goTo = (i: number) => setCurrent(i)

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-[920px] h-[420px]">
      <div className="relative flex items-center justify-center w-full h-full overflow-hidden">
        {photos.map((src, i) => (
          <div
            key={i}
            className={`absolute transition-all duration-700 ease-in-out transform ${
              i === current ? "opacity-100 scale-100 z-20" : "opacity-0 scale-90 z-10"
            }`}
            style={{ rotate: `${rotations[i]}deg` }}
          >
            <div className="relative transition-transform duration-300 hover:scale-105 active:scale-95">
              <svg width="260" height="320" viewBox="0 0 260 320" className="block">
                <rect x="0" y="0" width="260" height="320" rx="14" fill="#ffffff" stroke="#F6C85F" strokeWidth="6" />
                <image href={src} x="12" y="12" width="236" height="236" preserveAspectRatio="xMidYMid slice" />
                <rect x="0" y="256" width="260" height="64" fill="#ffffff" />
                {/* legenda */}
                <text x="130" y="296" textAnchor="middle" fontSize="14" fontWeight="600" fill="#0f172a">#Cajual2025</text>
              </svg>
            </div>
          </div>
        ))}

        {/* arrows */}
        <button onClick={prev} aria-label="Anterior"
          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-yellow-400 rounded-full shadow-lg hover:bg-yellow-500 z-30">
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        <button onClick={next} aria-label="Próximo"
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-yellow-400 rounded-full shadow-lg hover:bg-yellow-500 z-30">
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
