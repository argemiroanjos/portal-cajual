"use client";

import Image from "next/image";
import Button from "@/components/Button";
import { Camera } from "lucide-react";

type EmptyGalleryProps = {
  activeTab: "user" | "all";
  onUploadClick: () => void;
};

export default function EmptyGallery({ activeTab, onUploadClick }: EmptyGalleryProps) {
  const isUserTab = activeTab === 'user';

  const title = isUserTab 
    ? "Sua galeria está vazia!" 
    : "Ainda não há fotos por aqui!";

  const description = isUserTab
    ? "Que tal compartilhar seu primeiro momento no Cajual? Clique no botão abaixo e faça história."
    : "Seja a primeira pessoa a registrar um momento inesquecível do festival!";

  return (
    <div className="w-full max-w-2xl mx-auto bg-slate-50 p-8 sm:p-12 rounded-2xl border-4 border-[#001f54] shadow-[-8px_8px_0px_0px_#001f54] transform -rotate-1 text-center flex flex-col items-center">
      
      <div className="mb-6">
        <Image 
          src="/assets/logotv2.png" 
          alt="TV do Festival Cajual" 
          width={200} 
          height={150} 
          className="object-contain opacity-80"
        />
      </div>

      <h2 className="text-3xl font-extrabold text-blue-800 mb-2">{title}</h2>
      <p className="text-gray-700 text-lg mb-8">{description}</p>
      
      <Button 
        onClick={onUploadClick}
        className="bg-blue-600 text-white px-8 py-3 text-lg hover:bg-blue-700 transition"
      >
        <Camera className="w-6 h-6 mr-3" />
        Publicar uma foto
      </Button>
    </div>
  );
}