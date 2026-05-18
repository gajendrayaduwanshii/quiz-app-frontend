import { createTheme } from "@mui/material/styles";

export const skillSyncTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#050816",
      paper: "rgba(255,255,255,0.05)",
    },
    primary: {
      main: "#7C3AED",
      light: "#A78BFA",
      dark: "#5B21B6",
    },
    secondary: {
      main: "#06B6D4",
      light: "#67E8F9",
      dark: "#0E7490",
    },
    success: { main: "#22C55E" },
    error: { main: "#EF4444" },
    warning: { main: "#F59E0B" },
    text: {
      primary: "#FFFFFF",
      secondary: "#94A3B8",
    },
    divider: "rgba(255,255,255,0.08)",
  },
  typography: {
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
    h1: { fontWeight: 800, letterSpacing: 0 },
    h2: { fontWeight: 800, letterSpacing: 0 },
    h3: { fontWeight: 750, letterSpacing: 0 },
    h4: { fontWeight: 750, letterSpacing: 0 },
    h5: { fontWeight: 700, letterSpacing: 0 },
    h6: { fontWeight: 700, letterSpacing: 0 },
    button: { textTransform: "none", fontWeight: 700 },
  },
  shape: {
    borderRadius: 18,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: "#050816",
          color: "#FFFFFF",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(18px)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.35)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          minHeight: 42,
        },
        containedPrimary: {
          background:
            "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)",
          boxShadow: "0 16px 36px rgba(124,58,237,0.28)",
          "&:hover": {
            background:
              "linear-gradient(135deg, #8B5CF6 0%, #22D3EE 100%)",
            boxShadow: "0 18px 44px rgba(6,182,212,0.34)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            background: "rgba(255,255,255,0.04)",
            borderRadius: 14,
            color: "#FFFFFF",
            "& fieldset": {
              borderColor: "rgba(255,255,255,0.10)",
            },
            "&:hover fieldset": {
              borderColor: "rgba(6,182,212,0.55)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#06B6D4",
              boxShadow: "0 0 0 3px rgba(6,182,212,0.14)",
            },
          },
          "& .MuiInputLabel-root": {
            color: "#94A3B8",
          },
        },
      },
    },
    MuiStepper: {
      styleOverrides: {
        root: {
          "& .MuiStepLabel-label": {
            color: "#94A3B8",
          },
          "& .Mui-active .MuiStepLabel-label, & .Mui-completed .MuiStepLabel-label":
            {
              color: "#FFFFFF",
            },
          "& .MuiStepIcon-root": {
            color: "rgba(255,255,255,0.16)",
          },
          "& .MuiStepIcon-root.Mui-active, & .MuiStepIcon-root.Mui-completed":
            {
              color: "#7C3AED",
              filter: "drop-shadow(0 0 10px rgba(124,58,237,0.55))",
            },
        },
      },
    },
  },
});
