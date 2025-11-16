// color design tokens export
export const tokensDark = {
  grey: {
    0: "#ffffff", // manually adjusted
    10: "#f6f6f6", // manually adjusted
    50: "#f0f0f0", // manually adjusted
    100: "#e0e0e0",
    200: "#c2c2c2",
    300: "#a3a3a3",
    400: "#858585",
    500: "#666666",
    600: "#525252",
    700: "#3d3d3d",
    800: "#292929",
    900: "#141414",
    1000: "#000000", // manually adjusted
  },
  primary: {
    // purple aesthetic - tons escuros e elegantes
    100: "#e1d6f5",
    200: "#c3adeb",
    300: "#a585e2",
    400: "#875cd8",
    500: "#6933ce", // Roxo principal - aesthetic
    600: "#5429a5",
    700: "#3f1f7c",
    800: "#2a1452",
    900: "#150a29",
  },
  secondary: {
    // lilás/lavanda - tons mais suaves
    50: "#f5f0ff", // manually adjusted
    100: "#e8e0ff",
    200: "#d1c1ff",
    300: "#baa2ff",
    400: "#a383ff",
    500: "#8c64ff", // Lilás principal
    600: "#7050cc",
    700: "#543c99",
    800: "#382866",
    900: "#1c1433",
  },
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
            // palette values for dark mode - TEMA ROXO AESTHETIC
            primary: {
              ...tokensDark.primary,
              main: tokensDark.primary[500], // Roxo principal #6933ce
              light: tokensDark.primary[400], // Roxo mais claro
            },
            secondary: {
              ...tokensDark.secondary,
              main: tokensDark.secondary[500], // Lilás #8c64ff
            },
            neutral: {
              ...tokensDark.grey,
              main: tokensDark.grey[500],
            },
            background: {
              default: tokensDark.primary[800], // Roxo escuro #2a1452
              alt: tokensDark.primary[700],     // Roxo médio-escuro #3f1f7c
            },
          }
        : {
            // palette values for light mode
            primary: {
              ...tokensLight.primary,
              main: tokensDark.grey[50],
              light: tokensDark.grey[100],
            },
            secondary: {
              ...tokensLight.secondary,
              main: tokensDark.secondary[600],
              light: tokensDark.secondary[700],
            },
            neutral: {
              ...tokensLight.grey,
              main: tokensDark.grey[500],
            },
            background: {
              default: tokensDark.grey[0],
              alt: tokensDark.grey[50],
            },
          }),
    },
    typography: {
      fontFamily: ["Inter", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};