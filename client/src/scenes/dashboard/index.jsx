import React, { useState, useEffect } from "react";
import {
  Box, Button, Typography, useTheme, useMediaQuery,
  Grid, Paper, Stack, Divider, CircularProgress
} from "@mui/material";
import {
  DownloadOutlined, Group, Payments,
  CalendarMonth, TrendingUp, AccountCircle,
  AdminPanelSettings
} from "@mui/icons-material";
import { DataGrid, ptBR } from "@mui/x-data-grid";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell,
} from "recharts";

// --- COMPONENTE DE CARD AUXILIAR ---
const DashboardCard = ({ title, value, icon, subtitle, color }) => {
  const theme = useTheme();
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        backgroundColor: theme.palette.background.alt || theme.palette.background.paper,
        borderRadius: "12px",
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography variant="h6" color={theme.palette.secondary[200]} gutterBottom>
            {title}
          </Typography>
          <Typography variant="h3" fontWeight="bold" sx={{ color: color || theme.palette.secondary[100] }}>
            {value || "---"} 
          </Typography>
        </Box>
        <Box sx={{ backgroundColor: `${color}20`, p: 1, borderRadius: "8px", color: color }}>
          {icon}
        </Box>
      </Stack>
      <Typography variant="body2" sx={{ mt: 1, color: theme.palette.success.main }}>
        {subtitle}
      </Typography>
    </Paper>
  );
};

// --- COMPONENTE PRINCIPAL ---
const Dashboard = () => {
  const theme = useTheme();
  const isLg = useMediaQuery(theme.breakpoints.up("lg"));
  
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/dashboard");
        if (!response.ok) throw new Error("Falha na requisição");
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const COLORS = [theme.palette.primary.main, theme.palette.secondary.main, "#00C49F", "#FFBB28"];

  const columns = [
    { field: "id", headerName: "ID", flex: 0.3 },
    { 
      field: "userName", 
      headerName: "Cliente (UserService)", 
      flex: 1.2, 
      renderCell: (p) => (
        <Stack direction="row" alignItems="center" spacing={1} height="100%">
          <AccountCircle sx={{ color: theme.palette.primary.main }} fontSize="small" />
          <Typography variant="body2" fontWeight="500">
            {p.value || "Usuário não identificado"}
          </Typography>
        </Stack>
      )
    },
    { field: "date", headerName: "Data da Transação", flex: 0.8 },
    { field: "products", headerName: "Produtos", flex: 0.4, align: 'center' },
    { 
      field: "cost", 
      headerName: "Valor Total", 
      flex: 0.7, 
      renderCell: (p) => (
        <Typography color="#4caf50" fontWeight="bold">
          {`R$ ${Number(p.value || 0).toFixed(2)}`}
        </Typography>
      )
    },
  ];

  if (isLoading) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress color="secondary" />
        <Typography sx={{ mt: 2 }}>Sincronizando com Banco de Dados e UserService...</Typography>
      </Box>
    );
  }

  const metrics = data?.metrics || {};
  const chartData = data?.chartData || [];
  
  // CORREÇÃO AQUI: Convertendo os valores de String para Number para o PieChart funcionar
  const pieData = (data?.pieData || []).map(item => ({
    name: item.name,
    value: Number(item.value)
  }));

  const transactions = data?.transactions || [];

  return (
    <Box m="1.5rem 2.5rem">
      <Stack direction={isLg ? "row" : "column"} justifyContent="space-between" alignItems="center" mb={4} spacing={2}>
        <Box>
          <Typography variant="h2" fontWeight="bold" color={theme.palette.secondary[100]}>
            DASHBOARD INTEGRADO
          </Typography>
          <Typography variant="h6" color={theme.palette.secondary[300]}>
            Analytics & Gestão de Usuários (Lions Service)
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button 
            variant="contained" 
            color="secondary" 
            startIcon={<AdminPanelSettings />} 
            sx={{ borderRadius: "8px", px: 3 }}
            onClick={() => window.open('https://user-service-gamma.vercel.app/', '_blank')}
          >
            Acessar UserService
          </Button>
          <Button variant="outlined" startIcon={<DownloadOutlined />} sx={{ borderRadius: "8px", px: 3 }}>
            Relatório PDF
          </Button>
        </Stack>
      </Stack>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard title="Total de Clientes" value={metrics.totalCustomers} icon={<Group />} subtitle="Base UserService" color={theme.palette.primary.main} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard title="Vendas Hoje" value={metrics.todaySales} icon={<Payments />} subtitle="Meta diária" color="#4caf50" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard title="Faturamento Mensal" value={metrics.monthlySales} icon={<CalendarMonth />} subtitle="Crescimento de 12%" color="#ff9800" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard title="ROI" value={metrics.roi} icon={<TrendingUp />} subtitle="Saúde Financeira" color="#2196f3" />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, borderRadius: "12px", backgroundColor: theme.palette.background.alt }}>
            <Typography variant="h5" mb={3} fontWeight="600">Performance Financeira</Typography>
            <Box height="350px">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.2}/>
                      <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Legend verticalAlign="top" height={36}/>
                  <Area type="monotone" dataKey="vendas" stroke={theme.palette.primary.main} fillOpacity={1} fill="url(#colorVendas)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, borderRadius: "12px", backgroundColor: theme.palette.background.alt, height: '100%' }}>
            <Typography variant="h5" mb={3} fontWeight="600">Perfis de Usuários (Roles)</Typography>
            <Box height="300px">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={pieData} 
                    innerRadius={60} 
                    outerRadius={80} 
                    paddingAngle={5} 
                    dataKey="value"
                    nameKey="name"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} Usuários`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Stack spacing={1}>
               <Typography variant="body2" display="flex" justifyContent="space-between">
                  <span>Conversão:</span> <strong>{metrics.conversion || "0%"}</strong>
               </Typography>
               <Typography variant="body2" display="flex" justifyContent="space-between">
                  <span>Ticket Médio:</span> <strong>{metrics.avgTicket || "R$ 0"}</strong>
               </Typography>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2, borderRadius: "12px", backgroundColor: theme.palette.background.alt }}>
            <Typography variant="h5" mb={2} fontWeight="600">Histórico de Vendas Integrado</Typography>
            <Box height="400px" sx={{ 
              "& .MuiDataGrid-root": { border: "none" },
              "& .MuiDataGrid-columnHeaders": { backgroundColor: theme.palette.background.default, borderRadius: '8px' }
            }}>
              <DataGrid
                rows={transactions}
                columns={columns}
                localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
                getRowId={(row) => row.id}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;