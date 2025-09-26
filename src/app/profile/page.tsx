"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Button from "@/components/Button";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function PerfilPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading, logout } = useAuth();

  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [socialMedia, setSocialMedia] = useState({
    instagram: "",
    x: "",
    facebook: "",
  });

  useEffect(() => {
    if (user) {
      setName(user.name);
      setLastName(user.lastName);

      // Reduzimos o socialMedia com tipagem segura
      const socialObject = user.socialMedia?.reduce<
        Record<"instagram" | "x" | "facebook", string>
      >((acc, curr) => {
        if (curr.platform === "instagram" || curr.platform === "x" || curr.platform === "facebook") {
          acc[curr.platform] = curr.username;
        }
        return acc;
      }, { instagram: "", x: "", facebook: "" });

      setSocialMedia(socialObject || { instagram: "", x: "", facebook: "" });
    }
  }, [user]);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      toast.error("Você precisa estar logado para acessar seu perfil.");
      router.push("/login");
    }
  }, [user, isAuthLoading, router]);

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const loadingToastId = toast.loading("Salvando alterações...");

    const socialMediaArray = Object.entries(socialMedia)
      .filter(([, username]) => username)
      .map(([platform, username]) => ({ platform, username }));

    try {
      await api.patch("/usuario/perfil", { name, lastName, socialMedia: socialMediaArray });
      toast.dismiss(loadingToastId);
      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      toast.dismiss(loadingToastId);
      toast.error("Não foi possível atualizar o perfil.");
    }
  };

  const handleDeactivateAccount = async () => {
    if (window.confirm("Você tem certeza que deseja desativar sua conta? Esta ação não pode ser desfeita.")) {
      const loadingToastId = toast.loading("Desativando sua conta...");
      try {
        await api.delete("/usuario/perfil");
        toast.dismiss(loadingToastId);
        toast.success("Conta desativada. Sentiremos sua falta!");
        logout();
      } catch (error) {
        toast.dismiss(loadingToastId);
        toast.error("Não foi possível desativar a conta.");
      }
    }
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSocialMedia(prev => ({ ...prev, [name]: value }));
  };

  if (isAuthLoading || !user) {
    return (
      <main className="min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/assets/background.png')"}}>
        <Header />
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
          <p className="text-xl font-semibold text-white text-shadow-dark">Carregando perfil...</p>
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen flex flex-col items-center p-4 sm:p-8 gap-12 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/assets/background.png')" }}
    >
      <Header />
      <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-800 text-shadow-light">
        Minha Conta
      </h1>

      <div className="w-full max-w-2xl bg-slate-50 p-8 rounded-2xl border-4 border-[#001f54] shadow-[-8px_8px_0px_0px_#001f54]">
        <form onSubmit={handleProfileUpdate} className="space-y-6">
          <h2 className="text-2xl font-bold text-blue-800">Informações Pessoais</h2>
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-gray-700 font-medium mb-1">Nome</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg text-[#001f54]"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-gray-700 font-medium mb-1">Sobrenome</label>
              <input
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg text-[#001f54]"
              />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-blue-800 pt-4">Redes Sociais</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Instagram</label>
              <input
                name="instagram"
                value={socialMedia.instagram || ""}
                onChange={handleSocialChange}
                placeholder="seu-usuario"
                className="w-full px-4 py-2 border rounded-lg text-[#001f54]"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">X (Twitter)</label>
              <input
                name="x"
                value={socialMedia.x || ""}
                onChange={handleSocialChange}
                placeholder="seu-usuario"
                className="w-full px-4 py-2 border rounded-lg text-[#001f54]"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Facebook</label>
              <input
                name="facebook"
                value={socialMedia.facebook || ""}
                onChange={handleSocialChange}
                placeholder="seu-usuario"
                className="w-full px-4 py-2 border rounded-lg text-[#001f54]"
              />
            </div>
          </div>

          <Button type="submit" className="w-full bg-blue-600 text-white py-3">
            Salvar Alterações
          </Button>
        </form>
      </div>

      <div className="w-full max-w-2xl bg-red-100 p-8 rounded-2xl border-4 border-red-800 shadow-[-8px_8px_0px_0px_#b91c1c]">
        <h2 className="text-2xl font-bold text-red-800">Zona de Perigo</h2>
        <p className="text-red-700 mt-2 mb-4">
          A desativação da sua conta é uma ação permanente e removerá seu acesso à plataforma.
        </p>
        <Button onClick={handleDeactivateAccount} className="w-full bg-red-600 text-white py-3">
          Desativar minha conta
        </Button>
      </div>
    </main>
  );
}
