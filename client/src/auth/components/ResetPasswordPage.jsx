import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ResetPasswordForm } from "../components/ResetPasswordForm";
import { useAuth } from "../useAuth";
import { Box, Container, Paper, Typography, Button } from "@mui/material";

function useTokenFromQuery() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  return params.get("token");
}

function ResetPasswordPage() {
  const navigate = useNavigate();
  const { resetPassword, loading, authError } = useAuth();

  const [successMessage, setSuccessMessage] = useState("");
  const [localError, setLocalError] = useState("");

  const token = useTokenFromQuery();
  const isTokenMissing = !token || token.length < 10;

  if (isTokenMissing) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#000000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 3,
              bgcolor: "#2d1d68",
              color: "#e5e7eb",
              textAlign: "center",
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
              Link inválido ou expirado
            </Typography>

            <Typography sx={{ color: "#c7c5d9", mb: 4 }}>
              O link para redefinir senha é inválido ou já foi utilizado.
              Solicite um novo link na página de recuperação.
            </Typography>

            <Button
              variant="contained"
              fullWidth
              onClick={() => navigate("/recuperar-senha")}
              sx={{
                py: 1.2,
                fontWeight: 600,
                bgcolor: "#8B5CF6",
                "&:hover": { bgcolor: "#7c3dd5ff" },
              }}
            >
              Recuperar Senha
            </Button>

            <Button
              variant="outlined"
              fullWidth
              onClick={() => navigate("/login")}
              sx={{
                mt: 2,
                borderColor: "#6b5fad",
                color: "#9b5cf0",
                "&:hover": { borderColor: "#9b5cf0", bgcolor: "#2f2365" },
              }}
            >
              Voltar ao Login
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  const handleSubmit = async ({ password }) => {
    setLocalError("");
    setSuccessMessage("");

    try {
      await resetPassword(token, password);
      setSuccessMessage("Senha redefinida com sucesso! Você já pode entrar.");
    } catch (err) {
      console.error("Erro ao redefinir senha:", err);
    }
  };

  const handleGoToLogin = () => navigate("/login");

  return (
    <ResetPasswordForm
      loading={loading}
      error={localError || authError}
      successMessage={successMessage}
      onSubmit={handleSubmit}
      token={token}
      onGoToLogin={handleGoToLogin}
    />
  );
}

export default ResetPasswordPage;