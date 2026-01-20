import { Typography, Box, useTheme } from "@mui/material";
import React from "react";

const Header = ({ title, subtitle }) => {
  const theme = useTheme();
  return (
    <Box mb="30px">
      <Box 
        display="flex" 
        alignItems="center" 
        gap="12px"
        mb="5px"
      >
        {/* Detalhe de design: uma barra vertical pequena na cor principal */}
        <Box 
          sx={{ 
            width: "4px", 
            height: "24px", 
            backgroundColor: theme.palette.primary.main, 
            borderRadius: "2px" 
          }} 
        />
        
        <Typography
          variant="h2"
          color={theme.palette.text.primary} // Usando a cor de texto definida no seu novo tema
          fontWeight="800"
          sx={{ 
            letterSpacing: "-0.5px",
            textTransform: "uppercase",
            fontSize: "1.75rem"
          }}
        >
          {title}
        </Typography>
      </Box>

      <Typography 
        variant="h5" 
        color={theme.palette.primary[500]} // O subtítulo agora puxa levemente para a cor do tema
        sx={{ 
          ml: "16px", // Alinha com o início do texto do título (após a barrinha)
          fontWeight: "500",
          opacity: 0.8
        }}
      >
        {subtitle}
      </Typography>
    </Box>
  );
};

export default Header;