"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Photo } from "@/components/gallery/interfaces";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import toast from "react-hot-toast";

import Header from "@/components/Header";
import GalleryCard from "@/components/gallery/GalleryCard";
import Button from "@/components/Button";
import { UploadModal } from "@/components/UploadModal";
import EmptyGallery from "@/components/gallery/EmptyGallery";

export default function GalleryPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<"all" | "user">("all");
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(true);
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);

  const [userPhotos, setUserPhotos] = useState<Photo[]>([]);
  const [allPhotos, setAllPhotos] = useState<Photo[]>([]);
  const [userPhotosPage, setUserPhotosPage] = useState(1);
  const [allPhotosPage, setAllPhotosPage] = useState(1);
  const [hasNextUser, setHasNextUser] = useState(true);
  const [hasNextAll, setHasNextAll] = useState(true);

  const adaptApiPhotos = (apiDocs: any[]): Photo[] => {
    if (!apiDocs) return [];
    return apiDocs.map((p: any) => ({
      ...p,
      id: p._id,
      src: p.imageUrl,
    }));
  };

  const fetchInitialPhotos = async () => {
    if (!user) return;
    setIsLoadingPhotos(true);
    try {
      const [userRes, allRes] = await Promise.all([
        api.get('/fotos/minhas-fotos?page=1'),
        api.get('/fotos?page=1')
      ]);
      setUserPhotos(adaptApiPhotos(userRes.data.docs));
      setAllPhotos(adaptApiPhotos(allRes.data.docs));
      setHasNextUser(userRes.data.hasNextPage);
      setHasNextAll(allRes.data.hasNextPage);
    } catch (error) {
      toast.error("Erro ao carregar as fotos.");
    } finally {
      setIsLoadingPhotos(false);
    }
  };

  useEffect(() => {
    if (!isAuthLoading) {
      if (user) {
        fetchInitialPhotos();
      } else {
        toast.error("Você precisa estar logado para ver a galeria.");
        router.push('/entrar');
      }
    }
  }, [user, isAuthLoading, router]);

  const fetchMore = async () => {
    const isUserTab = activeTab === "user";
    const currentPage = isUserTab ? userPhotosPage : allPhotosPage;
    const hasNext = isUserTab ? hasNextUser : hasNextAll;

    if (!hasNext) {
      toast.success("Você chegou ao fim!");
      return;
    }

    const nextPage = currentPage + 1;
    const endpoint = isUserTab ? `/fotos/minhas-fotos?page=${nextPage}` : `/fotos?page=${nextPage}`;
    const loadingToastId = toast.loading("Carregando mais fotos...");

    try {
      const response = await api.get(endpoint);
      const adaptedNewPhotos = adaptApiPhotos(response.data.docs);

      if (isUserTab) {
        setUserPhotos((prev) => [...prev, ...adaptedNewPhotos]);
        setUserPhotosPage(nextPage);
        setHasNextUser(response.data.hasNextPage);
      } else {
        setAllPhotos((prev) => [...prev, ...adaptedNewPhotos]);
        setAllPhotosPage(nextPage);
        setHasNextAll(response.data.hasNextPage);
      }
      toast.dismiss(loadingToastId);
    } catch (error) {
      toast.dismiss(loadingToastId);
      toast.error("Erro ao carregar mais fotos.");
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (window.confirm("Tem certeza que deseja apagar esta foto?")) {
      const loadingToastId = toast.loading("Apagando foto...");
      try {
        await api.delete(`/fotos/${photoId}`);
        setUserPhotos(prev => prev.filter(p => p.id !== photoId));
        setAllPhotos(prev => prev.filter(p => p.id !== photoId));
        toast.dismiss(loadingToastId);
        toast.success("Foto apagada com sucesso!");
      } catch (error) {
        toast.dismiss(loadingToastId);
        toast.error("Não foi possível apagar a foto.");
      }
    }
  };

  if (isAuthLoading || !user) {
    return (
      <main className="min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/assets/background.png')"}}>
        <Header />
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
          <p className="text-xl font-semibold text-white text-shadow-dark">Verificando acesso...</p>
        </div>
      </main>
    );
  }
  
  const photosToShow = (activeTab === 'user' ? userPhotos : allPhotos)
    .filter(photo => photo && photo.src);
  const hasNextPage = activeTab === 'user' ? hasNextUser : hasNextAll;

  return (
    <>
      <main
        className="min-h-screen flex flex-col items-center p-4 sm:p-8 gap-8 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/assets/background.png')" }}
      >
        <Header />
        <div className="w-full max-w-7xl mx-auto">
          <section className="w-full flex flex-col items-center text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-800 text-shadow-light mb-2">
              Galeria de Fotos
            </h1>
            <p className="max-w-2xl text-lg text-blue-700 text-shadow-light">
              Explore os momentos incríveis do festival ou veja as fotos que você publicou.
            </p>
          </section>

          <div className="flex justify-center gap-2 sm:gap-4 mb-8">
            <Button onClick={() => setActiveTab('all')} className={`w-40 sm:w-48 ${activeTab === 'all' ? 'bg-yellow-400' : 'bg-white/70 text-blue-800'}`}>
              Galeria Geral
            </Button>
            <Button onClick={() => setActiveTab('user')} className={`w-40 sm:w-48 ${activeTab === 'user' ? 'bg-yellow-400' : 'bg-white/70 text-blue-800'}`}>
              Minhas Fotos
            </Button>
          </div>

          {isLoadingPhotos ? (
            <div className="text-center text-white text-shadow-dark font-semibold text-lg">Carregando fotos...</div>
          ) : photosToShow.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {photosToShow.map(photo => (
                <GalleryCard
                  key={photo.id}
                  photo={photo}
                  onDelete={handleDeletePhoto}
                  isOwner={user?._id === (photo.user as any)?._id || user?.role === 'admin'}
                />
              ))}
            </div>
          ) : (
            <EmptyGallery activeTab={activeTab} onUploadClick={() => setUploadModalOpen(true)} />
          )}

          {hasNextPage && !isLoadingPhotos && photosToShow.length > 0 && (
            <div className="flex justify-center mt-12">
              <Button onClick={fetchMore} className="bg-blue-600 text-white px-8 py-3">
                Carregar Mais
              </Button>
            </div>
          )}
        </div>
      </main>

      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setUploadModalOpen(false)}
        onUploadSuccess={fetchInitialPhotos}
      />
    </>
  )
}