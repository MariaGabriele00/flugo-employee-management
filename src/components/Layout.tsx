import React, { useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Avatar,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "./Sidebar";

export const Layout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

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
          sx={{
            bgcolor: "#ffffff",
            borderBottom: "none",
            pt: 1,
          }}
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
            <Avatar
              src="/avatar.jpg"
              sx={{
                width: 45,
                height: 45,
                border: "2px solid #e7e7e7ff",
                cursor: "pointer",
              }}
            />
          </Toolbar>
        </AppBar>

        <Box
          component="main"
          sx={{
            p: { xs: 2, md: 4 },
            width: "100%",
            maxWidth: "1600px",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};
