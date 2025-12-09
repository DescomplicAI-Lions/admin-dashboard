import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Link as MuiLink,
} from "@mui/material";

import { useAuth } from "../useAuth";

function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { forgotPassword, loading, authError } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");

    try {
      const redirectUrl = `${window.location.origin}/redefinir-senha`;

      await forgotPassword(email, redirectUrl);

      setSuccessMessage(
        "Se existir uma conta com esse e-mail, enviamos um link de recuperação."
      );
    } catch (err) {
      console.error("Erro ao solicitar recuperação de senha:", err);
    }
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
          {/* Botão Voltar */}
          <Box sx={{ position: "absolute", top: 16, left: 16 }}>
            <Button
              component={RouterLink}
              to="/login"
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

          <Typography
            variant="h4"
            align="center"
            sx={{ fontWeight: 800, mb: 3, mt: 1 }}
          >
            Recuperar Senha
          </Typography>

          {authError && (
            <Box
              sx={{
                mb: 2,
                p: 2,
                borderRadius: 2,
                bgcolor: "#fee2e2",
                color: "#b91c1c",
                fontSize: 14,
              }}
            >
              {authError}
            </Box>
          )}

          {successMessage && (
            <Box
              sx={{
                mb: 2,
                p: 2,
                borderRadius: 2,
                bgcolor: "#ecfdf5",
                color: "#15803d",
                fontSize: 14,
              }}
            >
              {successMessage}
            </Box>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              <TextField
                label="E-mail cadastrado"
                type="email"
                required
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                placeholder="Digite seu e-mail"
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
                fullWidth
                disabled={loading}
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
                {loading ? "Enviando..." : "Enviar link de recuperação"}
              </Button>
            </Stack>
          </Box>

          {/* Link para login no rodapé */}
          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Typography
              variant="body2"
              sx={{ color: "#c7c5d9", mb: 1.5 }}
            >
              Lembrou da senha?
            </Typography>

            <MuiLink
              component={RouterLink}
              to="/login"
              underline="hover"
              sx={{
                fontSize: 14,
                fontWeight: 600,
                color: "#5f6af8",
              }}
            >
              Voltar para o login
            </MuiLink>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default RecuperarSenha;
