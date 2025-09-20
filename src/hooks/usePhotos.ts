// src/hooks/usePhotos.ts
import { useState, useEffect } from "react"

export type Photo = {
  id: string
  src: string
  alt?: string
  width?: number
  height?: number
}

export function useCarouselPhotos() {
  const [photos, setPhotos] = useState<Photo[]>([])

  useEffect(() => {
    // simulação local
    setPhotos([
      { id: "1", src: "/photos/photo1.png" },
      { id: "2", src: "/photos/photo2.png" },
      { id: "3", src: "/photos/photo3.png" },
      { id: "4", src: "/photos/photo4.png" },
      { id: "5", src: "/photos/photo5.png" },
      { id: "6", src: "/photos/photo6.png" },
    ])
  }, [])

  return photos
}
