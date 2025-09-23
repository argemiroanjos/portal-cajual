"use client";

import Header from "@/components/Header";
import Image from "next/image";
import Carousel from "./carousel/Carousel";
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
        // fundo acompanha o scroll (padrão)
        backgroundAttachment: "scroll",
      }}
    >
      <Header />

      <Carousel />

      <section className="w-full flex justify-center mt-4">
        <Button onClick={() => setUploadModalOpen(true)} className="bg-blue-600 text-white px-6 py-3 rounded-full flex items-center hover:bg-blue-700 transition">
          <Camera className="w-5 h-5 mr-2" />
          Publicar Foto
        </Button>
      </section>

      <section className="w-full flex flex-col items-center justify-center mt-6">
        <Image src="/assets/logotv2.png" alt="TV do Festival Cajual" width={300} height={200} className="object-contain" priority />
      </section>

      <UploadModal isOpen={isUploadModalOpen} onClose={() => setUploadModalOpen(false)} />
    </main>
  );
}
