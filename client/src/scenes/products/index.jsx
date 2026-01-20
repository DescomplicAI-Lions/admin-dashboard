import React, { useState } from "react";
import {
  Box, Card, Button, Typography, useTheme, useMediaQuery, Modal, TextField,
  MenuItem, Grid, IconButton, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, FormControl, InputLabel, Select, Avatar
} from "@mui/material";
import { Add, Close, Edit, Delete, Warning, Inventory2Outlined, CategoryOutlined, AttachMoneyOutlined } from "@mui/icons-material";
import Header from "components/Header";
import { useGetProductsQuery } from "state/api";

const ProductRow = ({ product, onEdit, onDelete }) => {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const getStockColor = (s) => s <= 10 ? theme.palette.error.main : s <= 20 ? theme.palette.warning.main : theme.palette.success.main;

  return (
    <>
      <TableRow sx={{ '&:hover': { backgroundColor: theme.palette.background.alt }, transition: "0.2s" }}>
        <TableCell>
          <Box display="flex" alignItems="center" gap="12px">
            <Avatar sx={{ bgcolor: theme.palette.primary[100], color: theme.palette.primary[600], borderRadius: "8px" }}>
              {product.name.charAt(0)}
            </Avatar>
            <Typography variant="body1" fontWeight="600">{product.name}</Typography>
          </Box>
        </TableCell>
        <TableCell>
          <Chip label={product.category} size="small" sx={{ borderRadius: "6px", fontWeight: "600", textTransform: "uppercase", fontSize: "10px" }} color="primary" variant="light" />
        </TableCell>
        <TableCell><Typography fontWeight="700">R$ {Number(product.price).toFixed(2)}</Typography></TableCell>
        <TableCell>
          <Box display="flex" alignItems="center" gap="8px">
            <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: getStockColor(product.supply) }} />
            <Typography variant="body2" fontWeight="600">{product.supply} un.</Typography>
          </Box>
        </TableCell>
        <TableCell>
          <Box display="flex" gap={1}>
            <IconButton size="small" onClick={() => onEdit(product)} sx={{ color: theme.palette.primary.main }}><Edit fontSize="small" /></IconButton>
            <IconButton size="small" onClick={() => onDelete(product._id)} sx={{ color: theme.palette.error.main }}><Delete fontSize="small" /></IconButton>
            <Button size="small" onClick={() => setIsExpanded(!isExpanded)} variant="text" sx={{ fontWeight: "700" }}>
              {isExpanded ? "Fechar" : "Detalhes"}
            </Button>
          </Box>
        </TableCell>
      </TableRow>
      
      {isExpanded && (
        <TableRow>
          <TableCell colSpan={5} sx={{ backgroundColor: theme.palette.background.alt, p: 0 }}>
            <Box p={3} sx={{ borderLeft: `4px solid ${theme.palette.primary.main}`, m: 2, borderRadius: "8px", bgcolor: theme.palette.background.default }}>
              <Typography variant="h6" gutterBottom color="primary">Descrição do Produto</Typography>
              <Typography variant="body2" mb={2}>{product.description}</Typography>
              <Grid container spacing={3}>
                <Grid item xs={3}>
                  <Typography variant="caption" color="textSecondary">VENDAS ANUAIS</Typography>
                  <Typography variant="body1" fontWeight="700">R$ {Number(product.stat?.yearlySalesTotal || 0).toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="caption" color="textSecondary">UNIDADES VENDIDAS</Typography>
                  <Typography variant="body1" fontWeight="700">{product.stat?.yearlyTotalSoldUnits || 0}</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="caption" color="textSecondary">DATA CADASTRO</Typography>
                  <Typography variant="body1" fontWeight="700">{new Date(product.createdAt).toLocaleDateString()}</Typography>
                </Grid>
              </Grid>
            </Box>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

const Products = () => {
  const { data, isLoading } = useGetProductsQuery();
  const theme = useTheme();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const allProducts = data || [];
  const categories = [...new Set(allProducts.map(p => p.category))].sort();
  const filteredProducts = selectedCategory === "all" ? allProducts : allProducts.filter(p => p.category === selectedCategory);

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="ESTOQUE" subtitle="Gerenciamento inteligente de produtos." />

      {/* CARDS DE RESUMO RÁPIDO */}
      <Grid container spacing={2} mb={4}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 2, display: "flex", alignItems: "center", gap: 2, bgcolor: theme.palette.background.alt }}>
            <Avatar sx={{ bgcolor: theme.palette.primary.main }}><Inventory2Outlined /></Avatar>
            <Box>
              <Typography variant="h6" fontWeight="800">{allProducts.length}</Typography>
              <Typography variant="body2" color="textSecondary">Total de Itens</Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 2, display: "flex", alignItems: "center", gap: 2, bgcolor: theme.palette.background.alt }}>
            <Avatar sx={{ bgcolor: theme.palette.secondary.main }}><CategoryOutlined /></Avatar>
            <Box>
              <Typography variant="h6" fontWeight="800">{categories.length}</Typography>
              <Typography variant="body2" color="textSecondary">Categorias Ativas</Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 2, display: "flex", alignItems: "center", gap: 2, bgcolor: theme.palette.background.alt }}>
            <Avatar sx={{ bgcolor: "#2dd4bf" }}><AttachMoneyOutlined /></Avatar>
            <Box>
              <Typography variant="h6" fontWeight="800">
                R$ {allProducts.reduce((acc, p) => acc + (p.price * p.supply), 0).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="textSecondary">Valor em Estoque</Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Box display="flex" justifyContent="space-between" mb={3}>
        <FormControl sx={{ minWidth: 250 }}>
          <InputLabel>Filtrar Categoria</InputLabel>
          <Select value={selectedCategory} label="Filtrar Categoria" onChange={(e) => setSelectedCategory(e.target.value)} sx={{ borderRadius: "12px" }}>
            <MenuItem value="all">Todas as Categorias</MenuItem>
            {categories.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setIsFormOpen(true)}
          sx={{
            borderRadius: "12px",
            px: 3,
            fontWeight: "bold",
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary[600]})`,
            boxShadow: "0 4px 14px 0 rgba(0,0,0,0.15)"
          }}
        >
          Novo Produto
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: "16px", boxShadow: "none", border: `1px solid ${theme.palette.divider}`, bgcolor: "transparent" }}>
        <Table>
          <TableHead sx={{ bgcolor: theme.palette.background.alt }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "700" }}>PRODUTO</TableCell>
              <TableCell sx={{ fontWeight: "700" }}>CATEGORIA</TableCell>
              <TableCell sx={{ fontWeight: "700" }}>PREÇO UNITÁRIO</TableCell>
              <TableCell sx={{ fontWeight: "700" }}>DISPONIBILIDADE</TableCell>
              <TableCell sx={{ fontWeight: "700" }}>AÇÕES</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((product) => (
              <ProductRow key={product._id} product={product} onEdit={() => {}} onDelete={() => {}} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Products;