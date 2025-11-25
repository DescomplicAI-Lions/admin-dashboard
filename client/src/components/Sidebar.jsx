import React from "react";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
  Tooltip,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRightOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  Groups2Outlined,
  ReceiptLongOutlined,
  PublicOutlined,
  PointOfSaleOutlined,
  TodayOutlined,
  CalendarMonthOutlined,
  AdminPanelSettingsOutlined,
  TrendingUpOutlined,
  PieChartOutlined,
  LockOutlined, // ✅ Ícone de cadeado adicionado
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";

const navItems = [
  {
    text: "Dashboard",
    icon: <HomeOutlined />,
    link: "/dashboard",
    available: true // ✅ Disponível
  },
  {
    text: "Produtos",
    icon: <ShoppingCartOutlined />,
    link: "/produtos",
    available: true // ✅ Disponível
  },
  {
    text: "Clientes",
    icon: <Groups2Outlined />,
    link: "/clientes",
    available: true // ✅ Disponível
  },
  {
    text: "Transações",
    icon: <ReceiptLongOutlined />,
    link: "/transacoes",
    available: true // ✅ Disponível
  },
  {
    text: "Geografia",
    icon: <PublicOutlined />,
    link: "/geografia",
    available: false // 🔒 Futura ferramenta
  },
  {
    text: "Visão Geral",
    icon: <PointOfSaleOutlined />,
    link: "/visao-geral",
    available: false // 🔒 Futura ferramenta
  },
  {
    text: "Diário",
    icon: <TodayOutlined />,
    link: "/diario",
    available: false // 🔒 Futura ferramenta
  },
  {
    text: "Mensal",
    icon: <CalendarMonthOutlined />,
    link: "/mensal",
    available: false // 🔒 Futura ferramenta
  },
  {
    text: "Detalhamento",
    icon: <PieChartOutlined />,
    link: "/detalhamento",
    available: false // 🔒 Futura ferramenta
  },
  {
    text: "Administração",
    icon: <AdminPanelSettingsOutlined />,
    link: "/administracao",
    available: false // 🔒 Futura ferramenta
  },
  {
    text: "Desempenho",
    icon: <TrendingUpOutlined />,
    link: "/desempenho",
    available: false // 🔒 Futura ferramenta
  },
];

const Sidebar = ({
  user,
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
  isNonMobile,
}) => {
  const { pathname } = useLocation();
  const [active, setActive] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    setActive(pathname);
  }, [pathname]);

  const handleNavigation = (link, available) => {
    if (available) {
      navigate(link);
      setActive(link);
    }
    // Se não estiver disponível, não faz nada (item bloqueado)
  };

  return (
    <Box component="nav">
      {isSidebarOpen && (
        <Drawer
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          variant="persistent"
          anchor="left"
          sx={{
            width: drawerWidth,
            "& .MuiDrawer-paper": {
              color: theme.palette.secondary[200],
              backgroundColor: theme.palette.background.alt,
              boxSixing: "border-box",
              borderWidth: isNonMobile ? 0 : "2px",
              width: drawerWidth,
            },
          }}
        >
          <Box width="100%">
            <Box m="1.5rem 2rem 2rem 3rem">
              <FlexBetween color={theme.palette.secondary.main}>
                <Box display="flex" alignItems="center" gap="0.5rem" width="100%" justifyContent="center">
                  {/* Logo - CENTRALIZADA */}
                  <Box
                    component="img"
                    alt="logo"
                    src="/assets/logo.png"
                    height="40px"
                    sx={{ 
                      objectFit: "contain"
                    }}
                  />
                </Box>
                {!isNonMobile && (
                  <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <ChevronLeft />
                  </IconButton>
                )}
              </FlexBetween>
            </Box>
            <List>
              {navItems.map(({ text, icon, link, available }) => {
                if (!icon) {
                  return (
                    <Typography key={text} sx={{ m: "2.25rem 0 1rem 3rem" }}>
                      {text}
                    </Typography>
                  );
                }

                return (
                  <Tooltip 
                    key={text} 
                    title={!available ? "Em breve - Funcionalidade futura" : ""} 
                    placement="right"
                  >
                    <ListItem disablePadding>
                      <ListItemButton
                        onClick={() => handleNavigation(link, available)}
                        sx={{
                          backgroundColor:
                            active === link && available
                              ? theme.palette.secondary[300]
                              : "transparent",
                          color: available
                            ? active === link
                              ? theme.palette.primary[600]
                              : theme.palette.secondary[100]
                            : theme.palette.grey[500], // ✅ Cinza para itens não disponíveis
                          '&:hover': {
                            backgroundColor: available 
                              ? theme.palette.secondary[400] 
                              : 'transparent', // ✅ Sem hover para itens bloqueados
                          },
                          cursor: available ? 'pointer' : 'not-allowed', // ✅ Cursor diferente
                          opacity: available ? 1 : 0.6, // ✅ Opacidade reduzida
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            ml: "2rem",
                            color: available
                              ? active === link
                                ? theme.palette.primary[600]
                                : theme.palette.secondary[200]
                              : theme.palette.grey[500], // ✅ Ícone cinza
                          }}
                        >
                          {icon}
                        </ListItemIcon>
                        <ListItemText 
                          primary={text} 
                          sx={{
                            '& .MuiTypography-root': {
                              color: 'inherit', // ✅ Herda a cor do ListItemButton
                            }
                          }}
                        />
                        {active === link && available && (
                          <ChevronRightOutlined sx={{ ml: "auto" }} />
                        )}
                        {!available && (
                          <LockOutlined 
                            sx={{ 
                              ml: "auto", 
                              fontSize: "18px",
                              color: theme.palette.grey[500] // ✅ Cadeado cinza
                            }} 
                          />
                        )}
                      </ListItemButton>
                    </ListItem>
                  </Tooltip>
                );
              })}
            </List>
          </Box>
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;