"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import Button from "../Button"
import GalleryTabs from "./GalleryTab"
import GalleryGrid from "./GalleryGrid"
import type { Photo } from "./types"

type GalleryProps = {
  userPhotos: Photo[]
  allPhotos: Photo[]
  fetchMore?: (tab: "user" | "all") => Promise<Photo[]>
}

export default function Gallery({ userPhotos, allPhotos, fetchMore }: GalleryProps) {
  const [tab, setTab] = useState<"user" | "all">("user")

  // seleciona fotos conforme aba
  const currentPhotos = tab === "user" ? userPhotos : allPhotos
  const hasMore = false // você pode conectar a paginação depois
  const loadMore = () => fetchMore?.(tab)

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center px-4 py-4 max-w-[1024px] mx-auto">
      {/* Background full screen */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: "url('/assets/background.png')" }}
      />
      <div className="fixed inset-0 bg-black/30 z-10" /> {/* overlay escuro */}

      {/* Conteúdo da galeria */}
      <div className="relative z-20 w-full flex flex-col items-center">
        {/* Botão Voltar fixo e responsivo */}
        <div className="fixed top-4 left-4 z-30 max-sm:top-2 max-sm:left-2">
          <Link href="/">
            <Button className="px-4 py-2 text-sm gap-1">
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
          </Link>
        </div>

        {/* Abas da galeria */}
        <GalleryTabs tab={tab} setTab={setTab} />

        {/* Grid de fotos */}
        <GalleryGrid
          photos={currentPhotos}
          onPhotoClick={() => {}}
          hasMore={hasMore}
          onLoadMore={loadMore}
        />
      </div>
    </section>
  )
}
