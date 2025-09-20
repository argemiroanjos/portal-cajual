"use client"

import { X } from "lucide-react"

type UploadModalProps = {
  isOpen: boolean
  onClose: () => void
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-center mb-4">Publicar Foto</h2>

        {/* Upload */}
        <div className="flex flex-col items-center border-2 border-dashed border-gray-300 p-6 rounded-lg cursor-pointer hover:bg-gray-50">
          <p className="text-gray-600 mb-2">Arraste sua foto aqui ou clique para selecionar</p>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="fileInput"
            onChange={(e) => console.log("Arquivo:", e.target.files?.[0])}
          />
          <label
            htmlFor="fileInput"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
          >
            Escolher arquivo
          </label>
        </div>

        {/* Botão Confirmar */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => {
              console.log("Publicar foto")
              onClose()
            }}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Publicar
          </button>
        </div>
      </div>
    </div>
  )
};