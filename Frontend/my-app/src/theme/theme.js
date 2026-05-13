import { createTheme } from "@mui/material/styles";

// ======================================================
// COLORS
// ======================================================

const COLORS = {
  primary: "#8B5CF6",

  secondary: "#06B6D4",

  success: "#22C55E",

  warning: "#F59E0B",

  error: "#EF4444",

  background: "#020617",

  paper: "#0F172A",

  card: "rgba(15,23,42,0.72)",

  border: "rgba(255,255,255,0.06)",

  textPrimary: "#FFFFFF",

  textSecondary: "#94A3B8",
};

// ======================================================
// THEME
// ======================================================

const theme = createTheme({
  palette: {
    mode: "dark",

    primary: {
      main: COLORS.primary,
    },

    secondary: {
      main: COLORS.secondary,
    },

    success: {
      main: COLORS.success,
    },

    warning: {
      main: COLORS.warning,
    },

    error: {
      main: COLORS.error,
    },

    background: {
      default:
        COLORS.background,

      paper: COLORS.paper,
    },

    text: {
      primary:
        COLORS.textPrimary,

      secondary:
        COLORS.textSecondary,
    },
  },

  // ======================================================
  // TYPOGRAPHY
  // ======================================================

  typography: {
    fontFamily:
      "'Inter', sans-serif",

    h1: {
      fontWeight: 800,
    },

    h2: {
      fontWeight: 700,
    },

    h3: {
      fontWeight: 700,
    },

    h4: {
      fontWeight: 700,
    },

    h5: {
      fontWeight: 600,
    },

    h6: {
      fontWeight: 600,
    },

    button: {
      textTransform: "none",

      fontWeight: 600,
    },
  },

  // ======================================================
  // SHAPE
  // ======================================================

  shape: {
    borderRadius: 22,
  },

  // ======================================================
  // BREAKPOINTS
  // ======================================================

  breakpoints: {
    values: {
      xs: 0,

      sm: 600,

      md: 900,

      lg: 1200,

      xl: 1536,
    },
  },

  // ======================================================
  // SHADOWS
  // ======================================================

  shadows: [
    "none",

    "0 2px 8px rgba(0,0,0,0.08)",

    "0 4px 12px rgba(0,0,0,0.10)",

    "0 8px 20px rgba(0,0,0,0.12)",

    "0 10px 24px rgba(0,0,0,0.14)",

    "0 14px 32px rgba(0,0,0,0.16)",

    "0 18px 40px rgba(0,0,0,0.18)",

    ...Array(18).fill(
      "0 18px 40px rgba(0,0,0,0.18)"
    ),
  ],

  // ======================================================
  // COMPONENTS
  // ======================================================

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,

          padding: 0,

          background:
            COLORS.background,

          overflow: "hidden",

          fontFamily:
            "'Inter', sans-serif",

          WebkitFontSmoothing:
            "antialiased",

          MozOsxFontSmoothing:
            "grayscale",
        },

        "*": {
          boxSizing:
            "border-box",
        },

        "*::-webkit-scrollbar": {
          width: "6px",

          height: "6px",
        },

        "*::-webkit-scrollbar-thumb":
          {
            background:
              "rgba(255,255,255,0.10)",

            borderRadius:
              "20px",
          },

        "*::-webkit-scrollbar-track":
          {
            background:
              "transparent",
          },
      },
    },

    // ======================================================
    // PAPER
    // ======================================================

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage:
            "none",

          border:
            `1px solid ${COLORS.border}`,
        },
      },
    },

    // ======================================================
    // BUTTON
    // ======================================================

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 16,

          fontWeight: 600,
        },
      },
    },

    // ======================================================
    // ICON BUTTON
    // ======================================================

    MuiIconButton: {
      styleOverrides: {
        root: {
          transition:
            "all 0.25s ease",

          "&:hover": {
            transform:
              "translateY(-1px)",
          },
        },
      },
    },

    // ======================================================
    // INPUT
    // ======================================================

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 16,

          background:
            "rgba(255,255,255,0.03)",

          "& fieldset": {
            borderColor:
              COLORS.border,
          },

          "&:hover fieldset": {
            borderColor:
              "rgba(255,255,255,0.16)",
          },

          "&.Mui-focused fieldset":
            {
              borderColor:
                COLORS.primary,
            },
        },
      },
    },
  },
});

export default theme;