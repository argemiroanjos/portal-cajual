"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface User {
  _id: string;
  name: string;
  lastName: string;
  email: string;
  role: "user" | "admin";
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthStatus = useCallback(async () => {
    try {
      const response = await api.get("/usuario/perfil");
      setUser(response.data);
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        setUser(null);
      } else {
        console.error("Erro inesperado ao verificar autenticação:", error);
        toast.error(
          "Não foi possível verificar sua sessão. Verifique sua conexão."
        );
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
    } catch (error) {
      toast.error("Houve um erro ao fazer logout.");
    }
  };

  return { user, isLoading, logout };
}
