import React, { useState } from "react";
import FlexBetween from "components/FlexBetween";
import Header from "components/Header";
import {
  DownloadOutlined,
  Email,
  PointOfSale,
  PersonAdd,
  Traffic,
  TrendingUp,
  Edit,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useGetDashboardQuery } from "state/api";
import StatBox from "components/StatBox";

// Componente para gráfico de barras simples
const SimpleBarChart = ({ data, title, onEdit }) => {
  const theme = useTheme();
  
  const chartData = data?.monthlyData || [
    { month: "Jan", sales: 250000, cost: 180000 },
    { month: "Fev", sales: 275000, cost: 190000 },
    { month: "Mar", sales: 300000, cost: 210000 },
    { month: "Abr", sales: 320000, cost: 220000 },
    { month: "Mai", sales: 350000, cost: 240000 },
    { month: "Jun", sales: 380000, cost: 260000 },
  ];

  const maxValue = Math.max(...chartData.map(item => Math.max(item.sales, item.cost)));
  const chartHeight = 200;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" sx={{ color: theme.palette.secondary[100] }}>
          {title}
        </Typography>
        <Button 
          size="small" 
          onClick={onEdit}
          sx={{ color: theme.palette.secondary[300] }}
        >
          Editar
        </Button>
      </Box>
      
      <Box sx={{ height: chartHeight, position: 'relative', mb: 2 }}>
        {/* Linhas de grade */}
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
            <Box
              key={index}
              sx={{
                position: 'absolute',
                top: `${ratio * 100}%`,
                left: 0,
                right: 0,
                height: '1px',
                backgroundColor: theme.palette.divider,
                opacity: 0.3,
              }}
            />
          ))}
        </Box>

        {/* Barras do gráfico */}
        <Box sx={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          display: 'flex', 
          alignItems: 'flex-end', 
          px: 2,
          gap: 1
        }}>
          {chartData.map((item, index) => {
            const salesHeight = (item.sales / maxValue) * chartHeight;
            const costHeight = (item.cost / maxValue) * chartHeight;
            
            return (
              <Box key={index} sx={{ 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                height: '100%',
                justifyContent: 'flex-end'
              }}>
                {/* Grupo de barras lado a lado */}
                <Box display="flex" gap={1} sx={{ width: '100%', justifyContent: 'center' }}>
                  {/* Barra de vendas */}
                  <Box
                    sx={{
                      width: '45%',
                      height: salesHeight,
                      backgroundColor: theme.palette.success.main,
                      borderRadius: '2px 2px 0 0',
                      minHeight: '2px'
                    }}
                  />
                  {/* Barra de custo */}
                  <Box
                    sx={{
                      width: '45%',
                      height: costHeight,
                      backgroundColor: theme.palette.error.main,
                      borderRadius: '2px 2px 0 0',
                      minHeight: '2px'
                    }}
                  />
                </Box>
                {/* Label do mês */}
                <Typography variant="caption" sx={{ color: theme.palette.secondary[400], mt: 1 }}>
                  {item.month}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Legenda */}
      <Box display="flex" justifyContent="center" gap={3} mt={2}>
        <Box display="flex" alignItems="center" gap={1}>
          <Box sx={{ width: 12, height: 12, backgroundColor: theme.palette.success.main, borderRadius: 1 }} />
          <Typography variant="body2" sx={{ color: theme.palette.secondary[300] }}>Vendas</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Box sx={{ width: 12, height: 12, backgroundColor: theme.palette.error.main, borderRadius: 1 }} />
          <Typography variant="body2" sx={{ color: theme.palette.secondary[300] }}>Custos</Typography>
        </Box>
      </Box>
    </Box>
  );
};

// Componente para gráfico de pizza de ROI
const ROIPieChart = ({ data, onEdit }) => {
  const theme = useTheme();
  
  const costData = data?.costDistribution || [
    { name: "Marketing", value: 35, color: theme.palette.secondary[500] },
    { name: "Produtos", value: 25, color: theme.palette.primary[500] },
    { name: "Infraestrutura", value: 20, color: theme.palette.success.main },
    { name: "Pessoal", value: 15, color: theme.palette.warning.main },
    { name: "Outros", value: 5, color: theme.palette.error.main },
  ];

  const totalInvestment = costData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" sx={{ color: theme.palette.secondary[100] }}>
          Distribuição de Custos
        </Typography>
        <Button 
          size="small" 
          onClick={onEdit}
          sx={{ color: theme.palette.secondary[300] }}
        >
          Editar
        </Button>
      </Box>
      
      <Box display="flex" flexDirection="column" gap={2} mb={2}>
        {costData.map((item, index) => (
          <Box key={index} display="flex" alignItems="center" gap={2}>
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                backgroundColor: item.color,
              }}
            />
            <Box flex={1}>
              <Typography variant="body2" sx={{ color: theme.palette.secondary[200] }}>
                {item.name}
              </Typography>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" sx={{ color: theme.palette.secondary[300] }}>
                  {item.value}%
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.secondary[400] }}>
                  {item.value}%
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      <Box 
        sx={{ 
          p: 2, 
          backgroundColor: theme.palette.background.paper,
          borderRadius: 1,
          border: `1px solid ${theme.palette.divider}`
        }}
      >
        <Typography variant="body2" sx={{ color: theme.palette.secondary[200] }}>
          Distribuição Percentual:
        </Typography>
        <Typography variant="h6" sx={{ color: theme.palette.success.main }}>
          {totalInvestment}% Total
        </Typography>
      </Box>
    </Box>
  );
};

// Componente para gráfico de lucro vs custo
const ProfitCostChart = ({ data, onEdit }) => {
  const theme = useTheme();
  
  const chartData = data?.profitData || [
    { month: "Jan", sales: 250000, cost: 180000, profit: 70000 },
    { month: "Fev", sales: 275000, cost: 190000, profit: 85000 },
    { month: "Mar", sales: 300000, cost: 210000, profit: 90000 },
    { month: "Abr", sales: 320000, cost: 220000, profit: 100000 },
    { month: "Mai", sales: 350000, cost: 240000, profit: 110000 },
    { month: "Jun", sales: 380000, cost: 260000, profit: 120000 },
  ];

  const maxValue = Math.max(...chartData.map(item => Math.max(item.sales, item.cost, item.profit)));
  const chartHeight = 200;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" sx={{ color: theme.palette.secondary[100] }}>
          Lucro vs Custo
        </Typography>
        <Button 
          size="small" 
          onClick={onEdit}
          sx={{ color: theme.palette.secondary[300] }}
        >
          Editar
        </Button>
      </Box>
      
      <Box sx={{ height: chartHeight, position: 'relative', mb: 2 }}>
        {/* Linhas de grade */}
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
            <Box
              key={index}
              sx={{
                position: 'absolute',
                top: `${ratio * 100}%`,
                left: 0,
                right: 0,
                height: '1px',
                backgroundColor: theme.palette.divider,
                opacity: 0.3,
              }}
            />
          ))}
        </Box>

        {/* Barras do gráfico */}
        <Box sx={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          display: 'flex', 
          alignItems: 'flex-end', 
          px: 2,
          gap: 1
        }}>
          {chartData.map((item, index) => {
            const salesHeight = (item.sales / maxValue) * chartHeight;
            const costHeight = (item.cost / maxValue) * chartHeight;
            const profitHeight = (item.profit / maxValue) * chartHeight;
            
            return (
              <Box key={index} sx={{ 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                height: '100%',
                justifyContent: 'flex-end'
              }}>
                {/* Grupo de barras lado a lado */}
                <Box display="flex" gap={0.5} sx={{ width: '100%', justifyContent: 'center' }}>
                  {/* Barra de lucro */}
                  <Box
                    sx={{
                      width: '30%',
                      height: profitHeight,
                      backgroundColor: theme.palette.success.main,
                      borderRadius: '2px 2px 0 0',
                      minHeight: '2px'
                    }}
                  />
                  {/* Barra de custo */}
                  <Box
                    sx={{
                      width: '30%',
                      height: costHeight,
                      backgroundColor: theme.palette.error.main,
                      borderRadius: '2px 2px 0 0',
                      minHeight: '2px'
                    }}
                  />
                  {/* Barra de vendas */}
                  <Box
                    sx={{
                      width: '30%',
                      height: salesHeight,
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: '2px 2px 0 0',
                      minHeight: '2px'
                    }}
                  />
                </Box>
                {/* Label do mês */}
                <Typography variant="caption" sx={{ color: theme.palette.secondary[400], mt: 1 }}>
                  {item.month}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Legenda */}
      <Box display="flex" justifyContent="center" gap={2} mt={2} flexWrap="wrap">
        <Box display="flex" alignItems="center" gap={1}>
          <Box sx={{ width: 12, height: 12, backgroundColor: theme.palette.primary.main, borderRadius: 1 }} />
          <Typography variant="body2" sx={{ color: theme.palette.secondary[300] }}>Vendas</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Box sx={{ width: 12, height: 12, backgroundColor: theme.palette.error.main, borderRadius: 1 }} />
          <Typography variant="body2" sx={{ color: theme.palette.secondary[300] }}>Custos</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Box sx={{ width: 12, height: 12, backgroundColor: theme.palette.success.main, borderRadius: 1 }} />
          <Typography variant="body2" sx={{ color: theme.palette.secondary[300] }}>Lucro</Typography>
        </Box>
      </Box>
    </Box>
  );
};

// Função para calcular métricas automaticamente
const calculateMetrics = (data) => {
  if (!data) return {};

  const { 
    totalCustomers = 0,
    todayStats = { totalSales: 0 },
    thisMonthStats = { totalSales: 0 },
    yearlySalesTotal = 0,
    transactions = [],
    monthlyData = []
  } = data;

  // Calcular ROI baseado no lucro e custo
  const totalRevenue = yearlySalesTotal || 3250000;
  const totalCost = monthlyData.reduce((sum, month) => sum + (month.totalExpenses || 180000), 0);
  const roiPercentage = totalCost > 0 ? ((totalRevenue - totalCost) / totalCost * 100) : 32;

  // Calcular métricas adicionais
  const totalTransactions = transactions.length || 13250;
  const averageTicket = totalTransactions > 0 ? totalRevenue / totalTransactions : 245;
  const monthlyGoal = 100000;
  const goalAchievement = monthlyGoal > 0 ? ((thisMonthStats.totalSales || 285000) / monthlyGoal * 100) : 75;
  const conversionRate = totalCustomers > 0 ? (totalTransactions / totalCustomers * 100) : 12.5;

  return {
    totalCustomers: totalCustomers || 1240,
    todaySales: todayStats.totalSales || 12500,
    monthlySales: thisMonthStats.totalSales || 285000,
    yearlySales: yearlySalesTotal || 3250000,
    roi: Math.round(roiPercentage),
    averageTicket: Math.round(averageTicket),
    goalAchievement: Math.min(Math.round(goalAchievement), 100),
    conversionRate: conversionRate.toFixed(1)
  };
};

// Modal para editar métricas principais
const EditMetricsModal = ({ open, onClose, metrics, onSave }) => {
  const [editedMetrics, setEditedMetrics] = useState(metrics);

  const handleSave = () => {
    onSave(editedMetrics);
    onClose();
  };

  const handleChange = (field, value) => {
    setEditedMetrics(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Editar Métricas Principais</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Total de Clientes"
              type="number"
              value={editedMetrics.totalCustomers}
              onChange={(e) => handleChange('totalCustomers', parseInt(e.target.value) || 0)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Vendas Hoje"
              type="number"
              value={editedMetrics.todaySales}
              onChange={(e) => handleChange('todaySales', parseInt(e.target.value) || 0)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Vendas Mensais"
              type="number"
              value={editedMetrics.monthlySales}
              onChange={(e) => handleChange('monthlySales', parseInt(e.target.value) || 0)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Vendas Anuais"
              type="number"
              value={editedMetrics.yearlySales}
              onChange={(e) => handleChange('yearlySales', parseInt(e.target.value) || 0)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="ROI (%)"
              type="number"
              value={editedMetrics.roi}
              onChange={(e) => handleChange('roi', parseInt(e.target.value) || 0)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Ticket Médio"
              type="number"
              value={editedMetrics.averageTicket}
              onChange={(e) => handleChange('averageTicket', parseInt(e.target.value) || 0)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained">Salvar</Button>
      </DialogActions>
    </Dialog>
  );
};

// Modal para editar dados dos gráficos
const EditChartDataModal = ({ open, onClose, chartType, chartData, onSave }) => {
  const [editedData, setEditedData] = useState(chartData);

  const handleSave = () => {
    onSave(editedData);
    onClose();
  };

  const handleChange = (index, field, value) => {
    const newData = [...editedData];
    newData[index] = { ...newData[index], [field]: parseInt(value) || 0 };
    setEditedData(newData);
  };

  const getTitle = () => {
    switch(chartType) {
      case 'salesCost': return 'Vendas vs Custos';
      case 'profit': return 'Lucro vs Custo';
      case 'roi': return 'Distribuição de Custos';
      default: return 'Editar Dados do Gráfico';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Editar {getTitle()}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {editedData.map((item, index) => (
            <React.Fragment key={index}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ color: 'text.primary', mb: 1 }}>
                  {item.month || item.name}
                </Typography>
              </Grid>
              {'sales' in item && (
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Vendas"
                    type="number"
                    value={item.sales}
                    onChange={(e) => handleChange(index, 'sales', e.target.value)}
                  />
                </Grid>
              )}
              {'cost' in item && (
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Custos"
                    type="number"
                    value={item.cost}
                    onChange={(e) => handleChange(index, 'cost', e.target.value)}
                  />
                </Grid>
              )}
              {'profit' in item && (
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Lucro"
                    type="number"
                    value={item.profit}
                    onChange={(e) => handleChange(index, 'profit', e.target.value)}
                  />
                </Grid>
              )}
              {'value' in item && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Percentual (%)"
                    type="number"
                    value={item.value}
                    onChange={(e) => handleChange(index, 'value', e.target.value)}
                  />
                </Grid>
              )}
            </React.Fragment>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained">Salvar</Button>
      </DialogActions>
    </Dialog>
  );
};

const Dashboard = () => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const { data, isLoading } = useGetDashboardQuery();
  
  const [editMetricsModalOpen, setEditMetricsModalOpen] = useState(false);
  const [editChartModalOpen, setEditChartModalOpen] = useState(false);
  const [currentChartType, setCurrentChartType] = useState('');
  const [customMetrics, setCustomMetrics] = useState(null);
  const [customChartData, setCustomChartData] = useState({});

  const columns = [
    {
      field: "_id",
      headerName: "ID",
      flex: 1,
    },
    {
      field: "userId",
      headerName: "ID do Usuário",
      flex: 1,
    },
    {
      field: "createdAt",
      headerName: "Data de Criação",
      flex: 1,
      renderCell: (params) => {
        return new Date(params.value).toLocaleDateString('pt-BR');
      },
    },
    {
      field: "products",
      headerName: "Nº de Produtos",
      flex: 0.5,
      sortable: false,
      renderCell: (params) => params.value.length,
    },
    {
      field: "cost",
      headerName: "Custo",
      flex: 1,
      renderCell: (params) => `R$${Number(params.value).toFixed(2)}`,
    },
  ];

  // Calcular métricas automaticamente
  const apiMetrics = calculateMetrics(data);
  const metrics = customMetrics || apiMetrics;

  // Dados de fallback enquanto carrega
  const dashboardData = data || {
    totalCustomers: 1240,
    todayStats: { totalSales: 12500 },
    thisMonthStats: { totalSales: 285000 },
    yearlySalesTotal: 3250000,
    transactions: [
      {
        _id: "1",
        userId: "user123",
        createdAt: "2024-01-15T10:30:00Z",
        products: [{}, {}, {}],
        cost: 299.97
      },
      {
        _id: "2",
        userId: "user456",
        createdAt: "2024-01-14T14:20:00Z",
        products: [{}, {}],
        cost: 199.98
      }
    ],
    monthlyData: [
      { month: "Jan", sales: 250000, cost: 180000 },
      { month: "Fev", sales: 275000, cost: 190000 },
      { month: "Mar", sales: 300000, cost: 210000 },
      { month: "Abr", sales: 320000, cost: 220000 },
      { month: "Mai", sales: 350000, cost: 240000 },
      { month: "Jun", sales: 380000, cost: 260000 },
    ],
    profitData: [
      { month: "Jan", sales: 250000, cost: 180000, profit: 70000 },
      { month: "Fev", sales: 275000, cost: 190000, profit: 85000 },
      { month: "Mar", sales: 300000, cost: 210000, profit: 90000 },
    ],
    costDistribution: [
      { name: "Marketing", value: 35 },
      { name: "Produtos", value: 25 },
      { name: "Infraestrutura", value: 20 },
      { name: "Pessoal", value: 15 },
      { name: "Outros", value: 5 },
    ]
  };

  // Combinar dados customizados com dados padrão
  const combinedData = {
    ...dashboardData,
    monthlyData: customChartData.salesCost || dashboardData.monthlyData,
    profitData: customChartData.profit || dashboardData.profitData,
    costDistribution: customChartData.roi || dashboardData.costDistribution
  };

  const handleSaveMetrics = (newMetrics) => {
    setCustomMetrics(newMetrics);
  };

  const handleEditChart = (chartType) => {
    setCurrentChartType(chartType);
    setEditChartModalOpen(true);
  };

  const handleSaveChartData = (newData) => {
    setCustomChartData(prev => ({
      ...prev,
      [currentChartType]: newData
    }));
  };

  const getChartDataForEdit = () => {
    switch(currentChartType) {
      case 'salesCost': return combinedData.monthlyData;
      case 'profit': return combinedData.profitData;
      case 'roi': return combinedData.costDistribution;
      default: return [];
    }
  };

  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <Header title="PAINEL ADMINISTRATIVO" subtitle="Visão geral do seu negócio" />

        <Box display="flex" gap={2}>
          <Button
            startIcon={<Edit />}
            onClick={() => setEditMetricsModalOpen(true)}
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: "white",
              fontSize: "14px",
              fontWeight: 700,
              padding: "10px 20px",
              borderRadius: "8px",
              textTransform: "none",
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              }
            }}
          >
            Editar Informações
          </Button>
          <Button
            sx={{
              backgroundColor: "#ffffff",
              color: "#8c67ff",
              fontSize: "14px",
              fontWeight: 700,
              padding: "10px 20px",
              borderRadius: "8px",
              textTransform: "none",
              '&:hover': {
                backgroundColor: "#f5f5f5",
              }
            }}
          >
            <DownloadOutlined sx={{ mr: "10px" }} />
            Baixar Relatórios
          </Button>
        </Box>
      </FlexBetween>

      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="160px"
        gap="20px"
        sx={{
          "& > div": { 
            gridColumn: isNonMediumScreens ? undefined : "span 12",
          },
        }}
      >
        {/* ROW 1 - TODOS OS STATS CARDS NA MESMA LINHA */}
        <StatBox
          title="Total de Clientes"
          value={metrics.totalCustomers}
          increase="+14%"
          description="Desde o mês passado"
          icon={<Email sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />}
        />
        
        <StatBox
          title="Vendas Hoje"
          value={metrics.todaySales}
          increase="+21%"
          description="Desde ontem"
          icon={<PointOfSale sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />}
        />

        <StatBox
          title="Vendas Mensais"
          value={metrics.monthlySales}
          increase="+5%"
          description="Desde o mês passado"
          icon={<PersonAdd sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />}
        />

        <StatBox
          title="Vendas Anuais"
          value={metrics.yearlySales}
          increase="+43%"
          description="Desde o ano passado"
          icon={<Traffic sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />}
        />

        <StatBox
          title="ROI Total"
          value={`+${metrics.roi}%`}
          increase="+8%"
          description="Retorno sobre investimento"
          icon={<TrendingUp sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />}
        />

        {/* GRÁFICO PRINCIPAL - VENDAS VS CUSTOS */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={theme.palette.background.alt}
          p="1rem"
          borderRadius="0.55rem"
          sx={{
            minHeight: "300px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <SimpleBarChart 
            data={combinedData} 
            title="Vendas vs Custos (Últimos 6 Meses)" 
            onEdit={() => handleEditChart('salesCost')}
          />
        </Box>

        {/* ESPAÇO VAZIO PARA COMPLETAR O GRID */}
        <Box gridColumn="span 4" gridRow="span 2" />

        {/* ROW 2 - TABELA E GRÁFICOS */}
        <Box
          gridColumn="span 8"
          gridRow="span 3"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
              borderRadius: "0.55rem",
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
              backgroundColor: theme.palette.background.alt,
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
            rows={combinedData.transactions}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
          />
        </Box>

        {/* COLUNA DIREITA - GRÁFICOS */}
        <Box
          gridColumn="span 4"
          gridRow="span 3"
          display="flex"
          flexDirection="column"
          gap="20px"
        >
          {/* Gráfico de ROI */}
          <Card sx={{ backgroundColor: theme.palette.background.alt, borderRadius: "0.55rem", flex: 1 }}>
            <CardContent>
              <ROIPieChart 
                data={combinedData} 
                onEdit={() => handleEditChart('roi')}
              />
            </CardContent>
          </Card>

          {/* Gráfico de Lucro vs Custo */}
          <Card sx={{ backgroundColor: theme.palette.background.alt, borderRadius: "0.55rem", flex: 1 }}>
            <CardContent>
              <ProfitCostChart 
                data={combinedData} 
                onEdit={() => handleEditChart('profit')}
              />
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* ROW 3 - METAS E KPIs ADICIONAIS */}
      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(auto-fit, minmax(240px, 1fr))"
        gap="20px"
      >
        <Card sx={{ backgroundColor: theme.palette.background.alt, p: 2 }}>
          <Typography variant="h6" sx={{ color: theme.palette.secondary[100] }}>
            Meta Mensal
          </Typography>
          <Typography variant="h4" sx={{ color: theme.palette.success.main, mt: 1 }}>
            {metrics.goalAchievement}%
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.secondary[200] }}>
            Atingido da meta de vendas
          </Typography>
        </Card>

        <Card sx={{ backgroundColor: theme.palette.background.alt, p: 2 }}>
          <Typography variant="h6" sx={{ color: theme.palette.secondary[100] }}>
            Ticket Médio
          </Typography>
          <Typography variant="h4" sx={{ color: theme.palette.primary.main, mt: 1 }}>
            R$ {metrics.averageTicket}
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.secondary[200] }}>
            Valor médio por venda
          </Typography>
        </Card>

        <Card sx={{ backgroundColor: theme.palette.background.alt, p: 2 }}>
          <Typography variant="h6" sx={{ color: theme.palette.secondary[100] }}>
            Conversão
          </Typography>
          <Typography variant="h4" sx={{ color: theme.palette.warning.main, mt: 1 }}>
            {metrics.conversionRate}%
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.secondary[200] }}>
            Taxa de conversão
          </Typography>
        </Card>
      </Box>

      {/* Modais */}
      <EditMetricsModal
        open={editMetricsModalOpen}
        onClose={() => setEditMetricsModalOpen(false)}
        metrics={metrics}
        onSave={handleSaveMetrics}
      />

      <EditChartDataModal
        open={editChartModalOpen}
        onClose={() => setEditChartModalOpen(false)}
        chartType={currentChartType}
        chartData={getChartDataForEdit()}
        onSave={handleSaveChartData}
      />
    </Box>
  );
};

export default Dashboard;