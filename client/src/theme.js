// color design tokens export
export const tokensDark = {
  grey: {
    0: "#ffffff",
    10: "#f8fafc",
    50: "#f1f5f9",
    100: "#e2e8f0",
    200: "#cbd5e1",
    300: "#94a3b8",
    400: "#64748b",
    500: "#475569",
    600: "#334155",
    700: "#1e293b",
    800: "#0f172a", // Azul marinho profundo
    900: "#020617", // Quase preto
    1000: "#000000",
  },
  primary: {
    100: "#f5f3ff",
    200: "#ddd6fe",
    300: "#c4b5fd",
    400: "#a78bfa",
    500: "#8b5cf6", // Roxo vibrante (cor principal)
    600: "#7c3aed",
    700: "#6d28d9",
    800: "#5b21b6",
    900: "#4c1d95",
  },
  secondary: {
    100: "#fdf4ff",
    200: "#fae8ff",
    300: "#f5d0fe",
    400: "#f0abfc",
    500: "#e879f9",
    600: "#d946ef",
    700: "#c026d3",
    800: "#a21caf",
    900: "#86198f",
  }
};

// mui theme settings
export const themeSettings = (mode) => {
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            primary: {
              ...tokensDark.primary,
              main: tokensDark.primary[500],
              light: tokensDark.primary[400],
            },
            secondary: {
              ...tokensDark.secondary,
              main: tokensDark.secondary[500],
            },
            neutral: {
              ...tokensDark.grey,
              main: tokensDark.grey[300],
            },
            background: {
              default: tokensDark.grey[900], // Fundo principal grafite
              alt: tokensDark.grey[800],     // Cards e Sidebar azul-marinho escuro
            },
            text: {
              primary: tokensDark.grey[0],
              secondary: tokensDark.grey[300],
            }
          }
        : {
            primary: {
              ...tokensDark.primary,
              main: tokensDark.primary[600],
              light: tokensDark.primary[400],
            },
            secondary: {
              ...tokensDark.secondary,
              main: tokensDark.secondary[700],
            },
            neutral: {
              ...tokensDark.grey,
              main: tokensDark.grey[700],
            },
            background: {
              default: "#fcfcfd", // Branco "off-white" limpo
              alt: "#ffffff",     // Cards e Sidebar branco puro
            },
            text: {
              primary: tokensDark.grey[900],
              secondary: tokensDark.grey[600],
            }
          }),
    },
    typography: {
      fontFamily: ["Inter", "sans-serif"].join(","),
      fontSize: 12,
      h1: { fontSize: 40, fontWeight: 800 },
      h2: { fontSize: 32, fontWeight: 700 },
      h3: { fontSize: 24, fontWeight: 700 },
      h4: { fontSize: 20, fontWeight: 600 },
      h5: { fontSize: 16, fontWeight: 600 },
      h6: { fontSize: 14, fontWeight: 600 },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: 600,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '16px',
            boxShadow: mode === 'dark' 
              ? '0 10px 15px -3px rgba(0, 0, 0, 0.4)' 
              : '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
            backgroundImage: 'none', // Remove o degradê padrão do MUI dark mode
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiDataGrid: {
        styleOverrides: {
          root: {
            border: "none",
            borderRadius: "16px",
          },
          columnHeaders: {
            backgroundColor: mode === 'dark' ? tokensDark.grey[800] : tokensDark.grey[50],
            borderBottom: "none",
          },
          virtualScroller: {
            backgroundColor: mode === 'dark' ? tokensDark.grey[900] : tokensDark.grey[0],
          },
          footerContainer: {
            backgroundColor: mode === 'dark' ? tokensDark.grey[800] : tokensDark.grey[50],
            borderTop: "none",
          },
        }
      }
    },
  };
};