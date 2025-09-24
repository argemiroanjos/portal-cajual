"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Button from "@/components/Button";
import toast from "react-hot-toast";
import api from "@/lib/api";

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const loadingToastId = toast.loading("Enviando instruções...");

    try {
      const response = await api.post("/usuario/recuperar-senha", { email });

      toast.dismiss(loadingToastId);

      toast.success(response.data.message);
      setIsSubmitted(true);

    } catch (err: any) {
      toast.dismiss(loadingToastId);
      const errorMessage = err.response?.data?.message || "Falha ao enviar e-mail.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen flex flex-col items-center p-4 sm:p-8 gap-6 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/assets/background.png')",
        backgroundAttachment: "scroll",
      }}
    >
      <Header />

      <div className="w-full max-w-md bg-slate-50 p-8 rounded-2xl mt-8 border-4 border-[#001f54] shadow-[-8px_8px_0px_0px_#001f54] transform transition-transform hover:rotate-0 hover:shadow-[-2px_2px_0px_0px_#001f54] -rotate-1">

        {isSubmitted ? (
          <div className="text-center">
            <h1 className="text-2xl font-bold text-blue-800 mb-4">Verifique seu E-mail</h1>
            <p className="text-gray-700 mb-6">
              As instruções para redefinir sua senha foram enviadas para <strong>{email}</strong>. Por favor, verifique sua caixa de entrada e spam.
            </p>
            <Link href="/login" className="text-blue-600 hover:underline font-semibold">
              Voltar para o Login
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-center text-blue-800 mb-2">
              Recuperar Senha
            </h1>
            <p className="text-center text-gray-600 mb-6">
              Digite seu e-mail e enviaremos um link para você voltar a acessar sua conta.
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-1" htmlFor="email">E-mail</label>
                <input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              
              <Button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300">
                {isLoading ? "Enviando..." : "Enviar Link de Recuperação"}
              </Button>
            </form>

            <p className="text-center text-gray-600 mt-4">
              Lembrou a senha?{" "}
              <Link href="/login" className="text-blue-600 hover:underline font-semibold">
                Faça login
              </Link>
            </p>
          </>
        )}
      </div>
    </main>
  );
}