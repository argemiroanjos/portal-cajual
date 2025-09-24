"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Gallery from "@/components/gallery/Gallery"
import type { Photo } from "@/components/gallery/interfaces"
import { useAuth } from "@/hooks/useAuth"
import api from "@/lib/api"
import toast from "react-hot-toast"

export default function Page() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();

  const [userPhotos, setUserPhotos] = useState<Photo[]>([]);
  const [allPhotos, setAllPhotos] = useState<Photo[]>([]);

  const [userPhotosPage, setUserPhotosPage] = useState(1);
  const [allPhotosPage, setAllPhotosPage] = useState(1);
  const [hasNextUser, setHasNextUser] = useState(true);
  const [hasNextAll, setHasNextAll] = useState(true);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      toast.error("Você precisa estar logado para ver a galeria.");
      router.push('/login');
    }
  }, [user, isAuthLoading, router]);

  useEffect(() => {
    if (user) {
      const fetchInitial = async () => {
        try {
          const [userRes, allRes] = await Promise.all([
            api.get('/fotos/minhas-fotos?page=1'),
            api.get('/fotos?page=1')
          ]);

          const adaptedUserPhotos: Photo[] = userRes.data.docs.map((p: any) => ({ id: p._id, src: p.imageUrl }));
          const adaptedAllPhotos: Photo[] = allRes.data.docs.map((p: any) => ({ id: p._id, src: p.imageUrl }));

          setUserPhotos(adaptedUserPhotos);
          setAllPhotos(adaptedAllPhotos);
          
          setHasNextUser(userRes.data.hasNextPage);
          setHasNextAll(allRes.data.hasNextPage);
        } catch (error) {
          toast.error("Erro ao carregar as fotos.");
        }
      };
      fetchInitial();
    }
  }, [user]);

  const fetchMore = async (tab: "user" | "all") => {
    const isUserTab = tab === "user";
    const currentPage = isUserTab ? userPhotosPage : allPhotosPage;
    const hasNext = isUserTab ? hasNextUser : hasNextAll;

    if (!hasNext) return [];

    const nextPage = currentPage + 1;
    const endpoint = isUserTab ? `/fotos/minhas-fotos?page=${nextPage}` : `/fotos?page=${nextPage}`;

    try {
      const response = await api.get(endpoint);
      const newPhotosApi = response.data.docs;
      
      const adaptedNewPhotos: Photo[] = newPhotosApi.map((p: any) => ({ id: p._id, src: p.imageUrl }));

      if (isUserTab) {
        setUserPhotos((prev) => [...prev, ...adaptedNewPhotos]);
        setUserPhotosPage(nextPage);
        setHasNextUser(response.data.hasNextPage);
      } else {
        setAllPhotos((prev) => [...prev, ...adaptedNewPhotos]);
        setAllPhotosPage(nextPage);
        setHasNextAll(response.data.hasNextPage);
      }
      return adaptedNewPhotos;
    } catch (error) {
      toast.error("Erro ao carregar mais fotos.");
      return [];
    }
  }

  if (isAuthLoading || !user) {
    return (
      <main className="min-h-screen bg-sky-200 pt-20 flex justify-center items-center">
        <p className="text-xl font-semibold">Carregando...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-sky-200 pt-20">
      <Gallery userPhotos={userPhotos} allPhotos={allPhotos} fetchMore={fetchMore} />
    </main>
  )
}