import Link from "next/link";
import Image from "next/image";
import Button from "./Button";

export default function Header() {
  return (
    <header
      className="
        w-full flex items-center justify-between p-4 relative
        max-[320px]:flex-col max-[320px]:gap-3 max-[320px]:items-center
      "
    >
      {/* Botão Galeria */}
      <div className="absolute left-4 max-[320px]:static max-[320px]:order-2">
        <Link href="/galeria">
          <Button>Galeria</Button>
        </Link>
      </div>

      {/* Logo centralizada em telas normais e acima dos botões em telas pequenas */}
      <div className="mx-auto max-[320px]:order-1">
        <Image
          src="/assets/logoCajual.png"
          alt="Festival Cajual"
          height={40}
          width={120}
        />
      </div>

      {/* Botão Entrar */}
      <div className="absolute right-4 max-[320px]:static max-[320px]:order-2">
        <Button>Entrar</Button>
      </div>
    </header>
  );
}
