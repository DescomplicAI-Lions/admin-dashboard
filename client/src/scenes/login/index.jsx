import React, { useEffect } from "react";
import { Box, CircularProgress, Typography, useTheme } from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLogin } from "../../state";

const Login = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Pega os parâmetros da URL vindos da Landing Page
    const params = new URLSearchParams(window.location.search);
    const nameFromUrl = params.get("name");
    const emailFromUrl = params.get("email");

    if (nameFromUrl && emailFromUrl) {
      // 2. Salva o usuário no Redux
      const user = {
        name: decodeURIComponent(nameFromUrl),
        email: decodeURIComponent(emailFromUrl),
        role: "admin",
      };
      
      dispatch(setLogin({ user, token: "firebase-token-123" }));
      
      // 3. Salva no localStorage para não perder no refresh
      localStorage.setItem("user", JSON.stringify(user));

      // 4. Vai direto para o Dashboard
      navigate("/dashboard");
    } else {
      // Se alguém tentar acessar /login sem dados, manda de volta para a Landing Page
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        dispatch(setLogin({ user: userData, token: "stored-token" }));
        navigate("/dashboard");
      } else {
        window.location.href = "http://localhost:5173/login";
      }
    }
  }, [dispatch, navigate]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      sx={{ backgroundColor: theme.palette.background.default }}
    >
      <CircularProgress size={60} sx={{ mb: 2 }} />
      <Typography variant="h5" color={theme.palette.secondary[100]}>
        Sincronizando com a Landing Page...
      </Typography>
    </Box>
  );
};

export default Login;