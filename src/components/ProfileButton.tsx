"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { User } from "lucide-react";

export default function ProfileButton() {
  const { user, isLoading } = useAuth();

  if (isLoading || !user) {
    return null;
  }

  return (
    <Link 
      href="/profile" 
      aria-label="Acessar perfil de usuário"
      className="
        fixed bottom-6 right-6 z-40
        w-16 h-16
        bg-yellow-400
        text-[#001f54]
        rounded-full
        flex items-center justify-center
        shadow-[0_4px_0_0_#001f54,0_8px_16px_rgba(0,0,0,0.3)]
        border-2 border-[#001f54]
        transition-transform
        hover:scale-105 hover:bg-yellow-300
        active:scale-95
      "
    >
      <User size={32} />
    </Link>
  );
}