import Image from "next/image";
import { Github, Linkedin, Instagram } from "lucide-react";

export type SocialLink = {
  platform: 'github' | 'linkedin' | 'instagram';
  url: string;
};

export type DevCardProps = {
  name: string;
  role: string;
  imageUrl: string;
  description: string;
  socialLinks: SocialLink[];
};

const socialIcons = {
  github: <Github size={24} />,
  linkedin: <Linkedin size={24} />,
  instagram: <Instagram size={24} />,
};

export default function DevCard({ name, role, imageUrl, description, socialLinks }: DevCardProps) {
  return (
    <div className="w-full max-w-sm bg-slate-50 p-8 rounded-2xl border-4 border-[#001f54] shadow-[-8px_8px_0px_0px_#001f54] transform transition-transform -rotate-2 hover:rotate-0 hover:shadow-[-2px_2px_0px_0px_#001f54] active:rotate-0 active:shadow-[-2px_2px_0px_0px_#001f54] active:scale-95 flex flex-col items-center text-center">
      <div className="relative w-32 h-32 mb-4">
        <Image
          src={imageUrl}
          alt={`Foto de ${name}`}
          width={128}
          height={128}
          className="rounded-full border-4 border-[#FBBF24] object-cover"
        />
      </div>
      <h2 className="text-2xl font-bold text-blue-800">{name}</h2>
      <p className="text-yellow-600 font-semibold mb-4">{role}</p>
      <p className="text-gray-700 mb-6">{description}</p>
      <div className="flex gap-4 mt-auto">
        {socialLinks.map((link) => (
          <a
            key={link.platform}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Perfil de ${name} no ${link.platform}`}
            className="text-blue-800 hover:text-yellow-500 transition-colors"
          >
            {socialIcons[link.platform]}
          </a>
        ))}
      </div>
    </div>
  );
}