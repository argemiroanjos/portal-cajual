"use client";

import { useState } from "react";
import Image from "next/image";
import { Photo } from "./interfaces";
import { Trash2, ArrowLeft, X, Linkedin, Instagram, Github } from "lucide-react";

type GalleryCardProps = {
  photo: Photo;
  onDelete: (photoId: string) => void;
  isOwner: boolean;
};

const socialIcons = {
  github: <Github size={20} />,
  linkedin: <Linkedin size={20} />,
  instagram: <Instagram size={20} />,
  x: <X size={20} />,
};

export default function GalleryCard({ photo, onDelete, isOwner }: GalleryCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  if (!photo || !photo.src) {
    return null;
  }
  
  const mainSocial = photo.user?.socialMedia?.find(s => s.isPrincipal) || photo.user?.socialMedia?.[0];
  const hasHashtags = photo.hashtags && photo.hashtags.length > 0 && photo.hashtags[0] !== "";

  return (
    <div className="[perspective:1000px] group cursor-pointer">
      <div
        className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
        style={{ aspectRatio: '4/5' }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div 
          className="absolute w-full h-full bg-slate-50 p-3 rounded-lg border-2 border-[#001f54] shadow-md flex flex-col [backface-visibility:hidden]"
        >
          <div className="relative w-full flex-1">
            <Image
              src={photo.src}
              alt={`Foto de ${photo.user?.name || 'usuário'}`}
              fill
              className="object-cover rounded-sm"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>

          <div className="pt-3 px-1 text-left flex flex-col gap-2">
            {mainSocial && photo.user ? (
              <a
                href={mainSocial.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 text-blue-800 hover:text-yellow-500 transition-colors w-fit"
              >
                {socialIcons[mainSocial.platform as keyof typeof socialIcons]}
                <span className="font-semibold text-sm truncate">
                  {photo.user.name} {photo.user.lastName}
                </span>
              </a>
            ) : (
              <p className="font-bold text-blue-800 truncate text-sm">
                por {photo.user?.name || 'Usuário'} {photo.user?.lastName || ''}
              </p>
            )}

            {hasHashtags && (
              <div className="flex flex-wrap gap-1.5 overflow-hidden h-6">
                {photo.hashtags!.map((tag, index) => (
                  <span key={index} className="bg-yellow-200 text-yellow-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          {isOwner && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(photo.id); }}
              className="absolute top-2 right-2 p-1.5 bg-yellow-400 text-[#001f54] rounded-full transition-opacity opacity-100 md:opacity-0 md:group-hover:opacity-100"
              aria-label="Apagar foto"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="absolute w-full h-full bg-slate-50 p-4 rounded-lg border-2 border-[#001f54] [transform:rotateY(180deg)] [backface-visibility:hidden] flex flex-col text-left">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-blue-800">Detalhes</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {mainSocial && photo.user && (
              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 text-sm mb-1">Publicado por:</h4>
                <a 
                  href={mainSocial.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 text-blue-600 hover:underline"
                >
                  {socialIcons[mainSocial.platform as keyof typeof socialIcons]}
                  <span className="font-medium truncate">
                    {photo.user.name} {photo.user.lastName}
                  </span>
                </a>
              </div>
            )}

            {hasHashtags && (
              <div>
                <h4 className="font-semibold text-gray-700 text-sm mb-1">Hashtags:</h4>
                <div className="flex flex-wrap gap-2">
                  {photo.hashtags!.map((tag, index) => (
                    <span key={index} className="bg-yellow-200 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button onClick={() => setIsFlipped(false)} className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-black">
            <ArrowLeft size={16} /> Voltar para a foto
          </button>
        </div>
      </div>
    </div>
  );
}