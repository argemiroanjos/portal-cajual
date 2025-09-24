"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "./Button";
import HamburgerMenuButton from "./HamburgerMenuButton";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isLoading, logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    if (isMenuOpen) toggleMenu();
    await logout();
  };

  return (
    <header className="relative left-0 w-full flex items-center justify-between p-4 bg-transparent">
      <div className="flex items-center">
        <Link href="/">
          <Image src="/assets/logoCajual.png" alt="Festival Cajual" height={40} width={120} />
        </Link>
      </div>

      <nav className="hidden md:flex gap-4 items-center">
        <Link href="/gallery"><Button>Galeria</Button></Link>
        <Link href="/about-us"><Button>Sobre Nós</Button></Link>

        {isLoading ? (
          <div className="w-24 h-10 bg-gray-200 animate-pulse rounded-full" />
        ) : user ? (
          <>
            <Button onClick={handleLogout}>Sair</Button>
          </>
        ) : (
          <>
            <Link href="/register"><Button>Cadastrar</Button></Link>
            <Link href="/login"><Button>Entrar</Button></Link>
          </>
        )}
      </nav>

      <div className="md:hidden relative">
        <HamburgerMenuButton isOpen={isMenuOpen} onClick={toggleMenu} />
        {isMenuOpen && (
          <div className="absolute top-full right-0 mt-2 bg-white/90 backdrop-blur-md rounded-xl shadow-lg z-40 flex flex-col items-center p-4 gap-3">
            <Link href="/gallery"><Button onClick={toggleMenu} className="w-36 py-2">Galeria</Button></Link>
            <Link href="/about-us"><Button onClick={toggleMenu} className="w-36 py-2">Sobre Nós</Button></Link>
            
            <hr className="w-full border-t border-gray-300 my-1" />

            {isLoading ? (
              <div className="w-36 h-10 bg-gray-200 animate-pulse rounded-full" />
            ) : user ? (
              <Button onClick={handleLogout} className="w-36 py-2">Sair</Button>
            ) : (
              <>
                <Link href="/register"><Button onClick={toggleMenu} className="w-36 py-2">Cadastrar</Button></Link>
                <Link href="/login"><Button onClick={toggleMenu} className="w-36 py-2">Entrar</Button></Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}