"use client";

import React from "react";
import ReactDOM from "react-dom";
import { X, UploadCloud } from "lucide-react";
import Button from "@/components/Button";

type UploadModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelectFile?: (file: File) => void;
};

export const UploadModal: React.FC<UploadModalProps> = (props) => {
  const { isOpen, onClose, onSelectFile } = props;

  const handleClose = React.useCallback(() => {
    onClose();
  }, [onClose]);

  // Bloqueia scroll do body quando o modal está aberto
  React.useEffect(() => {
    if (!isOpen) return;
    document.body.classList.add("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, [isOpen]);

  // Fecha o modal ao pressionar Esc
  React.useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex: "var(--z-modal, 2000)" }}
      role="dialog"
      aria-modal="true"
    >
      {/* Fundo com gradiente e blur, fecha ao clicar */}
      <button
        aria-label="Fechar modal"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,80,168,.28),rgba(246,200,95,.18))] backdrop-blur-md"
        onClick={handleClose}
      />

      {/* Modal centralizado */}
      <div
        className="
          relative z-[1] w-[92vw] max-w-[640px] rounded-3xl overflow-hidden
          bg-white/92 border-2 border-[#001f54]
          shadow-[0_12px_28px_rgba(0,0,0,.28),0_2px_0_rgba(255,255,255,.45)_inset]
        "
      >
        {/* Cabeçalho com gradiente e botão de fechar */}
        <div className="h-12 bg-[linear-gradient(90deg,var(--brand-blue),#3a79d8)] relative">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(120px_60px_at_15%_10%,rgba(255,255,255,.25),transparent_60%),radial-gradient(140px_70px_at_85%_0%,rgba(255,255,255,.2),transparent_60%)]" />
          <h2 className="h-full flex items-center justify-center text-white font-extrabold tracking-wide">
            Publicar Foto
          </h2>
          <button
            onClick={handleClose}
            aria-label="Fechar"
            className="absolute top-2 right-2 rounded-full bg-white/20 hover:bg-white/30 text-white p-2 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Conteúdo do modal */}
        <div className="p-5 sm:p-6">
          {/* Dropzone com foco/hover seguindo a identidade */}
          <label
            htmlFor="fileInput"
            className="
              group block cursor-pointer rounded-2xl border-2 border-dashed
              border-[color:var(--brand-blue)]/35 hover:border-[color:var(--brand-yellow)]
              p-6 transition bg-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,.7)]
              focus-within:ring-2 focus-within:ring-[#001f54] focus-within:ring-offset-2 focus-within:ring-offset-white
            "
          >
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="rounded-full bg-[color:var(--brand-yellow)] text-white p-3 shadow-[0_6px_16px_rgba(246,200,95,.55)] group-hover:scale-105 transition">
                <UploadCloud size={22} />
              </div>
              <p className="text-slate-800 font-medium">Arraste sua foto aqui ou clique para selecionar</p>
              <span className="text-[13px] text-slate-500">PNG, JPG até 10MB</span>

              {/* Botão estilizado para abrir o seletor de arquivos */}
              <Button
                aria-label="Escolher arquivo"
                className="mt-2 px-5 py-2 text-base"
                onClick={() => {
                  const el = document.getElementById("fileInput") as HTMLInputElement | null;
                  el?.click();
                }}
              >
                Escolher arquivo
              </Button>
            </div>

            <input
              id="fileInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file && onSelectFile) onSelectFile(file);
              }}
            />
          </label>

          {/* Ações */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            {/* Cancelar: botão customizado com gradiente laranja/âmbar */}
            <Button
              aria-label="Cancelar publicação"
              onClick={handleClose}
              className="
                text-[#082142]
                bg-[linear-gradient(180deg,var(--cancel-amber-500),var(--cancel-amber-600))]
                border-2 border-[#001f54]
                shadow-[0_4px_0_0_#001f54,0_8px_14px_rgba(217,119,6,.35)]
                hover:brightness-105
                focus-visible:outline //focus-visible:outline-2
                focus-visible:outline-[color:var(--cancel-amber-600)]
                focus-visible:outline-offset-2
              "
            >
              Cancelar
            </Button>

            {/* Publicar: botão padrão */}
            <Button
              aria-label="Publicar foto"
              onClick={handleClose}
            >
              Publicar
            </Button>
          </div>
        </div>

        {/* Barra inferior amarela */}
        <div className="h-2 bg-[color:var(--brand-yellow)]" />
      </div>
    </div>,
    document.body
  );
};
