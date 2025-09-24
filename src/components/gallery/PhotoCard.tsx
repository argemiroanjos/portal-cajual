// src/components/gallery/PhotoCard.tsx
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { Photo } from "./interfaces";

type PhotoCardProps = {
  photo: Photo;
  onDelete: (photoId: string) => void;
  isOwner: boolean;
};

export default function PhotoCard({ photo, onDelete, isOwner }: PhotoCardProps) {
  if (!photo || !photo.src) {
    return null;
  }

  return (
    <div className="relative group">
      <Image 
        src={photo.src} 
        alt={`Foto ${photo.id}`} 
        width={500} 
        height={500} 
        className="w-full h-auto object-cover rounded-lg" 
      />
      {isOwner && (
        <button
          onClick={() => onDelete(photo.id)}
          className="absolute top-2 right-2 p-2 bg-red-600/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Apagar foto"
        >
          <Trash2 size={20} />
        </button>
      )}
    </div>
  );
}