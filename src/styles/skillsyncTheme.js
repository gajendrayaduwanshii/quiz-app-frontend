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
      "Inter, Geist, Satoshi, Outfit, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
    h1: { fontWeight: 900, letterSpacing: 0 },
    h2: { fontWeight: 900, letterSpacing: 0 },
    h3: { fontWeight: 850, letterSpacing: 0 },
    h4: { fontWeight: 850, letterSpacing: 0 },
    h5: { fontWeight: 800, letterSpacing: 0 },
    h6: { fontWeight: 800, letterSpacing: 0 },
    button: { textTransform: "none", fontWeight: 700 },
  },
  shape: {
    borderRadius: 18,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: "#030712",
          color: "#FFFFFF",
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255,255,255,0.08)",
          borderRadius: 14,
          "&::after": {
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          color: "#DDE7F3",
        },
        head: {
          color: "#94A3B8",
          fontWeight: 850,
          fontSize: 12,
          textTransform: "uppercase",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: "linear-gradient(145deg, rgba(255,255,255,0.075), rgba(255,255,255,0.030))",
          border: "1px solid rgba(148,163,184,0.15)",
          backdropFilter: "blur(18px)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.38)",
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
    MuiPopover: {
      styleOverrides: {
        paper: {
          background: "rgba(5,8,22,0.98)",
          backgroundImage: "none",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.55)",
          backdropFilter: "blur(18px)",
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          background: "rgba(5,8,22,0.98)",
          backgroundImage: "none",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.55)",
          backdropFilter: "blur(18px)",
        },
        list: {
          padding: 6,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          color: "#FFFFFF",
          "&:hover": {
            backgroundColor: "rgba(6,182,212,0.14)",
          },
          "&.Mui-selected": {
            backgroundColor: "rgba(124,58,237,0.22)",
          },
          "&.Mui-selected:hover": {
            backgroundColor: "rgba(124,58,237,0.30)",
          },
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          background: "rgba(5,8,22,0.98)",
          backgroundImage: "none",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.55)",
          backdropFilter: "blur(18px)",
          color: "#FFFFFF",
          overflow: "hidden",
        },
        listbox: {
          padding: 6,
          "& .MuiAutocomplete-option": {
            borderRadius: 10,
            color: "#FFFFFF",
            minHeight: 40,
          },
          "& .MuiAutocomplete-option[aria-selected='true']": {
            backgroundColor: "rgba(124,58,237,0.24)",
          },
          "& .MuiAutocomplete-option.Mui-focused": {
            backgroundColor: "rgba(6,182,212,0.16)",
          },
          "& .MuiAutocomplete-option[aria-selected='true'].Mui-focused": {
            backgroundColor: "rgba(124,58,237,0.32)",
          },
        },
        noOptions: {
          color: "#94A3B8",
          background: "rgba(5,8,22,0.98)",
        },
        loading: {
          color: "#94A3B8",
          background: "rgba(5,8,22,0.98)",
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
