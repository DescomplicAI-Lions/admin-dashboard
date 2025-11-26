import React, { useState } from "react";
import {
  Box,
  Card,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
  Modal,
  TextField,
  MenuItem,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { Add, Close, Edit, Delete, Warning } from "@mui/icons-material";
import Header from "components/Header";
import { useGetProductsQuery } from "state/api";

const ProductRow = ({
  product,
  onEdit,
  onDelete,
}) => {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  // Determinar cor do estoque baseado na quantidade
  const getStockColor = (supply) => {
    if (supply <= 10) return "error";
    if (supply <= 20) return "warning";
    return "success";
  };

  return (
    <>
      <TableRow
        sx={{
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
        }}
      >
        <TableCell>
          <Typography variant="subtitle2" fontWeight="bold">
            {product.name}
          </Typography>
        </TableCell>
        <TableCell>
          <Chip 
            label={product.category} 
            size="small"
            color="primary"
            variant="outlined"
          />
        </TableCell>
        <TableCell>
          <Typography variant="body2">
            R${Number(product.price).toFixed(2)}
          </Typography>
        </TableCell>
        <TableCell>
          <Chip 
            label={product.supply}
            size="small"
            color={getStockColor(product.supply)}
            variant="filled"
          />
        </TableCell>
        <TableCell>
          <Box display="flex" gap={1}>
            <IconButton 
              size="small" 
              onClick={() => onEdit(product)}
              color="primary"
            >
              <Edit fontSize="small" />
            </IconButton>
            <IconButton 
              size="small" 
              onClick={() => onDelete(product._id)}
              color="error"
            >
              <Delete fontSize="small" />
            </IconButton>
            <Button
              size="small"
              onClick={() => setIsExpanded(!isExpanded)}
              variant="outlined"
            >
              {isExpanded ? "Menos" : "Mais"}
            </Button>
          </Box>
        </TableCell>
      </TableRow>
      
      {isExpanded && (
        <TableRow>
          <TableCell colSpan={5} sx={{ backgroundColor: theme.palette.background.default }}>
            <Box p={2}>
              <Typography variant="subtitle2" gutterBottom>
                Descrição:
              </Typography>
              <Typography variant="body2" paragraph>
                {product.description}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>ID:</strong> {product._id}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Vendas Anuais:</strong> R$ {Number(product.stat?.yearlySalesTotal || 0).toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Unidades Vendidas:</strong> {product.stat?.yearlyTotalSoldUnits || 0}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Criado em:</strong> {new Date(product.createdAt).toLocaleDateString()}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

// Componente para mostrar produtos com pouco estoque - AGORA BEM PEQUENO
const LowStockProducts = ({ products }) => {
  const theme = useTheme();

  // Filtrar produtos com estoque baixo (≤ 20) e ordenar por estoque (menor primeiro)
  const lowStockProducts = products
    .filter(product => product.supply <= 20)
    .sort((a, b) => a.supply - b.supply)
    .slice(0, 3); // Top 3 com menor estoque

  if (lowStockProducts.length === 0) {
    return null;
  }

  return (
    <Card sx={{ 
      mb: 2, 
      border: `1px solid ${theme.palette.warning.main}`,
      maxWidth: '400px',
      alignSelf: 'flex-start'
    }}>
      <Box p={1}>
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <Warning color="warning" fontSize="small" />
          <Typography variant="subtitle2" fontWeight="bold" color="warning.dark">
            Estoque Baixo
          </Typography>
        </Box>
        <TableContainer>
          <Table size="small" sx={{ minWidth: 'auto' }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ 
                  fontWeight: 'bold', 
                  padding: '4px 8px',
                  fontSize: '0.7rem'
                }}>
                  Produto
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 'bold', 
                  padding: '4px 8px',
                  fontSize: '0.7rem'
                }}>
                  Estoque
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lowStockProducts.map((product) => (
                <TableRow 
                  key={product._id}
                  sx={{ 
                    '&:last-child td, &:last-child th': { border: 0 },
                  }}
                >
                  <TableCell sx={{ 
                    padding: '4px 8px',
                    maxWidth: '200px'
                  }}>
                    <Typography variant="body2" fontSize="0.75rem" noWrap>
                      {product.name}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ padding: '4px 8px' }}>
                    <Chip 
                      label={product.supply}
                      size="small"
                      color={product.supply <= 10 ? "error" : "warning"}
                      variant="filled"
                      sx={{ 
                        fontSize: '0.7rem', 
                        height: '20px',
                        minWidth: '30px'
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Card>
  );
};

// Modal de Cadastro/Edição de Produto
const ProductForm = ({ open, onClose, onSubmit, product, isEditing }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    newCategory: "",
    supply: "",
  });
  const [errors, setErrors] = useState({});
  const [showNewCategory, setShowNewCategory] = useState(false);

  const categories = [
    "Eletrônicos",
    "Roupas",
    "Casa e Decoração",
    "Livros",
    "Esportes",
    "Beleza",
    "Alimentação",
    "Outros"
  ];

  // Reset form quando abrir/fechar modal
  React.useEffect(() => {
    if (open) {
      if (isEditing && product) {
        // Preencher com dados do produto para edição
        setFormData({
          name: product.name || "",
          description: product.description || "",
          price: product.price || "",
          category: product.category || "",
          newCategory: "",
          supply: product.supply || "",
        });
        setShowNewCategory(false);
      } else {
        // Limpar form para novo produto
        setFormData({
          name: "",
          description: "",
          price: "",
          category: "",
          newCategory: "",
          supply: "",
        });
        setShowNewCategory(false);
      }
      setErrors({});
    }
  }, [open, isEditing, product]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nome do produto é obrigatório";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Descrição é obrigatória";
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = "Preço deve ser maior que zero";
    } else if (formData.price.toString().length > 5) {
      newErrors.price = "Preço deve ter no máximo 5 dígitos";
    }

    if (!formData.supply || formData.supply < 0) {
      newErrors.supply = "Estoque não pode ser negativo";
    } else if (formData.supply.toString().length > 5) {
      newErrors.supply = "Estoque deve ter no máximo 5 dígitos";
    }

    if (!formData.category && !formData.newCategory) {
      newErrors.category = "Categoria é obrigatória";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Limitar para 5 dígitos nos campos numéricos
    if ((name === 'price' || name === 'supply') && value.length > 5) {
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });

    // Limpar erro do campo quando usuário começar a digitar
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (value === "new") {
      setShowNewCategory(true);
      setFormData({
        ...formData,
        category: "",
        newCategory: "",
      });
    } else {
      setShowNewCategory(false);
      setFormData({
        ...formData,
        category: value,
        newCategory: "",
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const finalCategory = showNewCategory ? formData.newCategory : formData.category;

    const submitData = {
      ...formData,
      category: finalCategory,
      price: Number(formData.price),
      supply: Number(formData.supply),
    };

    // Manter o rating existente se estiver editando (para compatibilidade com a API)
    if (isEditing && product) {
      submitData.rating = product.rating || 0;
    }

    onSubmit(submitData);
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          maxWidth: '90vw',
          maxHeight: '90vh',
          overflow: 'auto',
          bgcolor: theme.palette.background.default,
          boxShadow: 24,
          p: 4,
          borderRadius: "12px",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" fontWeight="bold">
            {isEditing ? "Editar Produto" : "Cadastrar Novo Produto"}
          </Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nome do Produto"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição"
                name="description"
                value={formData.description}
                onChange={handleChange}
                error={!!errors.description}
                helperText={errors.description}
                multiline
                rows={3}
                required
              />
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Preço (R$)"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                error={!!errors.price}
                helperText={errors.price}
                inputProps={{ 
                  min: "0", 
                  max: "99999",
                  step: "0.01"
                }}
                required
              />
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Estoque"
                name="supply"
                type="number"
                value={formData.supply}
                onChange={handleChange}
                error={!!errors.supply}
                helperText={errors.supply}
                inputProps={{ 
                  min: "0", 
                  max: "99999"
                }}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Categoria"
                name="category"
                value={showNewCategory ? "new" : formData.category}
                onChange={handleCategoryChange}
                error={!!errors.category}
                helperText={errors.category}
                required
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
                <MenuItem value="new">
                  <em>+ Adicionar nova categoria</em>
                </MenuItem>
              </TextField>
            </Grid>

            {showNewCategory && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nova Categoria"
                  name="newCategory"
                  value={formData.newCategory}
                  onChange={handleChange}
                  error={!!errors.category}
                  helperText="Digite o nome da nova categoria"
                />
              </Grid>
            )}
          </Grid>

          <Box mt={3} display="flex" gap={2}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleClose}
            >
              Cancelar
            </Button>
            <Button
              fullWidth
              variant="contained"
              type="submit"
            >
              {isEditing ? "Atualizar" : "Cadastrar"}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

const Products = () => {
  const { data, isLoading } = useGetProductsQuery();
  const isNonMobile = useMediaQuery("(min-width: 1000px)");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const theme = useTheme();

  const handleAddProduct = (newProduct) => {
    const product = {
      _id: Math.random().toString(36).substr(2, 9),
      ...newProduct,
      rating: 0, // Rating sempre começa em 0 (será definido pelos clientes)
      stat: {
        yearlySalesTotal: 0,
        yearlyTotalSoldUnits: 0,
      },
      createdAt: new Date().toISOString(),
    };
    setProducts([product, ...products]);
  };

  const handleEditProduct = (updatedProduct) => {
    if (editingProduct) {
      // Se é um produto local
      if (products.find(p => p._id === editingProduct._id)) {
        setProducts(products.map(p => 
          p._id === editingProduct._id 
            ? { ...p, ...updatedProduct }
            : p
        ));
      }
    }
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      // Se é um produto local
      if (products.find(p => p._id === productId)) {
        setProducts(products.filter(p => p._id !== productId));
      }
    }
  };

  const openEditForm = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (formData) => {
    if (editingProduct) {
      handleEditProduct(formData);
      setEditingProduct(null);
    } else {
      handleAddProduct(formData);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  // Combina produtos da API com produtos locais
  const allProducts = [...(data || []), ...products];

  // Obter categorias únicas para o filtro
  const categories = [...new Set(allProducts.map(product => product.category))].sort();

  // Filtrar produtos por categoria
  const filteredProducts = selectedCategory === "all" 
    ? allProducts 
    : allProducts.filter(product => product.category === selectedCategory);

  if (isLoading) {
    return (
      <Box m="1.5rem 2.5rem">
        <Header title="PRODUTOS" subtitle="Veja sua lista de produtos." />
        <Typography>Carregando produtos...</Typography>
      </Box>
    );
  }

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="PRODUTOS" subtitle="Gerencie sua lista de produtos." />
      
      {/* Layout com tabela de estoque baixo à direita */}
      <Box display="flex" gap={3} alignItems="flex-start">
        {/* Conteúdo principal */}
        <Box flex={1}>
          {/* Filtros e Botão de Adicionar */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} gap={2} mt={2}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel id="category-filter-label">Filtrar por Categoria</InputLabel>
              <Select
                labelId="category-filter-label"
                value={selectedCategory}
                label="Filtrar por Categoria"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <MenuItem value="all">Todas as Categorias</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setIsFormOpen(true)}
              sx={{
                backgroundColor: theme.palette.secondary.main,
                '&:hover': {
                  backgroundColor: theme.palette.secondary.dark,
                },
              }}
            >
              Adicionar Produto
            </Button>
          </Box>

          {/* Lista de Produtos em Tabela */}
          <Card>
            <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Nome</strong></TableCell>
                    <TableCell><strong>Categoria</strong></TableCell>
                    <TableCell><strong>Preço</strong></TableCell>
                    <TableCell><strong>Estoque</strong></TableCell>
                    <TableCell><strong>Ações</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <ProductRow
                      key={product._id}
                      product={product}
                      onEdit={openEditForm}
                      onDelete={handleDeleteProduct}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>

          {/* Mensagem quando não há produtos */}
          {filteredProducts.length === 0 && !isLoading && (
            <Box textAlign="center" mt={4} p={4}>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                {selectedCategory === "all" 
                  ? "Nenhum produto cadastrado" 
                  : `Nenhum produto na categoria "${selectedCategory}"`}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {selectedCategory === "all" 
                  ? 'Clique em "Adicionar Produto" para começar.' 
                  : 'Tente selecionar outra categoria ou adicionar um novo produto.'}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Tabela de Produtos com Baixo Estoque - AGORA NA DIREITA */}
        <LowStockProducts products={allProducts} />
      </Box>

      {/* Modal de Cadastro/Edição */}
      <ProductForm
        open={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        product={editingProduct}
        isEditing={!!editingProduct}
      />
    </Box>
  );
};

export default Products;