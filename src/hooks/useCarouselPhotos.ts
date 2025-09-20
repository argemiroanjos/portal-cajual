import { useState, useEffect } from "react"
import { photoService } from "@/services/photoService"
import type { Photo } from "@/components/gallery/types"

export function useCarouselPhotos() {
  const [photos, setPhotos] = useState<Photo[]>([])

  useEffect(() => {
    const load = async () => {
      const data = await photoService.fetchCarouselPhotos()
      setPhotos(data)
    }
    load()
  }, [])

  return photos
}
