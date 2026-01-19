import React, { useState, useMemo } from "react";
import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
  Card,
  Grid,
  Paper,
  Stack,
  Divider,
} from "@mui/material";
import {
  DownloadOutlined,
  Edit,
  Group,
  Payments,
  CalendarMonth,
  Public,
  TrendingUp,
  AccountCircle,
} from "@mui/icons-material";
import { DataGrid, ptBR } from "@mui/x-data-grid";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// --- COMPONENTES AUXILIARES ---

const DashboardCard = ({ title, value, icon, subtitle, color }) => {
  const theme = useTheme();
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        backgroundColor: theme.palette.background.alt,
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
            {value}
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

  // Dados Simulados (Substitua pelo retorno da sua API)
  const mockData = {
    metrics: {
      totalCustomers: "1,240",
      todaySales: "R$ 12.500",
      monthlySales: "R$ 285.000",
      yearlySales: "R$ 3.250.000",
      roi: "32%",
      monthlyGoal: "85%",
      avgTicket: "R$ 245",
      conversion: "12.5%",
    },
    chartData: [
      { name: "Jan", vendas: 4000, custo: 2400 },
      { name: "Fev", vendas: 3000, custo: 1398 },
      { name: "Mar", vendas: 9800, custo: 2000 },
      { name: "Abr", vendas: 3908, custo: 2780 },
      { name: "Mai", vendas: 4800, custo: 1890 },
      { name: "Jun", vendas: 3800, custo: 2390 },
    ],
    pieData: [
      { name: "Marketing", value: 400 },
      { name: "Operação", value: 300 },
      { name: "Logística", value: 300 },
      { name: "Outros", value: 200 },
    ],
    transactions: [
      { id: 1, userId: "USR-001", date: "2024-01-20", products: 3, cost: 450.0 },
      { id: 2, userId: "USR-082", date: "2024-01-21", products: 1, cost: 120.5 },
      { id: 3, userId: "USR-125", date: "2024-01-21", products: 5, cost: 890.0 },
    ],
  };

  const COLORS = [theme.palette.primary.main, theme.palette.secondary.main, "#00C49F", "#FFBB28"];

  const columns = [
    { field: "id", headerName: "ID Transação", flex: 0.5 },
    { field: "userId", headerName: "ID Usuário", flex: 1, renderCell: (p) => (
      <Stack direction="row" alignItems="center" spacing={1}>
        <AccountCircle fontSize="small" />
        <Typography variant="body2">{p.value}</Typography>
      </Stack>
    )},
    { field: "date", headerName: "Data Criação", flex: 1 },
    { field: "products", headerName: "Produtos", flex: 0.5, align: 'center' },
    { field: "cost", headerName: "Custo (R$)", flex: 1, renderCell: (p) => `R$ ${p.value.toFixed(2)}` },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      {/* HEADER */}
      <Stack direction={isLg ? "row" : "column"} justifyContent="space-between" alignItems="center" mb={4} spacing={2}>
        <Box>
          <Typography variant="h2" fontWeight="bold" color={theme.palette.secondary[100]}>
            DASHBOARD EXECUTIVO
          </Typography>
          <Typography variant="h6" color={theme.palette.secondary[300]}>
            Bem-vindo ao seu painel de controle de performance.
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" startIcon={<Edit />} sx={{ borderRadius: "8px", px: 3 }}>
            Editar Dados
          </Button>
          <Button variant="outlined" startIcon={<DownloadOutlined />} sx={{ borderRadius: "8px", px: 3 }}>
            Exportar
          </Button>
        </Stack>
      </Stack>

      {/* GRID DE MÉTRICAS RÁPIDAS */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard title="Clientes" value={mockData.metrics.totalCustomers} icon={<Group />} subtitle="+14% este mês" color={theme.palette.primary.main} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard title="Vendas Hoje" value={mockData.metrics.todaySales} icon={<Payments />} subtitle="Meta diária batida" color="#4caf50" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard title="Mensal" value={mockData.metrics.monthlySales} icon={<CalendarMonth />} subtitle="Em crescimento" color="#ff9800" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard title="ROI Total" value={mockData.metrics.roi} icon={<TrendingUp />} subtitle="Retorno saudável" color="#2196f3" />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* GRÁFICO PRINCIPAL - VENDA VS CUSTO */}
        
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, borderRadius: "12px", backgroundColor: theme.palette.background.alt }}>
            <Typography variant="h5" mb={3} fontWeight="600">Performance: Vendas vs Custos</Typography>
            <Box height="350px">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockData.chartData}>
                  <defs>
                    <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.1}/>
                      <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Legend verticalAlign="top" height={36}/>
                  <Area type="monotone" dataKey="vendas" stroke={theme.palette.primary.main} fillOpacity={1} fill="url(#colorVendas)" strokeWidth={3} />
                  <Area type="monotone" dataKey="custo" stroke={theme.palette.secondary.main} fillOpacity={0} strokeWidth={2} strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* DISTRIBUIÇÃO DE CUSTO */}
        
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, borderRadius: "12px", backgroundColor: theme.palette.background.alt, height: '100%' }}>
            <Typography variant="h5" mb={3} fontWeight="600">Distribuição de Custos</Typography>
            <Box height="300px">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockData.pieData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {mockData.pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Stack spacing={1}>
               <Typography variant="body2" display="flex" justifyContent="space-between">
                  <span>Conversão:</span> <strong>{mockData.metrics.conversion}</strong>
               </Typography>
               <Typography variant="body2" display="flex" justifyContent="space-between">
                  <span>Ticket Médio:</span> <strong>{mockData.metrics.avgTicket}</strong>
               </Typography>
            </Stack>
          </Paper>
        </Grid>

        {/* TABELA DE TRANSAÇÕES */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, borderRadius: "12px", backgroundColor: theme.palette.background.alt }}>
            <Typography variant="h5" mb={2} fontWeight="600">Transações Recentes</Typography>
            <Box height="400px" sx={{ 
              "& .MuiDataGrid-root": { border: "none" },
              "& .MuiDataGrid-columnHeaders": { backgroundColor: theme.palette.background.default, borderRadius: '8px' }
            }}>
              <DataGrid
                rows={mockData.transactions}
                columns={columns}
                localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
                disableSelectionOnClick
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;