"use client"

import { useState } from "react"
import GalleryTabs from "./GalleryTab"
import GalleryGrid from "./GalleryGrid"
import Lightbox from "./Lightbox"
import Button from "../Button"
import Header from "../Header" // <-- importa o Header

import type { Photo } from "./interfaces"

type GalleryProps = {
  userPhotos: Photo[]
  allPhotos: Photo[]
  fetchMore?: (tab: "user" | "all") => Promise<Photo[]>
}

export default function Gallery({ userPhotos, allPhotos, fetchMore }: GalleryProps) {
  const [tab, setTab] = useState<"user" | "all">("user")
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const photosToDisplay = tab === "user" ? userPhotos : allPhotos
  const hasMore = false

  const handleLoadMore = async () => {
    if (!fetchMore) return
    await fetchMore(tab)
  }

  return (
    <main
      className="relative w-full min-h-screen px-4 py-6 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/assets/background.png')",
        backgroundAttachment: "scroll",
      }}
    >
      {/* Header fixo no topo, com logo que leva para home */}
      <Header />

      {/* Abas */}
      <GalleryTabs tab={tab} setTab={setTab} />

      {/* Grid de fotos */}
      <GalleryGrid
        photos={photosToDisplay}
        onPhotoClick={(photo) =>
          setSelectedIndex(photosToDisplay.findIndex((p) => p.id === photo.id))
        }
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
      />

      {/* Lightbox */}
      {selectedIndex !== null && (
        <Lightbox
          photos={photosToDisplay}
          startIndex={selectedIndex}
          onClose={() => setSelectedIndex(null)}
        />
      )}
    </main>
  )
}
