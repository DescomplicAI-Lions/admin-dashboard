import React, { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../services/firebase";
import { useNavigate, Link as RouterLink } from "react-router-dom";

import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  TextField,
  Divider,
  Stack,
  Link as MuiLink,
} from "@mui/material";

import { useAuth } from "../useAuth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errors, setErrors] = useState({}); // 👈 erros locais dos campos

  const navigate = useNavigate();
  const { login, loading, authError } = useAuth();

  const isSubmitting = loading || googleLoading;

  const handleEmailLogin = async (e) => {
    e.preventDefault();

    // 🔎 validação no front
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "E-mail é obrigatório";
    }

    if (!password) {
      newErrors.password = "Senha é obrigatória";
    } else if (password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // ❌ não chama o backend se tiver erro
    }

    setErrors({});

    try {
      await login(email, password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Erro no login:", err);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      localStorage.setItem(
        "user",
        JSON.stringify({
          nome: user.displayName,
          email: user.email,
          avatar: user.photoURL,
        })
      );

      window.dispatchEvent(new Event("userLoginUpdate"));
      navigate("/");
    } catch (error) {
      console.error("Erro no login com Google:", error);
      alert("Erro ao fazer login com Google.");
    } finally {
      setGoogleLoading(false);
    }
  };

  // opcional: tratar VALIDATION_ERROR caso venha do backend
  const friendlyAuthError =
    authError === "VALIDATION_ERROR"
      ? "E-mail ou senha inválidos."
      : authError;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#000000ff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 3,
            bgcolor: "#2d1d68",
            color: "#e5e7eb",
          }}
        >
          <Typography
            variant="h4"
            align="center"
            sx={{ fontWeight: 800, mb: 3, color: "#ffffff" }}
          >
            Entre na sua conta
          </Typography>

          {/* Botão Google */}
          <Button
            onClick={handleGoogleLogin}
            disabled={isSubmitting}
            fullWidth
            variant="outlined"
            sx={{
              mb: 3,
              py: 1.5,
              textTransform: "none",
              fontWeight: 500,
              bgcolor: "white",
              borderColor: "#3c3c3eff",
              color: "#3c3c3eff",
              "&:hover": {
                borderColor: "#9b5cf0",
                bgcolor: "#2f2365",
                color: "#ffffff",
              },
            }}
          >
            <Box
              component="img"
              src="https://www.google.com/favicon.ico"
              alt="Google"
              sx={{ height: 20, width: 20, mr: 1.5 }}
            />
            {googleLoading ? "Entrando..." : "Entrar com Google"}
          </Button>

          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{ mb: 3 }}
          >
            <Divider sx={{ flex: 1, borderColor: "#433f7d" }} />
            <Typography variant="body2" sx={{ color: "#c7c5d9" }}>
              Ou
            </Typography>
            <Divider sx={{ flex: 1, borderColor: "#433f7d" }} />
          </Stack>

          {/* Formulário de email/senha tradicional */}
          <Box component="form" onSubmit={handleEmailLogin} noValidate>
            <TextField
              margin="normal"
              fullWidth
              required
              id="email"
              name="email"
              label="Email"
              type="email"
              size="medium"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) {
                  setErrors((prev) => ({ ...prev, email: undefined }));
                }
              }}
              disabled={isSubmitting}
              error={Boolean(errors.email)}
              helperText={errors.email}
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
              margin="normal"
              fullWidth
              required
              id="password"
              name="password"
              label="Senha"
              type="password"
              size="medium"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) {
                  setErrors((prev) => ({ ...prev, password: undefined }));
                }
              }}
              disabled={isSubmitting}
              error={Boolean(errors.password)}
              helperText={errors.password}
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

            {friendlyAuthError && !errors.email && !errors.password && (
              <Typography
                variant="body2"
                sx={{ color: "#fecaca", mt: 1 }}
              >
                {friendlyAuthError}
              </Typography>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isSubmitting}
              sx={{
                mt: 2,
                mb: 1,
                py: 1.2,
                textTransform: "none",
                fontWeight: 600,
                bgcolor: "#8B5CF6",
                "&:hover": { bgcolor: "#7c3dd5ff" },
              }}
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>

            <Box textAlign="center" sx={{ mt: 1.5 }}>
              <MuiLink
                component={RouterLink}
                to="/recuperar-senha"
                underline="hover"
                sx={{ fontSize: 14, color: "#5f6af8" }}
              >
                Esqueceu sua senha?
              </MuiLink>
            </Box>
          </Box>

          <Box textAlign="center" sx={{ mt: 3 }}>
            <Typography
              variant="body2"
              sx={{ color: "#808080", display: "inline" }}
            >
              Não tem uma conta?{" "}
            </Typography>
            <MuiLink
              component={RouterLink}
              to="/cadastro"
              underline="hover"
              sx={{
                fontSize: 14,
                fontWeight: 600,
                color: "#5f6af8",
              }}
            >
              Cadastre-se
            </MuiLink>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Login;