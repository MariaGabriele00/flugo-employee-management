import React, { useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Avatar,
  IconButton,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
  ListItemIcon,
  Typography,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/auth-context";
import { auth } from "../services/firebase";
import { signOut } from "firebase/auth";
import Sidebar from "./Sidebar";

export const Layout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, userMetadata } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const handleProfile = () => {
    handleMenuClose();
    navigate("/perfil");
  };

  const displayName =
    userMetadata?.displayName || user?.displayName || "Utilizador";
  const photoURL = userMetadata?.photoURL || user?.photoURL || "";

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#ffffff" }}>
      <Sidebar
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <AppBar
          position="sticky"
          elevation={0}
          sx={{ bgcolor: "#ffffff", borderBottom: "none", pt: 1 }}
        >
          <Toolbar
            sx={{ justifyContent: "space-between", px: { xs: 2, md: 4 } }}
          >
            {isMobile && (
              <IconButton
                onClick={() => setMobileOpen(true)}
                sx={{ color: "#37474f" }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Box sx={{ flexGrow: 1 }} />

            <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
              <Avatar
                src={photoURL}
                sx={{
                  width: 45,
                  height: 45,
                  border: "2px solid #2ecc71",
                  bgcolor: "#e8f5e9",
                  color: "#2ecc71",
                  fontWeight: "bold",
                }}
              >
                {!photoURL && displayName.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  borderRadius: "12px",
                  minWidth: 200,
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 700, color: "#1e293b" }}
                >
                  {displayName}
                </Typography>
                <Typography variant="caption" sx={{ color: "#64748b" }}>
                  {user?.email}
                </Typography>
              </Box>
              <Divider />
              <MenuItem
                onClick={handleProfile}
                sx={{ fontSize: "0.875rem", py: 1 }}
              >
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                Meu Perfil
              </MenuItem>
              <MenuItem
                onClick={handleLogout}
                sx={{ fontSize: "0.875rem", py: 1, color: "#ef4444" }}
              >
                <ListItemIcon>
                  <LogoutIcon fontSize="small" sx={{ color: "#ef4444" }} />
                </ListItemIcon>
                Sair do Sistema
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        <Box
          component="main"
          sx={{ p: { xs: 2, md: 4 }, width: "100%", maxWidth: "1600px" }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};
