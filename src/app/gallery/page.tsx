"use client"

import { useState, useEffect } from "react"
import Gallery from "@/components/gallery/Gallery"
import type { Photo } from "@/components/gallery/types"
import { photoService } from "@/services/photoService"

export default function Page() {
  const [userPhotos, setUserPhotos] = useState<Photo[]>([])
  const [allPhotos, setAllPhotos] = useState<Photo[]>([])

  // Carregar fotos iniciais
  useEffect(() => {
    const fetchInitial = async () => {
      const user = await photoService.fetchUserPhotos()
      const all = await photoService.fetchAllPhotos()
      setUserPhotos(user)
      setAllPhotos(all)
    }
    fetchInitial()
  }, [])

  // Função scroll infinito
  const fetchMore = async (tab: "user" | "all") => {
    await new Promise((r) => setTimeout(r, 1200))
    const newPhotos: Photo[] = Array.from({ length: 4 }).map((_, i) => ({
      id: `${tab}-${Date.now()}-${i}`,
      src: "/photos/photo1.png", // mock até backend
    }))
    if (tab === "user") setUserPhotos((prev) => [...prev, ...newPhotos])
    else setAllPhotos((prev) => [...prev, ...newPhotos])
    return newPhotos
  }

  return (
    <main className="min-h-screen bg-sky-200 pt-20">
      <Gallery userPhotos={userPhotos} allPhotos={allPhotos} fetchMore={fetchMore} />
    </main>
  )
}
