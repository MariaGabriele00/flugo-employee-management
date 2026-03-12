import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: { main: "#2ecc71", contrastText: "#ffffff" },
    background: { default: "#ffffff", paper: "#ffffff" },
    text: { primary: "#37474f", secondary: "#94a3b8" },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: "bold",
          padding: "10px 24px",
          boxShadow: "none",
          "&:hover": { boxShadow: "none" },
        },
      },
    },
  },
});
