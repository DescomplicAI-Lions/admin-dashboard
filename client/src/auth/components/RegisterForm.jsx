/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";

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

// ---- helpers de força da senha ----
function calculatePasswordScore(password) {
  if (!password) return 0;

  let score = 0;
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  if (hasMinLength) score++;
  if (hasUpper) score++;
  if (hasLower) score++;
  if (hasNumber) score++;
  if (hasSymbol) score++;

  // máximo 4 só para a barra ficar bonitinha
  return Math.min(score, 4);
}

function getPasswordStrengthMeta(score) {
  switch (score) {
    case 0:
      return { label: "Muito fraca", color: "#4b5563", percent: 5 };
    case 1:
      return { label: "Fraca", color: "#ef4444", percent: 25 };
    case 2:
      return { label: "Média", color: "#eab308", percent: 50 };
    case 3:
      return { label: "Forte", color: "#22c55e", percent: 75 };
    case 4:
      return { label: "Muito forte", color: "#16a34a", percent: 100 };
    default:
      return { label: "", color: "#4b5563", percent: 0 };
  }
}

function RegisterForm() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmSenha: "",
    dataNascimento: "",
    cpf: "",
  });
  const [passwordScore, setPasswordScore] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const { register, loading, authError } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "dataNascimento") {
      const numericValue = value.replace(/\D/g, "");
      let formattedValue = numericValue;

      if (numericValue.length > 2) {
        formattedValue = `${numericValue.slice(0, 2)}/${numericValue.slice(
          2,
          4
        )}`;
      }
      if (numericValue.length > 4) {
        formattedValue = `${numericValue.slice(0, 2)}/${numericValue.slice(
          2,
          4
        )}/${numericValue.slice(4, 8)}`;
      }

      setFormData((prev) => ({ ...prev, [name]: formattedValue }));

      if (numericValue.length === 8) {
        const day = parseInt(numericValue.slice(0, 2));
        const month = parseInt(numericValue.slice(2, 4)) - 1;
        const year = parseInt(numericValue.slice(4, 8));
        const birthDate = new Date(year, month, day);
        const today = new Date();
        const minAgeDate = new Date(
          today.getFullYear() - 18,
          today.getMonth(),
          today.getDate()
        );

        if (birthDate > minAgeDate) {
          setErrors((prev) => ({
            ...prev,
            dataNascimento: "Você deve ter pelo menos 18 anos",
          }));
        } else {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.dataNascimento;
            return newErrors;
          });
        }
      }
    } else if (name === "cpf") {
      const numericValue = value.replace(/\D/g, "");
      let formattedValue = numericValue;

      if (numericValue.length > 3) {
        formattedValue = `${numericValue.slice(0, 3)}.${numericValue.slice(
          3,
          6
        )}`;
      }
      if (numericValue.length > 6) {
        formattedValue = `${numericValue.slice(0, 3)}.${numericValue.slice(
          3,
          6
        )}.${numericValue.slice(6, 9)}`;
      }
      if (numericValue.length > 9) {
        formattedValue = `${numericValue.slice(0, 3)}.${numericValue.slice(
          3,
          6
        )}.${numericValue.slice(6, 9)}-${numericValue.slice(9, 11)}`;
      }

      setFormData((prev) => ({ ...prev, [name]: formattedValue }));

      if (numericValue.length > 0 && numericValue.length !== 11) {
        setErrors((prev) => ({
          ...prev,
          cpf: "CPF deve ter 11 dígitos",
        }));
      } else if (numericValue.length === 11) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.cpf;
          return newErrors;
        });
      }
    } else if (name === "senha") {
      // atualiza senha + força
      setFormData((prev) => ({ ...prev, [name]: value }));
      const score = calculatePasswordScore(value);
      setPasswordScore(score);
      // opcional: limpa erro de senha enquanto digita
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.senha;
        return newErrors;
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = {};

    if (!formData.nome.trim()) newErrors.nome = "Nome é obrigatório";
    if (!formData.email.trim()) newErrors.email = "E-mail é obrigatório";
    if (!formData.senha) newErrors.senha = "Senha é obrigatória";
    if (!formData.confirmSenha)
      newErrors.confirmSenha = "Confirmação de senha é obrigatória";
    if (!formData.dataNascimento)
      newErrors.dataNascimento = "Data de nascimento é obrigatória";
    if (!formData.cpf) newErrors.cpf = "CPF é obrigatório";

    // regra forte de senha (igual que o backend exige)
    if (formData.senha) {
      const senha = formData.senha;
      const hasUpper = /[A-Z]/.test(senha);
      const hasLower = /[a-z]/.test(senha);
      const hasNumber = /[0-9]/.test(senha);
      const hasSymbol = /[^A-Za-z0-9]/.test(senha);

      if (
        senha.length < 8 ||
        !hasUpper ||
        !hasLower ||
        !hasNumber ||
        !hasSymbol
      ) {
        newErrors.senha =
          "Senha muito fraca - inclua maiúsculas, números e símbolos.";
      }
    }

    if (
      formData.senha &&
      formData.confirmSenha &&
      formData.senha !== formData.confirmSenha
    ) {
      newErrors.confirmSenha = "As senhas não coincidem";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await register({
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        dataNascimentoBr: formData.dataNascimento,
        cpf: formData.cpf,
        role: "client",
      });

      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Erro no cadastro:", err);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const strengthMeta = getPasswordStrengthMeta(
    formData.senha ? passwordScore : 0
  );

  if (success) {
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
              textAlign: "center",
              bgcolor: "#2d1d68",
              color: "#e5e7eb",
            }}
          >
            <Typography variant="h2" sx={{ mb: 2 }}>
              ✓
            </Typography>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
              Conta criada com sucesso!
            </Typography>
            <Typography sx={{ mb: 4, color: "#c7c5d9" }}>
              Redirecionando para o login...
            </Typography>
            <FaSpinner className="animate-spin" style={{ fontSize: 32 }} />
          </Paper>
        </Container>
      </Box>
    );
  }

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
          }}
        >
          <Typography
            variant="h4"
            align="center"
            sx={{ fontWeight: 800, mb: 3 }}
          >
            Criar Conta
          </Typography>

          {(errors.geral || authError) && (
            <Box
              sx={{
                mb: 3,
                p: 2,
                borderRadius: 2,
                bgcolor: "#fee2e2",
                color: "#b91c1c",
                fontSize: 14,
              }}
            >
              {errors.geral || authError}
            </Box>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              {/* Nome */}
              <TextField
                id="nome"
                name="nome"
                label="Nome completo"
                required
                value={formData.nome}
                onChange={handleChange}
                disabled={loading}
                fullWidth
                placeholder="Digite seu nome completo"
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
              {errors.nome && (
                <Typography variant="body2" sx={{ color: "#fecaca" }}>
                  {errors.nome}
                </Typography>
              )}

              {/* E-mail */}
              <TextField
                id="email"
                name="email"
                label="E-mail"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                fullWidth
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
              {errors.email && (
                <Typography variant="body2" sx={{ color: "#fecaca" }}>
                  {errors.email}
                </Typography>
              )}

              {/* Data de Nascimento */}
              <TextField
                id="dataNascimento"
                name="dataNascimento"
                label="Data de Nascimento"
                type="text"
                required
                value={formData.dataNascimento}
                onChange={handleChange}
                disabled={loading}
                fullWidth
                placeholder="DD/MM/AAAA"
                inputProps={{ maxLength: 10 }}
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
              {errors.dataNascimento && (
                <Typography variant="body2" sx={{ color: "#fecaca" }}>
                  {errors.dataNascimento}
                </Typography>
              )}

              {/* CPF */}
              <TextField
                id="cpf"
                name="cpf"
                label="CPF"
                type="text"
                required
                value={formData.cpf}
                onChange={handleChange}
                disabled={loading}
                fullWidth
                placeholder="000.000.000-00"
                inputProps={{ maxLength: 14 }}
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
              {errors.cpf && (
                <Typography variant="body2" sx={{ color: "#fecaca" }}>
                  {errors.cpf}
                </Typography>
              )}

              {/* Senha */}
              <Box>
                <TextField
                  id="senha"
                  name="senha"
                  label="Senha"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.senha}
                  onChange={handleChange}
                  disabled={loading}
                  fullWidth
                  placeholder="Crie uma senha forte (mín. 8 caracteres, com maiúsculas, números e símbolos)"
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
                  type="button"
                  onClick={togglePasswordVisibility}
                  disabled={loading}
                  sx={{
                    minWidth: 0,
                    p: 0,
                    position: "relative",
                    mt: "-38px",
                    float: "right",
                    mr: 1,
                    color: "#c7c5d9",
                  }}
                >
                  {showPassword ? (
                    <FaEyeSlash style={{ fontSize: 18 }} />
                  ) : (
                    <FaEye style={{ fontSize: 18 }} />
                  )}
                </Button>
                {errors.senha && (
                  <Typography variant="body2" sx={{ color: "#fecaca" }}>
                    {errors.senha}
                  </Typography>
                )}

                {/* Barra de força da senha */}
                {formData.senha && (
                  <Box sx={{ mt: 1.5 }}>
                    <Box
                      sx={{
                        height: 6,
                        borderRadius: 9999,
                        bgcolor: "#433f7d",
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          height: "100%",
                          width: `${strengthMeta.percent}%`,
                          bgcolor: strengthMeta.color,
                          transition: "width 0.25s ease-out",
                        }}
                      />
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{ mt: 0.5, display: "block", color: "#c7c5d9" }}
                    >
                      Força da senha:{" "}
                      <strong>{strengthMeta.label}</strong>
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Confirmar Senha */}
              <Box>
                <TextField
                  id="confirmSenha"
                  name="confirmSenha"
                  label="Confirmar senha"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.confirmSenha}
                  onChange={handleChange}
                  disabled={loading}
                  fullWidth
                  placeholder="Repita a senha"
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
                {errors.confirmSenha && (
                  <Typography variant="body2" sx={{ color: "#fecaca" }}>
                    {errors.confirmSenha}
                  </Typography>
                )}
              </Box>

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
                {loading ? (
                  <>
                    <FaSpinner
                      className="animate-spin"
                      style={{ marginRight: 8 }}
                    />
                    Cadastrando...
                  </>
                ) : (
                  "Cadastrar"
                )}
              </Button>
            </Stack>
          </Box>

          {/* Já tem conta? */}
          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Typography
              variant="body2"
              sx={{ color: "#c7c5d9", mb: 1.5 }}
            >
              Já tem uma conta?
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
              Entrar
            </MuiLink>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default RegisterForm;