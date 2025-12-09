import React, { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
} from "@mui/material";

export function ResetPasswordForm({
  loading = false,
  error,
  successMessage,
  onSubmit,
  token,
  onGoToLogin,
}) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [localError, setLocalError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (password.length < 6) {
      setLocalError("Senha deve ter pelo menos 6 caracteres");
      return;
    }

    if (password !== confirm) {
      setLocalError("As senhas não coincidem");
      return;
    }

    if (!onSubmit) return;
    await onSubmit({ token, password });
  };

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
            position: "relative",
          }}
        >
          {/* Botão Voltar (se tiver callback) */}
          {onGoToLogin && (
            <Box sx={{ position: "absolute", top: 16, left: 16 }}>
              <Button
                type="button"
                onClick={onGoToLogin}
                size="small"
                variant="contained"
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  bgcolor: "#8B5CF6",
                  "&:hover": { bgcolor: "#7c3dd5ff" },
                }}
              >
                Voltar
              </Button>
            </Box>
          )}

          <Typography
            variant="h4"
            align="center"
            sx={{ fontWeight: 800, mb: 3, mt: onGoToLogin ? 1 : 0 }}
          >
            Redefinir Senha
          </Typography>

          {(localError || error || successMessage) && (
            <Box sx={{ mb: 3, textAlign: "center" }}>
              {localError && (
                <Typography variant="body2" sx={{ color: "#fecaca" }}>
                  {localError}
                </Typography>
              )}
              {error && !localError && (
                <Typography variant="body2" sx={{ color: "#fecaca" }}>
                  {error}
                </Typography>
              )}
              {successMessage && !localError && !error && (
                <Typography variant="body2" sx={{ color: "#bbf7d0" }}>
                  {successMessage}
                </Typography>
              )}
            </Box>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              <TextField
                label="Nova senha"
                type="password"
                value={password}
                disabled={loading}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
                placeholder="Digite a nova senha"
                sx={{
                  input: { color: "#ffffff" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#6b5fad" },
                    "&:hover fieldset": { borderColor: "#8B5CF6" },
                  },
                  "& .MuiInputLabel-root": { color: "#c7c5d9" },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#8B5CF6",
                  },
                }}
              />

              <TextField
                label="Confirmar senha"
                type="password"
                value={confirm}
                disabled={loading}
                onChange={(e) => setConfirm(e.target.value)}
                fullWidth
                required
                placeholder="Repita a nova senha"
                sx={{
                  input: { color: "#ffffff" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#6b5fad" },
                    "&:hover fieldset": { borderColor: "#8B5CF6" },
                  },
                  "& .MuiInputLabel-root": { color: "#c7c5d9" },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#8B5CF6",
                  },
                }}
              />

              <Button
                type="submit"
                disabled={loading}
                fullWidth
                variant="contained"
                sx={{
                  mt: 1,
                  py: 1.3,
                  textTransform: "none",
                  fontWeight: 600,
                  bgcolor: "#8B5CF6",
                  "&:hover": { bgcolor: "#7c3dd5ff" },
                }}
              >
                {loading ? "Salvando..." : "Redefinir senha"}
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
