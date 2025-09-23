"use client"

import { useState } from "react"
import GalleryTabs from "./GalleryTab"
import GalleryGrid from "./GalleryGrid"
import Lightbox from "./Lightbox"
import Button from "../Button"

import type { Photo } from "./interfaces"
import { useRouter } from "next/navigation"

type GalleryProps = {
  userPhotos: Photo[]
  allPhotos: Photo[]
  fetchMore?: (tab: "user" | "all") => Promise<Photo[]>
}

export default function Gallery({ userPhotos, allPhotos, fetchMore }: GalleryProps) {
  const [tab, setTab] = useState<"user" | "all">("user")
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const router = useRouter()

  const photosToDisplay = tab === "user" ? userPhotos : allPhotos

  const hasMore = false // Placeholder: Implement logic to determine if more photos can be loaded

  const handleLoadMore = async () => {
    if (!fetchMore) return
    await fetchMore(tab)
  }

  return (
    <section className="relative w-full min-h-screen bg-home-pattern px-4 py-6">
      {/* Botão Voltar fixo */}
      <div className="fixed top-6 left-6 z-50">
        <Button onClick={() => router.push("/")}>Voltar</Button>
      </div>

      {/* Abas */}
      <GalleryTabs tab={tab} setTab={setTab} />

      {/* Grid de fotos */}
      <GalleryGrid
        photos={photosToDisplay}
        onPhotoClick={setSelectedPhoto}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
      />

      {/* Lightbox */}
      {selectedPhoto && (
        <Lightbox photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
      )}
    </section>
  )
}
