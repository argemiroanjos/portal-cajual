"use client";

import Header from "@/components/Header";
import DevCard, { type DevCardProps } from "@/components/DevCard";

const devs: DevCardProps[] = [
  {
    name: "Argemiro dos Anjos",
    role: "Desenvolvedor Fullstack",
    imageUrl: "/assets/devs/argemiro2.jpeg",
    description: "Amante de café e código limpo.",
    socialLinks: [
      { platform: 'github', url: 'https://github.com/argemiroanjos' },
      { platform: 'linkedin', url: 'https://www.linkedin.com/in/argemiro-dos-anjos/' },
      { platform: 'instagram', url: 'https://instagram.com/dev_dosanjos' },
    ]
  },
  {
    name: "Herick Moreira",
    role: "Desenvolvedor Fullstack",
    imageUrl: "/assets/devs/herick2.jpeg",
    description: "Java e rock and roll.",
    socialLinks: [
      { platform: 'github', url: 'https://github.com/herick2D' },
      { platform: 'linkedin', url: 'https://linkedin.com/in/herick-moreira' },
      { platform: 'instagram', url: 'https://instagram.com/herick.jpeg' },
    ]
  }
];

export default function SobreNosPage() {
  return (
    <main
      className="min-h-screen flex flex-col items-center p-4 sm:p-8 gap-12 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/assets/background.png')",
        backgroundAttachment: "scroll",
      }}
    >
      <Header />

      <section className="w-full flex flex-col items-center text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-800 text-shadow-light mb-4"> 
          Quem faz esse projeto acontecer?
        </h1>
        <p className="max-w-2xl text-lg text-blue-700 text-shadow-light"> 
          Somos uma dupla apaixonada por tecnologia e pela alegria do festival, unindo código e cultura para criar esta experiência para você.
        </p>
      </section>

      <section className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12 px-4">
        {devs.map((dev) => (
          <DevCard
            key={dev.name}
            name={dev.name}
            role={dev.role}
            imageUrl={dev.imageUrl}
            description={dev.description}
            socialLinks={dev.socialLinks}
          />
        ))}
      </section>
    </main>
  );
}