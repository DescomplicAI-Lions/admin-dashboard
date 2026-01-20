import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  useTheme,
  Paper,
  InputAdornment,
  IconButton,
  Stack,
  Divider,
} from "@mui/material";
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  RocketLaunch,
  Terminal,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLogin } from "../../state";

const Login = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const user = {
      name: "Administrador",
      email: formData.email,
      role: "admin",
    };
    dispatch(setLogin({ user, token: "mock-token-12345" }));
    navigate("/dashboard");
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      sx={{
        backgroundColor: theme.palette.background.default,
        backgroundImage: `radial-gradient(circle at 2px 2px, ${theme.palette.primary.main}10 1px, transparent 0)`,
        backgroundSize: "40px 40px",
      }}
    >
      <Paper
        elevation={24}
        sx={{
          width: "100%",
          maxWidth: "450px",
          p: "3rem",
          backgroundColor: theme.palette.background.alt,
          borderRadius: "20px",
          border: `1px solid ${theme.palette.divider}`,
          textAlign: "center",
        }}
      >
        {/* LOGO / ÍCONE CENTRAL */}
        <Box
          sx={{
            width: "60px",
            height: "60px",
            backgroundColor: theme.palette.primary.main,
            borderRadius: "15px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem",
            boxShadow: `0 10px 20px ${theme.palette.primary.main}40`,
          }}
        >
          <Terminal sx={{ color: "white", fontSize: "30px" }} />
        </Box>

        <Typography variant="h2" fontWeight="800" color={theme.palette.secondary[100]} gutterBottom>
          Bem-vindo
        </Typography>
        <Typography variant="body1" color={theme.palette.secondary[300]} mb="2.5rem">
          Acesse seu painel administrativo
        </Typography>

        <form onSubmit={handleLogin}>
          <Stack spacing={2.5}>
            <TextField
              fullWidth
              variant="outlined"
              label="E-mail"
              name="email"
              value={formData.email}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: theme.palette.primary.main }} />
                  </InputAdornment>
                ),
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              required
            />

            <TextField
              fullWidth
              variant="outlined"
              label="Senha"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: theme.palette.primary.main }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              required
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              endIcon={<RocketLaunch />}
              sx={{
                py: "12px",
                borderRadius: "12px",
                fontWeight: "bold",
                fontSize: "1rem",
                textTransform: "none",
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                boxShadow: `0 4px 15px ${theme.palette.primary.main}60`,
                "&:hover": {
                  boxShadow: `0 6px 20px ${theme.palette.primary.main}80`,
                },
              }}
            >
              Entrar no Sistema
            </Button>
          </Stack>
        </form>

        <Box mt="3rem">
          <Divider sx={{ mb: "1.5rem" }}>
            <Typography variant="body2" sx={{ color: theme.palette.secondary[400], px: 1 }}>
              MODO TESTE
            </Typography>
          </Divider>
          
          <Button
            variant="text"
            onClick={() => {
              setFormData({
                email: "admin@dashboard.com",
                password: "123456",
              });
            }}
            sx={{
              color: theme.palette.secondary[300],
              textTransform: "none",
              "&:hover": { backgroundColor: "transparent", color: theme.palette.primary.main },
            }}
          >
            Preencher dados automaticamente
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;