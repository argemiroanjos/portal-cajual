import type { Photo } from "@/components/gallery/types"

const mockUserPhotos: Photo[] = [
  { id: "u1", src: "/photos/photo1.png" },
  { id: "u2", src: "/photos/photo2.png" },
]

const mockAllPhotos: Photo[] = [
  { id: "a1", src: "/photos/photo1.png" },
  { id: "a2", src: "/photos/photo2.png" },
  { id: "a3", src: "/photos/photo3.png" },
  { id: "a4", src: "/photos/photo4.png" },
  { id: "a5", src: "/photos/photo5.png" },
  { id: "a6", src: "/photos/photo6.png" },
]

export const photoService = {
  fetchCarouselPhotos: async (): Promise<Photo[]> => {
    await new Promise(r => setTimeout(r, 300))
    return mockAllPhotos
  },

  fetchUserPhotos: async (): Promise<Photo[]> => {
    await new Promise(r => setTimeout(r, 300))
    return mockUserPhotos
  },

  fetchAllPhotos: async (): Promise<Photo[]> => {
    await new Promise(r => setTimeout(r, 300))
    return mockAllPhotos
  },
}
