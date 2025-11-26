import React, { useState } from "react";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Collapse,
  Button,
  Typography,
  Rating,
  useTheme,
  useMediaQuery,
  Modal,
  TextField,
  MenuItem,
  Grid,
  IconButton,
} from "@mui/material";
import { Add, Close } from "@mui/icons-material";
import Header from "components/Header";
import { useGetProductsQuery } from "state/api";

const Product = ({
  _id,
  name,
  description,
  price,
  rating,
  category,
  supply,
  stat,
}) => {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card
      sx={{
        backgroundImage: "none",
        backgroundColor: theme.palette.background.alt,
        borderRadius: "0.55rem",
      }}
    >
      <CardContent>
        <Typography
          sx={{ fontSize: 14 }}
          color={theme.palette.secondary[700]}
          gutterBottom
        >
          {category}
        </Typography>
        <Typography variant="h5" component="div">
          {name}
        </Typography>
        <Typography sx={{ mb: "1.5rem" }} color={theme.palette.secondary[400]}>
          R${Number(price).toFixed(2)}
        </Typography>
        <Rating value={rating} readOnly />

        <Typography variant="body2">{description}</Typography>
      </CardContent>
      <CardActions>
        <Button
          variant="primary"
          size="small"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          Ver Mais
        </Button>
      </CardActions>
      <Collapse
        in={isExpanded}
        timeout="auto"
        unmountOnExit
        sx={{
          color: theme.palette.neutral[300],
        }}
      >
        <CardContent>
          <Typography>ID: {_id}</Typography>
          <Typography>Estoque Disponível: {supply}</Typography>
          <Typography>
            Vendas Anuais Este Ano: {stat?.yearlySalesTotal || 0}
          </Typography>
          <Typography>
            Unidades Vendidas Este Ano: {stat?.yearlyTotalSoldUnits || 0}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
};

// Modal de Cadastro de Produto
const ProductForm = ({ open, onClose, onSubmit }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    supply: "",
    rating: 0,
  });

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      supply: "",
      rating: 0,
    });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: theme.palette.background.default,
          boxShadow: 24,
          p: 4,
          borderRadius: "12px",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" fontWeight="bold">
            Cadastrar Novo Produto
          </Typography>
          <IconButton onClick={onClose}>
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
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Categoria"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Typography component="legend">Avaliação</Typography>
              <Rating
                name="rating"
                value={Number(formData.rating)}
                onChange={(event, newValue) => {
                  setFormData({
                    ...formData,
                    rating: newValue,
                  });
                }}
              />
            </Grid>
          </Grid>

          <Box mt={3} display="flex" gap={2}>
            <Button
              fullWidth
              variant="outlined"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              fullWidth
              variant="contained"
              type="submit"
            >
              Cadastrar
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

const Products = () => {
  const { data, isLoading, error } = useGetProductsQuery();
  const isNonMobile = useMediaQuery("(min-width: 1000px)");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const theme = useTheme(); // ✅ CORREÇÃO: Adicionei esta linha

  // Função para adicionar novo produto (simulação)
  const handleAddProduct = (newProduct) => {
    const product = {
      _id: Math.random().toString(36).substr(2, 9),
      ...newProduct,
      price: Number(newProduct.price),
      supply: Number(newProduct.supply),
      stat: {
        yearlySalesTotal: 0,
        yearlyTotalSoldUnits: 0,
      },
      createdAt: new Date().toISOString(),
    };
    setProducts([product, ...products]);
  };

  // Combina produtos da API com produtos locais
  const allProducts = [...(data || []), ...products];

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
      <Header title="PRODUTOS" subtitle="Veja sua lista de produtos." />
      
      {/* Botão de Adicionar Produto */}
      <Box display="flex" justifyContent="flex-end" mb={3}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setIsFormOpen(true)}
          sx={{
            backgroundColor: theme.palette.secondary.main, // ✅ Agora theme está definido
            '&:hover': {
              backgroundColor: theme.palette.secondary.dark, // ✅ Agora theme está definido
            },
          }}
        >
          Adicionar Produto
        </Button>
      </Box>

      {/* Lista de Produtos */}
      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
        justifyContent="space-between"
        rowGap="20px"
        columnGap="1.33%"
        sx={{
          "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
        }}
      >
        {allProducts.map((product) => (
          <Product
            key={product._id}
            _id={product._id}
            name={product.name}
            description={product.description}
            price={product.price}
            rating={product.rating}
            category={product.category}
            supply={product.supply}
            stat={product.stat || {}}
          />
        ))}
      </Box>

      {/* Modal de Cadastro */}
      <ProductForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddProduct}
      />

      {/* Mensagem de erro */}
      {error && (
        <Box mt={2}>
          <Typography color="error">
            Erro ao carregar produtos da API: {error.message}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Você ainda pode cadastrar novos produtos localmente.
          </Typography>
        </Box>
      )}

      {/* Mensagem quando não há produtos */}
      {allProducts.length === 0 && !isLoading && (
        <Box textAlign="center" mt={4}>
          <Typography variant="h6" color="textSecondary">
            Nenhum produto cadastrado
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Clique em "Adicionar Produto" para começar.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Products;