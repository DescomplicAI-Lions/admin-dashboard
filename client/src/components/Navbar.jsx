import React, { useState } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Menu,
  MenuItem,
  useTheme,
  Avatar,
  Divider,
  ListItemIcon,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  LightModeOutlined,
  DarkModeOutlined,
  NotificationsOutlined,
  SettingsOutlined,
  PersonOutlined,
  Search,
  Logout,
  AdminPanelSettings,
} from "@mui/icons-material";
import { setMode, setLogout } from "../state";
import FlexBetween from "./FlexBetween";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.global.user);
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleProfileClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    dispatch(setLogout());
    localStorage.clear();
    handleClose();
    navigate("/");
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <Box 
      display="flex" 
      justifyContent="space-between" 
      alignItems="center" 
      p="1rem 2rem"
      sx={{
        backgroundColor: "transparent",
      }}
    >
      {/* LADO ESQUERDO: BARRA DE BUSCA */}
      <FlexBetween
        backgroundColor={theme.palette.background.alt}
        borderRadius="12px"
        p="0.3rem 1rem"
        border={`1px solid ${theme.palette.divider}`}
        sx={{
          transition: "all 0.3s ease",
          "&:focus-within": {
            borderColor: theme.palette.primary.main,
            boxShadow: `0 0 0 2px ${theme.palette.primary.main}20`,
          }
        }}
      >
        <InputBase placeholder="Buscar..." sx={{ ml: 1, flex: 1 }} />
        <IconButton sx={{ p: 1 }}>
          <Search />
        </IconButton>
      </FlexBetween>

      {/* LADO DIREITO: AÇÕES E PERFIL */}
      <Box display="flex" alignItems="center" gap="0.5rem">
        <IconButton onClick={() => dispatch(setMode())}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlined sx={{ fontSize: "25px" }} />
          ) : (
            <LightModeOutlined sx={{ fontSize: "25px" }} />
          )}
        </IconButton>
        
        <IconButton>
          <NotificationsOutlined sx={{ fontSize: "25px" }} />
        </IconButton>
        
        <IconButton>
          <SettingsOutlined sx={{ fontSize: "25px" }} />
        </IconButton>

        <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 1 }} />

        {/* BOTÃO DE PERFIL COM AVATAR */}
        <IconButton 
          onClick={handleProfileClick}
          sx={{ 
            p: "4px",
            border: isMenuOpen ? `2px solid ${theme.palette.primary.main}` : "2px solid transparent",
            transition: "0.2s"
          }}
        >
          <Avatar 
            sx={{ 
              width: 32, 
              height: 32, 
              bgcolor: theme.palette.primary.main,
              fontSize: "0.9rem",
              fontWeight: "bold"
            }}
          >
            {user?.name?.charAt(0) || "A"}
          </Avatar>
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={isMenuOpen}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{
            elevation: 10,
            sx: {
              mt: 1.5,
              borderRadius: "12px",
              minWidth: 180,
              padding: "4px",
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.alt,
            }
          }}
        >
          {user ? (
            <Box>
              <Box px={2} py={1.5}>
                <Typography variant="subtitle2" fontWeight="700">
                  {user.name || "Usuário"}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {user.email || "admin@descomplicai.com"}
                </Typography>
              </Box>
              <Divider sx={{ my: 0.5 }} />
              <MenuItem onClick={handleClose}>
                <ListItemIcon><PersonOutlined fontSize="small" /></ListItemIcon>
                Meu Perfil
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ListItemIcon><AdminPanelSettings fontSize="small" /></ListItemIcon>
                Configurações
              </MenuItem>
              <Divider sx={{ my: 0.5 }} />
              <MenuItem onClick={handleLogout} sx={{ color: theme.palette.error.main }}>
                <ListItemIcon><Logout fontSize="small" color="error" /></ListItemIcon>
                Sair
              </MenuItem>
            </Box>
          ) : (
            <MenuItem onClick={() => navigate("/login")}>
              <ListItemIcon><PersonOutlined fontSize="small" /></ListItemIcon>
              Fazer Login
            </MenuItem>
          )}
        </Menu>
      </Box>
    </Box>
  );
};

export default Navbar;