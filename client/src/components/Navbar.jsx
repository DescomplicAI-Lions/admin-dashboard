import { useState } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Menu,
  MenuItem,
  useTheme,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  LightMode,
  DarkMode,
  Notifications,
  Settings,
  Person,
  Search,
  Logout, // ✅ Adicione o ícone de logout
} from "@mui/icons-material";
import { setMode, setLogout } from "../state"; // ✅ Importe setLogout
import { useAuth } from "auth/useAuth";

const Navbar = () => {
  const { logout: authLogout } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // ✅ FUNÇÃO DE LOGOUT CORRIGIDA
  const handleLogout = () => {
    authLogout();

    // 2. Limpa redux (se você ainda usa user lá)
    dispatch(setLogout());

    // 3. Fecha menu
    handleClose();

    // 4. Redireciona para login
    navigate("/login", { replace: true });
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box
        display="flex"
        backgroundColor={theme.palette.background.alt}
        borderRadius="9px"
        gap="3rem"
        p="0.1rem 1.5rem"
      >
        <InputBase placeholder="Search..." />
        <IconButton>
          <Search />
        </IconButton>
      </Box>

      {/* ICONS */}
      <Box display="flex" alignItems="center" gap="1rem">
        <IconButton onClick={() => dispatch(setMode())}>
          {theme.palette.mode === "dark" ? (
            <DarkMode sx={{ fontSize: "25px" }} />
          ) : (
            <LightMode sx={{ fontSize: "25px" }} />
          )}
        </IconButton>
        
        <IconButton>
          <Notifications sx={{ fontSize: "25px" }} />
        </IconButton>
        
        <IconButton>
          <Settings sx={{ fontSize: "25px" }} />
        </IconButton>

        {/* ✅ BOTÃO DE PERFIL/LOGOUT CORRIGIDO */}
        <IconButton onClick={handleProfileClick}>
          <Person sx={{ fontSize: "25px" }} />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          PaperProps={{
            elevation: 3,
            sx: {
              mt: 1.5,
              minWidth: 120,
            }
          }}
        >
          {user ? (
            <>
              <MenuItem onClick={handleClose}>
                <Typography>👤 {user.name || "Usuário"}</Typography>
              </MenuItem>

              <MenuItem onClick={handleLogout}>
                <Typography color="error">🚪 Sair</Typography>
              </MenuItem>
            </>
          ) : (
            <MenuItem onClick={handleLogin}>
              <Typography>🔐 Fazer Login</Typography>
            </MenuItem>
          )}
        </Menu>
      </Box>
    </Box>
  );
};

export default Navbar;