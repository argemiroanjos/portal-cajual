import Header from "@/components/Header";
import Image from "next/image";
import Carousel from "./Carousel";

export default function Home() {
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
    </main>
  );
}
