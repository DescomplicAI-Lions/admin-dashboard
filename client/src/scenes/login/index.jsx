import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  useTheme,
  Card,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLogin } from "../../state";

const Login = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Login mock
    const user = {
      name: "Administrador",
      email: formData.email,
      role: "admin"
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
      bgcolor={theme.palette.background.default}
    >
      <Card
        sx={{
          width: "400px",
          p: "2rem",
          bgcolor: theme.palette.background.alt,
          borderRadius: "0.55rem",
        }}
      >
        <Typography variant="h4" textAlign="center" mb="2rem" fontWeight="bold">
          🔐 Login
        </Typography>
        
        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="📧 Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          
          <TextField
            fullWidth
            label="🔒 Senha"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
          />
          
          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{
              mt: "2rem",
              p: "1rem",
              backgroundColor: theme.palette.primary.main,
              fontSize: "1rem",
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
              },
            }}
          >
            🚀 Entrar no Sistema
          </Button>
        </form>
        
        <Box mt="2rem" textAlign="center">
          <Typography variant="body2" color="gray" mb="1rem">
            🧪 Para teste rápido:
          </Typography>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => {
              setFormData({ 
                email: "admin@dashboard.com", 
                password: "123456" 
              });
            }}
          >
            Preencher Dados de Teste
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default Login;