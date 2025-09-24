"use client";

import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import Button from './Button';
import { AlertTriangle, X } from 'lucide-react';

type ConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
};

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message }: ConfirmModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-blue-900/30 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className="relative z-10 w-full max-w-md bg-slate-50 p-6 sm:p-8 rounded-2xl border-4 border-[#001f54] shadow-[-8px_8px_0px_0px_#001f54]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start">
          <div className="mr-4 flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:h-10 sm:w-10">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-blue-800" id="modal-title">
              {title}
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-600">
                {message}
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
          <Button
            type="button"
            className="w-full bg-red-600 text-white"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Confirmar Exclusão
          </Button>
          <Button
            type="button"
            className="mt-3 w-full bg-white text-gray-700 border border-gray-300 sm:mt-0"
            onClick={onClose}
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}