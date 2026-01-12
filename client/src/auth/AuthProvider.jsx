import React, { createContext, useContext, useEffect, useState } from "react";
import {
  loginWithPassword,
  registerUser,
  forgotPassword as apiForgotPassword,
  resetPassword as apiResetPassword,
  authenticateMagicLink,
} from "./auth.api";

const AuthContext = createContext(null);
const STORAGE_KEY = "auth:user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed.user);
        setToken(parsed.token);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  function saveAuthState(auth) {
    setUser(auth.user);
    setToken(auth.token);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
  }

  function clearAuthState() {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  async function login(email, password) {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await loginWithPassword({ email, password });
      const auth = res && res.data ? res.data : res;
      saveAuthState(auth);
      return auth;
    } catch (err) {
      setAuthError(err.message || "Erro ao fazer login.");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function register({ nome, email, senha, dataNascimentoBr, cpf, role }) {
    setLoading(true);
    setAuthError(null);
    try {
      return await registerUser({
        nome,
        email,
        senha,
        dataNascimentoBr,
        cpf,
        role,
      });
    } catch (err) {
      setAuthError(err.message || "Erro ao registrar usuário.");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function forgotPassword(email, redirectUrl) {
    setLoading(true);
    setAuthError(null);
    try {
      return await apiForgotPassword({ email, redirectUrl });
    } catch (err) {
      setAuthError(err.message || "Erro ao solicitar redefinição de senha.");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function resetPassword(token, newPassword) {
    setLoading(true);
    setAuthError(null);
    try {
      return await apiResetPassword({ token, newPassword });
    } catch (err) {
      setAuthError(err.message || "Erro ao redefinir senha.");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function loginWithMagicLink(token) {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await authenticateMagicLink({ token });
      saveAuthState(res);
      return res;
    } catch (err) {
      setAuthError(err.message || "Erro ao autenticar magic link.");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    clearAuthState();
  }

  const value = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    loading,
    authError,
    login,
    register,
    forgotPassword,
    resetPassword,
    loginWithMagicLink,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext deve ser usado dentro de <AuthProvider />");
  }
  return ctx;
}