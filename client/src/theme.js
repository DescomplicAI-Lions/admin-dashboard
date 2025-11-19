// color design tokens export
export const tokensDark = {
  grey: {
    0: "#ffffff", // manually adjusted - TEXTO CLARO
    10: "#f8fafc", // manually adjusted
    50: "#f1f5f9", // manually adjusted
    100: "#e2e8f0",
    200: "#cbd5e1",
    300: "#94a3b8",
    400: "#64748b",
    500: "#475569",
    600: "#334155",
    700: "#1e293b",
    800: "#0f172a",
    900: "#020617",
    1000: "#000000", // manually adjusted
  },
  primary: {
    // Roxo rico, escuro e sofisticado
    100: "#2d1b69",
    200: "#3d248c",
    300: "#4d2caf",
    400: "#5d35d2",
    500: "#6d3df5", // Roxo principal - rico e vibrante
    600: "#7c4df8",
    700: "#8b5dfa",
    800: "#9a6dfb",
    900: "#a97dfc",
  },
  secondary: {
    // Tons de roxo mais suaves para contraste
    50: "#1a1033",
    100: "#2a1a4d",
    200: "#3a2466",
    300: "#4a2e80",
    400: "#5a3899",
    500: "#6a42b3", // Roxo secundário
    600: "#7a52c0",
    700: "#8a62cd",
    800: "#9a72da",
    900: "#aa82e7",
  },
  accent: {
    // Tons de roxo claro para detalhes
    100: "#8b5cf6",
    200: "#9d6ef8",
    300: "#af80fa",
    400: "#c192fb",
    500: "#d3a4fd", // Destaque
    600: "#e5b6fe",
    700: "#f7c8ff",
    800: "#ffdafe",
    900: "#ffecff",
  }
};

// function that reverses the color palette
function reverseTokens(tokensDark) {
  const reversedTokens = {};
  Object.entries(tokensDark).forEach(([key, val]) => {
    const keys = Object.keys(val);
    const values = Object.values(val);
    const length = keys.length;
    const reversedObj = {};
    for (let i = 0; i < length; i++) {
      reversedObj[keys[i]] = values[length - i - 1];
    }
    reversedTokens[key] = reversedObj;
  });
  return reversedTokens;
}
export const tokensLight = reverseTokens(tokensDark);

// mui theme settings
export const themeSettings = (mode) => {
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            // TEMA ESCURO: PRETO PROFUNDO COM ROXO VIBRANTE
            primary: {
              ...tokensDark.primary,
              main: tokensDark.primary[500], // Roxo rico #6d3df5
              light: tokensDark.primary[600], // Roxo mais claro
            },
            secondary: {
              ...tokensDark.secondary,
              main: tokensDark.secondary[500], // Roxo secundário #6a42b3
            },
            accent: {
              ...tokensDark.accent,
              main: tokensDark.accent[500], // Destaque #d3a4fd
            },
            neutral: {
              ...tokensDark.grey,
              main: tokensDark.grey[0], // ✅ TEXTO BRANCO PURO
            },
            background: {
              default: tokensDark.grey[1000], // PRETO ABSOLUTO #000000
              alt: tokensDark.grey[900],      // Preto profundo #020617
            },
            text: {
              primary: tokensDark.grey[0],    // ✅ TEXTO BRANCO PURO
              secondary: tokensDark.grey[100], // ✅ Texto cinza claro
            }
          }
        : {
            // TEMA CLARO: ROXO ESCURO E SOFISTICADO
            primary: {
              ...tokensDark.primary,
              main: tokensDark.primary[500], // Roxo principal #6d3df5
              light: tokensDark.primary[400], // Roxo médio
            },
            secondary: {
              ...tokensDark.secondary,
              main: tokensDark.secondary[400], // Roxo secundário #5a3899
            },
            accent: {
              ...tokensDark.accent,
              main: tokensDark.accent[300], // Destaque suave #af80fa
            },
            neutral: {
              ...tokensDark.grey,
              main: tokensDark.grey[0],     // ✅ TEXTO BRANCO PURO
            },
            background: {
              default: tokensDark.primary[100], // Fundo roxo escuro #2d1b69
              alt: tokensDark.primary[200],     // Roxo médio-escuro #3d248c
            },
            text: {
              primary: tokensDark.grey[0],    // ✅ TEXTO BRANCO PURO
              secondary: tokensDark.grey[100], // ✅ Texto cinza claro
            }
          }),
    },
    typography: {
      fontFamily: ["Inter", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 40,
        fontWeight: 700,
      },
      h2: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 32,
        fontWeight: 600,
      },
      h3: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 24,
        fontWeight: 600,
      },
      h4: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 20,
        fontWeight: 500,
      },
      h5: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 16,
        fontWeight: 500,
      },
      h6: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 14,
      },
      body1: {
        fontSize: 14,
        fontWeight: 400,
      },
      body2: {
        fontSize: 12,
        fontWeight: 400,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            backgroundColor: mode === 'dark' ? tokensDark.grey[900] : tokensDark.primary[200],
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'dark' ? tokensDark.grey[900] : tokensDark.primary[200],
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            color: 'inherit',
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${mode === 'dark' ? tokensDark.grey[800] : tokensDark.primary[300]}`,
            color: tokensDark.grey[0], // ✅ Texto branco nas tabelas
          },
          head: {
            fontWeight: 600,
            backgroundColor: mode === 'dark' ? tokensDark.primary[800] : tokensDark.primary[300],
            color: tokensDark.grey[0], // ✅ Texto branco no cabeçalho
          },
        },
      },
      MuiTablePagination: {
        styleOverrides: {
          root: {
            color: tokensDark.grey[0], // ✅ Texto branco na paginação
          },
        },
      },
    },
  };
};