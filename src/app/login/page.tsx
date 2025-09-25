"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Button from "@/components/Button";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const loadingToastId = toast.loading("Verificando credenciais...");

    try {
      await login(email, password);
      
      toast.dismiss(loadingToastId);
      toast.success("Login bem-sucedido!");

      setTimeout(() => {
        router.push("/");
      }, 1000);

    } catch (err: any) {
      toast.dismiss(loadingToastId);
      const errorMessage = err.response?.data?.message || err.message || "Falha no login.";
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
        <h1 className="text-3xl font-bold text-center text-blue-800 mb-6">
          Acesse sua Conta
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="email">E-mail</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-[#001f54]"/>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="password">Senha</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"/>
          </div>
          <Button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300">
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          Esqueceu sua senha?{" "}
          <Link href="/recovery-password" className="text-blue-600 hover:underline font-semibold">
            Clique aqui
          </Link>
        </p>
      </div>
    </main>
  );
}