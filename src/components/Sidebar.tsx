import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Button,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import ApartmentIcon from "@mui/icons-material/Apartment";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SystemGuide from "./system-guide";

const drawerWidth = 260;

const Sidebar: React.FC<{
  mobileOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
}> = ({ mobileOpen, onClose, isMobile }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [guiaOpen, setGuiaOpen] = useState(false);

  const menuItems = [
    {
      text: "Colaboradores",
      path: "/",
      icon: <PersonIcon sx={{ color: "#6d6d6dff", fontSize: 18 }} />,
    },
    {
      text: "Departamentos",
      path: "/departamentos",
      icon: <ApartmentIcon sx={{ color: "#6d6d6dff", fontSize: 18 }} />,
    },
  ];

  const content = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          p: "32px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <img src="/logo_flugo.png" alt="Logo" style={{ height: "30px" }} />
        {isMobile && (
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      <List sx={{ px: 2, flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => {
                navigate(item.path);
                if (isMobile) onClose();
              }}
              sx={{
                borderRadius: "8px",
                bgcolor:
                  location.pathname === item.path ? "#f8fafc" : "transparent",
                "&:hover": { bgcolor: "#f1f5f9" },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "8px",
                    bgcolor:
                      location.pathname === item.path ? "#ffffff" : "#f0f0f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border:
                      location.pathname === item.path
                        ? "1px solid #e2e8f0"
                        : "none",
                  }}
                >
                  {item.icon}
                </Box>
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                slotProps={{
                  primary: {
                    sx: {
                      fontWeight: location.pathname === item.path ? 700 : 500,
                      fontSize: "0.9rem",
                      color:
                        location.pathname === item.path ? "#2ecc71" : "#37474f",
                    },
                  },
                }}
              />
              <ChevronRightIcon
                sx={{
                  color:
                    location.pathname === item.path ? "#2ecc71" : "#aeb1b4ff",
                  fontSize: 18,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ p: 2, borderTop: "1px solid #f1f5f9" }}>
        <Button
          fullWidth
          variant="text"
          startIcon={<HelpOutlineIcon />}
          onClick={() => setGuiaOpen(true)}
          sx={{
            justifyContent: "center",
            color: "#64748b",
            fontWeight: 600,
            fontSize: "0.85rem",
            py: 1.5,
            px: 2,
            borderRadius: "8px",
            "&:hover": { bgcolor: "#f8fafc", color: "#2ecc71" },
          }}
        >
          Como usar
        </Button>
      </Box>

      <SystemGuide open={guiaOpen} onClose={() => setGuiaOpen(false)} />
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
    >
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : true}
        onClose={onClose}
        sx={{
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            borderRight: "1px solid #f1f5f9",
          },
        }}
      >
        {content}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
