"use client";

import React, { useState, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import { X, UploadCloud, CornerUpLeft } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import Button from "@/components/Button";
import Image from "next/image";

type UploadModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess?: () => void;
};

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [hashtags, setHashtags] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [previewTags, setPreviewTags] = useState<string[]>([]);
  const MAX_HASHTAGS = 2;

  const handleClose = useCallback(() => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setHashtags("");
    setPreviewTags([]);
    setIsLoading(false);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  // Atualiza previewTags em tempo real e limita a 2 hashtags
  useEffect(() => {
    const tags = hashtags
      .split(/\s+/)
      .map(tag => tag.trim().replace(/^#/, ""))
      .filter(Boolean)
      .slice(0, MAX_HASHTAGS)
      .map(tag => `#${tag}`);
    setPreviewTags(tags);
  }, [hashtags]);

  const handleHashtagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const tags = value.split(/\s+/).filter(Boolean);
    if (tags.length > MAX_HASHTAGS) {
      toast.error(`Você só pode adicionar até ${MAX_HASHTAGS} hashtags.`);
      return;
    }
    setHashtags(value);
  };

  const handlePublish = async () => {
    if (!selectedFile) {
      toast.error("Por favor, selecione uma foto primeiro.");
      return;
    }

    setIsLoading(true);
    const loadingToastId = toast.loading("Enviando sua foto...");

    const hashtagsArray = previewTags;

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("hashtags", JSON.stringify(hashtagsArray));

    try {
      await api.post("/fotos", formData);
      toast.dismiss(loadingToastId);
      toast.success("Foto publicada com sucesso!");
      onUploadSuccess?.();
      handleClose();
    } catch (err: unknown) {
      toast.dismiss(loadingToastId);

      let errorMessage = "Falha ao publicar a foto.";

      // Type guard para erro do Axios
      if (typeof err === "object" && err !== null && "response" in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        if (axiosErr.response?.data?.message) {
          errorMessage = axiosErr.response.data.message;
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && handleClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-blue-900/30 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div
        className="relative z-10 w-full max-w-lg bg-slate-50 p-6 sm:p-8 rounded-2xl border-4 border-[#001f54] shadow-[-8px_8px_0px_0px_#001f54] transform -rotate-1"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-blue-800">Publicar Foto</h2>
          <button
            onClick={handleClose}
            aria-label="Fechar"
            className="text-gray-500 hover:text-red-500 transition"
          >
            <X size={24} />
          </button>
        </div>

        {!selectedFile ? (
          <label
            htmlFor="fileInput"
            className="group flex flex-col items-center justify-center cursor-pointer rounded-xl border-2 border-dashed border-blue-300 hover:border-yellow-400 p-8 transition bg-white/80 text-center"
          >
            <UploadCloud className="w-12 h-12 text-blue-500 group-hover:text-yellow-500 transition-colors" />
            <p className="mt-2 font-semibold text-gray-700">Clique para selecionar uma foto</p>
            <p className="text-sm text-gray-500">Ou arraste e solte o arquivo aqui</p>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
          </label>
        ) : (
          <div className="space-y-4">
            {previewUrl && (
              <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-gray-200">
                <Image src={previewUrl} alt="Pré-visualização da imagem" layout="fill" objectFit="contain" />
              </div>
            )}

            <div>
              <label htmlFor="hashtags" className="block text-gray-700 font-medium mb-1">
                Hashtags
              </label>
              <input
                id="hashtags"
                type="text"
                value={hashtags}
                onChange={handleHashtagsChange}
                placeholder="#cajual2025 #terrasanta"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-[#001f54]"
              />

              {previewTags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {previewTags.map(tag => (
                    <span key={tag} className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between items-center gap-4">
              <Button onClick={() => setSelectedFile(null)} className="bg-gray-200 text-gray-800 px-4 py-2 text-sm hover:bg-gray-300">
                <CornerUpLeft className="w-4 h-4 mr-2" />
                Trocar Foto
              </Button>
              <Button onClick={handlePublish} disabled={isLoading} className="bg-blue-600 text-white px-6 py-2">
                {isLoading ? "Publicando..." : "Publicar"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
