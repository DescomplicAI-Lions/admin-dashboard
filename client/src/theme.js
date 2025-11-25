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
    100: "#f5f3ff", // Roxo muito claro - FUNDO PRINCIPAL
    200: "#c9bcff", // Roxo claro suave
    300: "#ddd6fe", // Roxo médio-claro
    400: "#c4b5fd", // Roxo intermediário
    500: "#8b5cf6", // Roxo principal - vibrante e elegante
    600: "#7c3aed", // Roxo intenso
    700: "#6d28d9", // Roxo profundo
    800: "#5b21b6", // Roxo escuro
    900: "#4c1d95", // Roxo muito escuro
  },
  secondary: {
    // Tons de roxo mais suaves para contraste
    100: "#2d1b69", // Lilás muito escuro
    200: "#f3e8ff", // Lilás claro
    300: "#2d1b69", // Lilás médio
    400: "#d8b4fe", // Lilás vibrante
    500: "#c084fc", // Lilás principal
    600: "#a855f7", // Lilás intenso
    700: "#9333ea", // Lilás profundo
    800: "#7e22ce", // Lilás escuro
    900: "#6b21a8", // Lilás muito escuro
  },
  accent: {
    // Tons de azul roxo para detalhes
    100: "#eef2ff", // Azul roxo muito claro
    200: "#e0e7ff", // Azul roxo claro
    300: "#c7d2fe", // Azul roxo médio
    400: "#a5b4fc", // Azul roxo
    500: "#818cf8", // Azul roxo principal
    600: "#6366f1", // Azul roxo intenso
    700: "#4f46e5", // Azul roxo profundo
    800: "#4338ca", // Azul roxo escuro
    900: "#3730a3", // Azul roxo muito escuro
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
              main: tokensDark.primary[500], // Roxo vibrante #8b5cf6
              light: tokensDark.primary[400], // Roxo mais claro
            },
            secondary: {
              ...tokensDark.secondary,
              main: tokensDark.secondary[500], // Lilás principal #c084fc
            },
            accent: {
              ...tokensDark.accent,
              main: tokensDark.accent[500], // Azul roxo #818cf8
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
              secondary: tokensDark.grey[200], // ✅ Texto cinza claro
            }
          }
        : {
            // TEMA CLARO: ROXO CLARO COM TEXTO ESCURO
            primary: {
              ...tokensDark.primary,
              main: tokensDark.primary[700], // Roxo escuro #6d28d9
              light: tokensDark.primary[600], // Roxo médio
            },
            secondary: {
              ...tokensDark.secondary,
              main: tokensDark.secondary[700], // Lilás escuro #9333ea
            },
            accent: {
              ...tokensDark.accent,
              main: tokensDark.accent[700], // Azul roxo escuro #4f46e5
            },
            neutral: {
              ...tokensDark.grey,
              main: tokensDark.grey[900],     // ✅ TEXTO PRETO
            },
            background: {
              default: tokensDark.primary[100], // Fundo roxo muito claro #f5f3ff
              alt: tokensDark.primary[200],     // Fundo roxo clarorgb(175, 157, 255)
            },
            text: {
              primary: tokensDark.grey[900],    // ✅ TEXTO PRETO PURO #020617
              secondary: tokensDark.grey[800],  // ✅ Texto cinza muito escuro #0f172a
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
        color: mode === 'dark' ? tokensDark.grey[0] : tokensDark.grey[900], // PRETO
      },
      h2: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 32,
        fontWeight: 600,
        color: mode === 'dark' ? tokensDark.grey[0] : tokensDark.grey[900], // PRETO
      },
      h3: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 24,
        fontWeight: 600,
        color: mode === 'dark' ? tokensDark.grey[0] : tokensDark.grey[900], // PRETO
      },
      h4: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 20,
        fontWeight: 500,
        color: mode === 'dark' ? tokensDark.grey[0] : tokensDark.grey[900], // PRETO
      },
      h5: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 16,
        fontWeight: 500,
        color: mode === 'dark' ? tokensDark.grey[0] : tokensDark.grey[900], // PRETO
      },
      h6: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 14,
        color: mode === 'dark' ? tokensDark.grey[0] : tokensDark.grey[900], // PRETO
      },
      body1: {
        fontSize: 14,
        fontWeight: 400,
        color: mode === 'dark' ? tokensDark.grey[0] : tokensDark.grey[800], // CINZA ESCURO
      },
      body2: {
        fontSize: 12,
        fontWeight: 400,
        color: mode === 'dark' ? tokensDark.grey[200] : tokensDark.grey[700], // CINZA MÉDIO
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600,
            color: mode === 'dark' ? tokensDark.grey[0] : tokensDark.grey[900], // ✅ TEXTO ESCURO
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            backgroundColor: mode === 'dark' ? tokensDark.grey[900] : tokensDark.primary[50],
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'dark' ? tokensDark.grey[900] : tokensDark.primary[50],
          color: mode === 'dark' ? tokensDark.grey[0] : tokensDark.grey[900], // ✅ TEXTO ESCURO
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'dark' ? tokensDark.grey[900] : tokensDark.primary[200],
            color: mode === 'dark' ? tokensDark.grey[0] : tokensDark.grey[900], // ✅ TEXTO ESCURO
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            color: mode === 'dark' ? tokensDark.grey[0] : tokensDark.grey[900], // ✅ FORÇA TEXTO PRETO
          },
        },
      },
      MuiListItemText: {
        styleOverrides: {
          primary: {
            color: mode === 'dark' ? tokensDark.grey[0] : tokensDark.grey[900], // ✅ TEXTO PRETO
          },
          secondary: {
            color: mode === 'dark' ? tokensDark.grey[200] : tokensDark.grey[700], // ✅ TEXTO CINZA
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${mode === 'dark' ? tokensDark.grey[800] : tokensDark.primary[200]}`,
            color: mode === 'dark' ? tokensDark.grey[0] : tokensDark.grey[900], // ✅ TEXTO PRETO
          },
          head: {
            fontWeight: 600,
            backgroundColor: mode === 'dark' ? tokensDark.primary[800] : tokensDark.primary[100],
            color: mode === 'dark' ? tokensDark.grey[0] : tokensDark.grey[900], // ✅ TEXTO PRETO
          },
        },
      },
      MuiTablePagination: {
        styleOverrides: {
          root: {
            color: mode === 'dark' ? tokensDark.grey[0] : tokensDark.grey[900], // ✅ TEXTO PRETO
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            color: mode === 'dark' ? tokensDark.grey[0] : tokensDark.grey[900], // ✅ TEXTO PRETO INPUTS
            '& .MuiInputBase-input': {
              color: mode === 'dark' ? tokensDark.grey[0] : tokensDark.grey[900], // ✅ TEXTO PRETO
            }
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            color: mode === 'dark' ? tokensDark.grey[0] : tokensDark.grey[900], // ✅ TEXTO PRETO
          },
        },
      },
    },
  };
};