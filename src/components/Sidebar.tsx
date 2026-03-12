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
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              navigate("/");
              if (isMobile) onClose();
            }}
            sx={{
              borderRadius: "8px",
              bgcolor: location.pathname === "/" ? "#f8fafc" : "transparent",
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "8px",
                  bgcolor: "#f0f0f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <PersonIcon sx={{ color: "#6d6d6dff", fontSize: 18 }} />
              </Box>
            </ListItemIcon>
            <ListItemText
              primary="Colaboradores"
              slotProps={{
                primary: { sx: { fontWeight: 500, fontSize: "0.9rem" } },
              }}
            />
            <ChevronRightIcon sx={{ color: "#aeb1b4ff", fontSize: 18 }} />
          </ListItemButton>
        </ListItem>
      </List>

      <Box sx={{ p: 2, borderTop: "1px solid #f1f5f9" }}>
        <Button
          fullWidth
          variant="text"
          startIcon={<HelpOutlineIcon />}
          onClick={() => setGuiaOpen(true)}
          sx={{
            justifyContent: "flex-center",
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
