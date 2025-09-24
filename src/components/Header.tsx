"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "./Button";
import HamburgerMenuButton from "./HamburgerMenuButton";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
    if (!isMenuOpen) document.body.classList.add("menu-open");
    else document.body.classList.remove("menu-open");
  };

  // Fecha o menu ao clicar fora do botão ou do dropdown
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (
        isMenuOpen &&
        !buttonRef.current?.contains(target) &&
        !menuRef.current?.contains(target)
      ) {
        setIsMenuOpen(false);
        document.body.classList.remove("menu-open");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <header className="relative left-0 w-full flex items-center justify-between p-4 bg-transparent">
      {/* Logo */}
      <div className="flex items-center">
        <Link href="/">
          <Image
            src="/assets/logoCajual.png"
            alt="Festival Cajual"
            height={40}
            width={120}
          />
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
        <Link href="/about-us">
          <Button>Sobre Nós</Button>
        </Link>
      </nav>

      {/* Botão Hamburger mobile */}
      <div className="md:hidden relative">
        <HamburgerMenuButton
          isOpen={isMenuOpen}
          onClick={toggleMenu}
          buttonRef={buttonRef}
        />

        {/* Dropdown mobile */}
        {isMenuOpen && (
          <div
            ref={menuRef}
            className="
              absolute top-full right-0 mt-2
              bg-white/90 backdrop-blur-md
              rounded-xl shadow-lg
              z-40
              flex flex-col items-center p-4 gap-3
            "
          >
            <Link href="/gallery">
              <Button
                onClick={toggleMenu}
                className="w-36 py-2 text-base text-center whitespace-nowrap"
              >
                Galeria
              </Button>
            </Link>
            <Link href="/register">
              <Button
                onClick={toggleMenu}
                className="w-36 py-2 text-base text-center whitespace-nowrap"
              >
                Cadastrar
              </Button>
            </Link>
            <Link href="/login">
              <Button
                onClick={toggleMenu}
                className="w-36 py-2 text-base text-center whitespace-nowrap"
              >
                Entrar
              </Button>
            </Link>
            <Link href="/about-us">
              <Button
                onClick={toggleMenu}
                className="w-36 py-2 text-base text-center whitespace-nowrap"
              >
                Sobre Nós
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
