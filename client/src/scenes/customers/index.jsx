import React, { useState, useEffect } from "react";
import {
  Box,
  useTheme,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  useMediaQuery,
  Alert,
} from "@mui/material";
import { useGetCustomersQuery } from "state/api";
import Header from "components/Header";
import { DataGrid } from "@mui/x-data-grid";
import { Add as AddIcon } from "@mui/icons-material";

// Hook customizado para gerenciar clientes mock
const useMockCustomers = () => {
  const [mockCustomers, setMockCustomers] = useState([]);
  
  useEffect(() => {
    const stored = localStorage.getItem('mockCustomers');
    if (stored) {
      setMockCustomers(JSON.parse(stored));
    }
  }, []);

  const addMockCustomer = (customer) => {
    const newCustomer = {
      _id: Math.random().toString(36).substr(2, 9),
      ...customer,
      createdAt: new Date().toISOString(),
    };
    
    const updatedCustomers = [...mockCustomers, newCustomer];
    setMockCustomers(updatedCustomers);
    localStorage.setItem('mockCustomers', JSON.stringify(updatedCustomers));
    return newCustomer;
  };

  const refreshMockCustomers = () => {
    const stored = localStorage.getItem('mockCustomers');
    if (stored) {
      setMockCustomers(JSON.parse(stored));
    }
  };

  return { 
    mockCustomers, 
    addMockCustomer, 
    refreshMockCustomers,
    setMockCustomers // Exportando setMockCustomers
  };
};

const Customers = () => {
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const { data: apiData, isLoading, refetch } = useGetCustomersQuery();
  const { 
    mockCustomers, 
    addMockCustomer, 
    refreshMockCustomers,
    setMockCustomers 
  } = useMockCustomers();
  
  // Combina dados da API com dados mockados
  const allCustomers = apiData ? [...apiData, ...mockCustomers] : mockCustomers;

  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    country: "",
    occupation: "",
    role: "",
    cpf: "",
    gender: "",
    birthDate: "",
    description: "",
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewCustomer({
      name: "",
      email: "",
      phoneNumber: "",
      country: "",
      occupation: "",
      role: "",
      cpf: "",
      gender: "",
      birthDate: "",
      description: "",
    });
    setShowSuccess(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsCreating(true);
    try {
      // Usando mock persistente
      addMockCustomer(newCustomer);
      
      // Mostrar mensagem de sucesso
      setShowSuccess(true);
      
      // Fechar modal após 2 segundos
      setTimeout(() => {
        handleClose();
        // Atualizar a lista de mock customers
        refreshMockCustomers();
      }, 1500);
      
    } catch (error) {
      console.error("Erro ao cadastrar cliente:", error);
      alert("Erro ao cadastrar cliente.");
    } finally {
      setIsCreating(false);
    }
  };

  const formatCPF = (value) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  };

  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length === 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else if (numbers.length === 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }
    return value;
  };

  const handleCPFChange = (e) => {
    const formattedCPF = formatCPF(e.target.value);
    setNewCustomer((prev) => ({
      ...prev,
      cpf: formattedCPF,
    }));
  };

  const handlePhoneChange = (e) => {
    const formattedPhone = formatPhone(e.target.value);
    setNewCustomer((prev) => ({
      ...prev,
      phoneNumber: formattedPhone,
    }));
  };

  // Effect para escutar mudanças no localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      refreshMockCustomers();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [refreshMockCustomers]);

  const columns = [
    {
      field: "_id",
      headerName: "ID",
      flex: 1,
    },
    {
      field: "name",
      headerName: "Nome",
      flex: 0.8,
    },
    {
      field: "email",
      headerName: "E-mail",
      flex: 1,
    },
    {
      field: "phoneNumber",
      headerName: "Telefone",
      flex: 0.6,
      renderCell: (params) => {
        return params.value || "Não informado";
      },
    },
    {
      field: "country",
      headerName: "País",
      flex: 0.4,
      renderCell: (params) => {
        return params.value || "Não informado";
      },
    },
    {
      field: "occupation",
      headerName: "Profissão",
      flex: 0.6,
      renderCell: (params) => {
        return params.value || "Não informado";
      },
    },
    {
      field: "role",
      headerName: "Cargo",
      flex: 0.5,
      renderCell: (params) => {
        return params.value || "Não informado";
      },
    },
    {
      field: "cpf",
      headerName: "CPF",
      flex: 0.5,
      renderCell: (params) => {
        return params.value || "Não informado";
      },
    },
    {
      field: "gender",
      headerName: "Gênero",
      flex: 0.4,
      renderCell: (params) => {
        const genderMap = {
          "masculino": "Masculino",
          "feminino": "Feminino",
          "outro": "Outro",
          "prefiro-nao-informar": "Não informado"
        };
        return genderMap[params.value] || "Não informado";
      },
    },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="CLIENTES" subtitle="Lista de Clientes" />
      
      {/* Botão de Cadastro */}
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
          disabled={isCreating}
          sx={{
            backgroundColor: theme.palette.secondary[500],
            color: theme.palette.background.alt,
            fontSize: isNonMobile ? "14px" : "12px",
            padding: isNonMobile ? "10px 20px" : "8px 16px",
            "&:hover": {
              backgroundColor: theme.palette.secondary[600],
              transform: "translateY(-2px)",
              boxShadow: theme.shadows[4],
            },
            "&:disabled": {
              backgroundColor: theme.palette.action.disabled,
            },
            transition: "all 0.3s ease",
            boxShadow: theme.shadows[2],
          }}
        >
          Cadastrar Cliente
        </Button>
      </Box>

      <Box
        mt="20px"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.primary.light[500],
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${theme.palette.secondary[200]} !important`,
          },
        }}
      >
        <DataGrid
          loading={isLoading}
          getRowId={(row) => row._id}
          rows={allCustomers || []}
          columns={columns}
        />
      </Box>

      {/* Modal de Cadastro - COMPLETO */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ 
          backgroundColor: theme.palette.background.alt,
          color: theme.palette.secondary[100],
        }}>
          Cadastrar Novo Cliente
        </DialogTitle>
        <DialogContent sx={{ 
          backgroundColor: theme.palette.primary.light[500],
          padding: "20px",
        }}>
          {showSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Cliente cadastrado com sucesso!
            </Alert>
          )}
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Nome */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nome Completo"
                name="name"
                value={newCustomer.name}
                onChange={handleInputChange}
                required
                disabled={isCreating}
              />
            </Grid>

            {/* CPF */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="CPF"
                name="cpf"
                value={newCustomer.cpf}
                onChange={handleCPFChange}
                placeholder="000.000.000-00"
                inputProps={{ maxLength: 14 }}
                required
                disabled={isCreating}
              />
            </Grid>

            {/* Email */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="E-mail"
                name="email"
                type="email"
                value={newCustomer.email}
                onChange={handleInputChange}
                required
                disabled={isCreating}
              />
            </Grid>

            {/* Telefone */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Telefone"
                name="phoneNumber"
                value={newCustomer.phoneNumber}
                onChange={handlePhoneChange}
                placeholder="(00) 00000-0000"
                inputProps={{ maxLength: 15 }}
                required
                disabled={isCreating}
              />
            </Grid>

            {/* Gênero */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Gênero"
                name="gender"
                value={newCustomer.gender}
                onChange={handleInputChange}
                disabled={isCreating}
              >
                <MenuItem value="">Selecione</MenuItem>
                <MenuItem value="masculino">Masculino</MenuItem>
                <MenuItem value="feminino">Feminino</MenuItem>
                <MenuItem value="outro">Outro</MenuItem>
                <MenuItem value="prefiro-nao-informar">Prefiro não informar</MenuItem>
              </TextField>
            </Grid>

            {/* Data de Nascimento */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Data de Nascimento"
                name="birthDate"
                type="date"
                value={newCustomer.birthDate}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                disabled={isCreating}
              />
            </Grid>

            {/* País */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="País"
                name="country"
                value={newCustomer.country}
                onChange={handleInputChange}
                disabled={isCreating}
              />
            </Grid>

            {/* Profissão */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Profissão"
                name="occupation"
                value={newCustomer.occupation}
                onChange={handleInputChange}
                disabled={isCreating}
              />
            </Grid>

            {/* Cargo */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Cargo"
                name="role"
                value={newCustomer.role}
                onChange={handleInputChange}
                disabled={isCreating}
              />
            </Grid>

            {/* Descrição */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Descrição"
                name="description"
                value={newCustomer.description}
                onChange={handleInputChange}
                placeholder="Informações adicionais sobre o cliente..."
                disabled={isCreating}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ 
          backgroundColor: theme.palette.background.alt,
          padding: "10px 20px",
        }}>
          <Button 
            onClick={handleClose} 
            disabled={isCreating}
            sx={{ color: theme.palette.secondary[200] }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={!newCustomer.name || !newCustomer.email || !newCustomer.cpf || isCreating || showSuccess}
            sx={{
              backgroundColor: theme.palette.secondary[500],
              color: theme.palette.background.alt,
              "&:hover": {
                backgroundColor: theme.palette.secondary[600],
              },
              "&:disabled": {
                backgroundColor: theme.palette.action.disabled,
              },
            }}
          >
            {isCreating ? "Cadastrando..." : showSuccess ? "Cadastrado!" : "Cadastrar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Customers;