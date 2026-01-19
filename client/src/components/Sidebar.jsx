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
  LockOutlined,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";

const navItems = [
  {
    text: "Dashboard",
    icon: <HomeOutlined />,
    link: "/dashboard",
    available: true
  },
  {
    text: "Produtos",
    icon: <ShoppingCartOutlined />,
    link: "/produtos",
    available: false
  },
  {
    text: "Clientes",
    icon: <Groups2Outlined />,
    link: "/clientes",
    available: false
  },
  {
    text: "Transações",
    icon: <ReceiptLongOutlined />,
    link: "/transacoes",
    available: false
  },
  {
    text: "Geografia",
    icon: <PublicOutlined />,
    link: "/geografia",
    available: false
  },
  {
    text: "Visão Geral",
    icon: <PointOfSaleOutlined />,
    link: "/visao-geral",
    available: false
  },
  {
    text: "Diário",
    icon: <TodayOutlined />,
    link: "/diario",
    available: false
  },
  {
    text: "Mensal",
    icon: <CalendarMonthOutlined />,
    link: "/mensal",
    available: false
  },
  {
    text: "Detalhamento",
    icon: <PieChartOutlined />,
    link: "/detalhamento",
    available: false
  },
  {
    text: "Administração",
    icon: <AdminPanelSettingsOutlined />,
    link: "/administracao",
    available: false
  },
  {
    text: "Desempenho",
    icon: <TrendingUpOutlined />,
    link: "/desempenho",
    available: false
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
            <Box m="1.5rem 1.5rem 2rem 1.5rem">
              <FlexBetween color={theme.palette.secondary.main}>
                <Box 
                  display="flex" 
                  alignItems="center" 
                  gap="0.75rem" 
                  width="100%" 
                  justifyContent="flex-start"
                >
                  {/* Logo + Texto */}
                  <Box
                    component="img"
                    alt="logo"
                    src="/assets/logo.png"
                    height="42px"
                    sx={{ 
                      objectFit: "contain"
                    }}
                  />
                  
                  {/* Texto DescomplicAI Moderno */}
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 800,
                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                        fontSize: '1.5rem',
                        letterSpacing: '-0.5px',
                        lineHeight: 1.2,
                      }}
                    >
                      DescomplicAI
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 900,
                        background: `linear-gradient(45deg, ${theme.palette.accent.main}, ${theme.palette.primary.light})`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                        fontSize: '1.5rem',
                        letterSpacing: '-0.5px',
                        lineHeight: 1,
                        marginTop: '-4px',
                      }}
                    >
                    </Typography>
                  </Box>
                </Box>
                
                {!isNonMobile && (
                  <IconButton 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    sx={{
                      color: theme.palette.secondary[300],
                    }}
                  >
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
                            : theme.palette.grey[100],
                          '&:hover': {
                            backgroundColor: available 
                              ? theme.palette.secondary[400] 
                              : 'transparent',
                          },
                          cursor: available ? 'pointer' : 'not-allowed',
                          opacity: available ? 1 : 0.6,
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            ml: "2rem",
                            color: available
                              ? active === link
                                ? theme.palette.primary[600]
                                : theme.palette.secondary[100]
                              : theme.palette.grey[500],
                          }}
                        >
                          {icon}
                        </ListItemIcon>
                        <ListItemText 
                          primary={text} 
                          sx={{
                            '& .MuiTypography-root': {
                              color: '[100]',
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
                              color: theme.palette.grey[100]
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