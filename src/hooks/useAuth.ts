"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface SocialMediaLink {
  platform: string;
  username: string;
  isPrincipal?: boolean;
}

interface User {
  _id: string;
  name: string;
  lastName: string;
  email: string;
  role: "user" | "admin";
  socialMedia?: SocialMediaLink[];
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthStatus = useCallback(async () => {
    try {
      const response = await api.get("/usuario/perfil");
      setUser(response.data);
    } catch (err: unknown) {
      // Type guard para verificar se é um erro do Axios
      if (typeof err === "object" && err !== null && "response" in err) {
        const axiosErr = err as { response?: { status?: number } };
        if (axiosErr.response?.status === 401) {
          setUser(null);
        } else {
          console.error("Erro inesperado ao verificar autenticação:", err);
        }
      } else {
        console.error("Erro inesperado ao verificar autenticação:", err);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const logout = async () => {
    try {
      await api.post("/usuario/logout");
      setUser(null);
      toast.success("Você saiu com sucesso!");
      window.location.href = "/";
    } catch (err: unknown) {
      // Type guard para erro genérico
      let errorMessage = "Houve um erro ao fazer logout.";
      if (err instanceof Error) errorMessage = err.message;
      toast.error(errorMessage);
    }
  };

  return { user, isLoading, logout };
}
