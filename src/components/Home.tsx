"use client";

import Header from "@/components/Header";
import Image from "next/image";
import Carousel from "./Carousel";
import Button from "./Button";
import { UploadModal } from "./UploadModal";
import { useState } from "react";
import { Camera } from "lucide-react";

export default function Home() {
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);

  return (
    <main
      className="min-h-screen flex flex-col items-center p-4 sm:p-8 gap-6 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/assets/background.png')",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Header com logo e botões */}
      <Header />

      {/* Botão Publicar Foto */}
      <section className="w-full flex justify-center mt-4">
  <Button 
    onClick={() => setUploadModalOpen(true)}
    className="bg-blue-600 text-white px-6 py-3 rounded-full flex items-center hover:bg-blue-700 transition">
    <Camera className="w-5 h-5 mr-2" />
    Publicar Foto
  </Button>
</section>
      
      {/* Área do carrossel (placeholder por enquanto) */}
      <Carousel />

      {/* Área da TV */}
      <section className="w-full flex flex-col items-center justify-center mt-6">
        <Image
          src="/assets/logotv2.png"
          alt="TV do Festival Cajual"
          width={300}
          height={200}
          className="object-contain"
          priority
        />
        {/* <p className="text-blue-900 font-bold mt-2 text-center">
          Aqui ficará a transmissão ou fotos alternadas
        </p> */}
      </section>

      {/* Modal de Upload */}
      <UploadModal isOpen={isUploadModalOpen} onClose={() => setUploadModalOpen(false)} />
    </main>
  );
}
