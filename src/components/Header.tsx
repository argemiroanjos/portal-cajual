"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "./Button";
import HamburgerMenuButton from "./HamburgerMenuButton";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) document.body.classList.add("menu-open");
    else document.body.classList.remove("menu-open");
  };

  // IMPORTANTE: header no fluxo (position: static/relative), sem z-index elevado
  return (
    <header className="relative left-0 w-full flex items-center justify-between p-4 bg-transparent">
      {/* Logo à esquerda */}
      <div className="flex items-center">
        <Link href="/">
          <Image src="/assets/logoCajual.png" alt="Festival Cajual" height={40} width={120} />
        </Link>
      </div>

      {/* Botões desktop */}
      <nav className="hidden md:flex gap-4">
        <Link href="/gallery">
          <Button>Galeria</Button>
        </Link>
        <Link href="/register">
          <Button>Cadastrar</Button>
        </Link>
        <Link href="/login">
          <Button>Entrar</Button>
        </Link>
        <Button>Sobre Nós</Button>
      </nav>

      {/* Botão Hamburger mobile */}
      <div className="md:hidden relative">
        <HamburgerMenuButton isOpen={isMenuOpen} onClick={toggleMenu} />
        {/* Dropdown mobile */}
        {isMenuOpen && (
          <div
            className="
              absolute top-full right-0 mt-2
              bg-white/90 backdrop-blur-md
              rounded-xl shadow-lg
              z-40
              flex flex-col items-center p-4 gap-3
            "
          >
            <Link href="/gallery">
              <Button onClick={toggleMenu} className="w-36 py-2 text-base text-center whitespace-nowrap">
                Galeria
              </Button>
            </Link>
            <Link href="/login">
              <Button onClick={toggleMenu} className="w-36 py-2 text-base text-center whitespace-nowrap">
                Entrar
              </Button>
            </Link>
            <Button onClick={toggleMenu} className="w-36 py-2 text-base text-center whitespace-nowrap">
              Sobre Nós
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
