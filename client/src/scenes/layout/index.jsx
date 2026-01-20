import React, { useState } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "components/Navbar";
import Sidebar from "components/Sidebar";
import { useGetUserQuery } from "state/api";

const Layout = () => {
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Pegando o ID do usuário do estado global
  const userId = useSelector((state) => state.global.userId);
  
  // Hook da API para buscar dados do usuário (RTK Query)
  const { data } = useGetUserQuery(userId);

  return (
    <Box 
      display={isNonMobile ? "flex" : "block"} 
      width="100%" 
      height="100%"
      sx={{ backgroundColor: theme.palette.background.default }}
    >
      {/* SIDEBAR: Passando os dados do usuário vindos da API */}
      <Sidebar
        user={data || {}}
        isNonMobile={isNonMobile}
        drawerWidth="280px" // Aumentei levemente para dar mais respiro aos itens
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* ÁREA PRINCIPAL DO CONTEÚDO */}
      <Box 
        flexGrow={1} 
        sx={{ 
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflowX: "hidden", // Evita scrolls horizontais indesejados
        }}
      >
        <Navbar
          user={data || {}}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        
        {/* CONTAINER DO CONTEÚDO (DASHBOARD, PRODUTOS, ETC) */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: isNonMobile ? "0.5rem 1rem" : "1rem", // Menos padding no topo para alinhar com a Navbar
            backgroundColor: theme.palette.background.default,
          }}
        >
          {/* O Outlet renderiza as sub-rotas */}
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;