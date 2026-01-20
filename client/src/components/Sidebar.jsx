import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  Avatar,
  Divider,
} from "@mui/material"; // Componentes de layout
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
  LockOutlined,
  LogoutOutlined,
} from "@mui/icons-material"; // Ícones específicos
import FlexBetween from "./FlexBetween";

const navItems = [
  { text: "Dashboard", icon: <HomeOutlined />, link: "/dashboard", available: true },
  { text: "Produtos", icon: <ShoppingCartOutlined />, link: "/produtos", available: false },
  { text: "Clientes", icon: <Groups2Outlined />, link: "/clientes", available: false },
  { text: "Transações", icon: <ReceiptLongOutlined />, link: "/transacoes", available: false },
  { text: "Geografia", icon: <PublicOutlined />, link: "/geografia", available: false },
  { text: "Visão Geral", icon: <PointOfSaleOutlined />, link: "/visao-geral", available: false },
  { text: "Diário", icon: <TodayOutlined />, link: "/diario", available: false },
  { text: "Mensal", icon: <CalendarMonthOutlined />, link: "/mensal", available: false },
  { text: "Detalhamento", icon: <PieChartOutlined />, link: "/detalhamento", available: false },
  { text: "Administração", icon: <AdminPanelSettingsOutlined />, link: "/administracao", available: false },
  { text: "Desempenho", icon: <TrendingUpOutlined />, link: "/desempenho", available: false },
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
              boxSizing: "border-box",
              width: drawerWidth,
              borderRight: `1px solid ${theme.palette.divider}`,
              display: "flex",
              flexDirection: "column",
            },
          }}
        >
          {/* TOP: LOGO */}
          <Box width="100%">
            <Box p="1.5rem 1.5rem 1rem 1.5rem">
              <FlexBetween>
                <Box display="flex" alignItems="center" gap="0.75rem">
                  <Box
                    component="img"
                    alt="logo"
                    src="/assets/logo.png"
                    height="32px"
                    sx={{ borderRadius: "8px" }}
                  />
                  <Typography variant="h4" fontWeight="900" sx={{
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}>
                    DescomplicAI
                  </Typography>
                </Box>
                {!isNonMobile && (
                  <IconButton onClick={() => setIsSidebarOpen(false)}>
                    <ChevronLeft />
                  </IconButton>
                )}
              </FlexBetween>
            </Box>

            {/* MIDDLE: LINKS */}
            <List sx={{ px: "0.8rem" }}>
              {navItems.map(({ text, icon, link, available }) => {
                const isActive = active === link;

                return (
                  <Tooltip 
                    key={text} 
                    title={!available ? "Funcionalidade em desenvolvimento" : ""} 
                    placement="right"
                  >
                    <ListItem disablePadding sx={{ mb: "4px" }}>
                      <ListItemButton
                        onClick={() => handleNavigation(link, available)}
                        sx={{
                          borderRadius: "10px",
                          backgroundColor: isActive ? theme.palette.secondary[300] : "transparent",
                          color: available ? (isActive ? theme.palette.primary[600] : theme.palette.secondary[100]) : theme.palette.grey[500],
                          opacity: available ? 1 : 0.6,
                          "&:hover": {
                            backgroundColor: available ? (isActive ? theme.palette.secondary[300] : theme.palette.background.default) : "transparent",
                          },
                          cursor: available ? "pointer" : "default",
                        }}
                      >
                        <ListItemIcon sx={{ 
                          minWidth: "40px",
                          color: available ? (isActive ? theme.palette.primary[600] : theme.palette.secondary[100]) : theme.palette.grey[500] 
                        }}>
                          {icon}
                        </ListItemIcon>
                        <ListItemText primary={text} primaryTypographyProps={{ fontWeight: isActive ? "bold" : "500" }} />
                        {isActive && available && <ChevronRightOutlined />}
                        {!available && <LockOutlined sx={{ fontSize: "16px" }} />}
                      </ListItemButton>
                    </ListItem>
                  </Tooltip>
                );
              })}
            </List>
          </Box>

          {/* BOTTOM: USER INFO */}
          <Box sx={{ mt: "auto", p: "1.5rem", borderTop: `1px solid ${theme.palette.divider}` }}>
            <FlexBetween>
              <Box display="flex" alignItems="center" gap="1rem">
                <Avatar sx={{ bgcolor: theme.palette.primary.main }}>A</Avatar>
                <Box textAlign="left">
                  <Typography fontWeight="bold" fontSize="0.9rem" color={theme.palette.secondary[100]}>
                    {user?.name || "Administrador"}
                  </Typography>
                  <Typography fontSize="0.8rem" color={theme.palette.secondary[400]}>
                    Admin Geral
                  </Typography>
                </Box>
              </Box>
              <IconButton size="small">
                <LogoutOutlined fontSize="small" />
              </IconButton>
            </FlexBetween>
          </Box>
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;