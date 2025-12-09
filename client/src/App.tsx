import { useMemo } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { themeSettings } from "./theme";

import Layout from "./scenes/layout";
import Dashboard from "./scenes/dashboard";
import Products from "./scenes/products";
import Customers from "./scenes/customers";
import Transactions from "./scenes/transactions";
import Geography from "./scenes/geography";
import Overview from "./scenes/overview";
import Daily from "./scenes/daily";
import Monthly from "./scenes/monthly";
import Breakdown from "./scenes/breakdown";
import Admin from "./scenes/admin";
import Performance from "./scenes/performance";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";

// 👇 import do hook de auth
import { useAuth } from "./auth/useAuth";

// 👇 login/cadastro/esqueci/redefinir do fluxo novo
import Login from "./auth/components/LoginForm";
import RegisterForm from "./auth/components/RegisterForm";
import RecuperarSenha from "./auth/components/ForgotPasswordForm";
import ResetPasswordPage from "./auth/components/ResetPasswordPage";

function App() {
  const mode = useSelector((state: any) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  // 🔐 AGORA o guard vem do contexto de auth
  const { isAuthenticated } = useAuth();

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            {/* 🚪 ROTAS PÚBLICAS */}
            <Route
              path="/login"
              element={
                isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
              }
            />
            <Route
              path="/cadastro"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <RegisterForm />
                )
              }
            />
            <Route
              path="/recuperar-senha"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <RecuperarSenha />
                )
              }
            />
            <Route
              path="/redefinir-senha"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <ResetPasswordPage />
                )
              }
            />

            {/* 🔒 ROTAS PROTEGIDAS (Layout + dashboard + resto) */}
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Layout />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            >
              {/* index = / → redireciona pra /dashboard */}
              <Route index element={<Navigate to="/dashboard" replace />} />

              {/* Rotas FILHAS (sem barra na frente) */}
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="produtos" element={<Products />} />
              <Route path="clientes" element={<Customers />} />
              <Route path="transacoes" element={<Transactions />} />
              <Route path="geografia" element={<Geography />} />
              <Route path="visao-geral" element={<Overview />} />
              <Route path="diario" element={<Daily />} />
              <Route path="mensal" element={<Monthly />} />
              <Route path="detalhamento" element={<Breakdown />} />
              <Route path="administracao" element={<Admin />} />
              <Route path="desempenho" element={<Performance />} />

              {/* Rotas em inglês, se quiser manter */}
              <Route path="products" element={<Products />} />
              <Route path="customers" element={<Customers />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="geography" element={<Geography />} />
              <Route path="overview" element={<Overview />} />
              <Route path="daily" element={<Daily />} />
              <Route path="monthly" element={<Monthly />} />
              <Route path="breakdown" element={<Breakdown />} />
              <Route path="admin" element={<Admin />} />
              <Route path="performance" element={<Performance />} />
            </Route>

            {/* Fallback */}
            <Route
              path="*"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;