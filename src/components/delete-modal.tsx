import React from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  Zoom,
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

const DeleteModal: React.FC<Props> = ({
  open,
  onClose,
  onConfirm,
  loading,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      slots={{
        transition: Zoom,
      }}
      slotProps={{
        paper: {
          sx: {
            borderRadius: 4,
            p: 1,
            maxWidth: 400,
            textAlign: "center",
          },
        },
      }}
    >
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: 70,
              height: 70,
              bgcolor: "#fff1f2",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 1,
            }}
          >
            <WarningAmberIcon sx={{ fontSize: 40, color: "#ef4444" }} />
          </Box>

          <Typography variant="h5" fontWeight="800" color="#1e293b">
            Excluir Colaborador?
          </Typography>

          <Typography variant="body2" color="#64748b" sx={{ px: 2 }}>
            Esta ação é permanente e não poderá ser desfeita. O colaborador será
            removido da base de dados.
          </Typography>

          <Box sx={{ display: "flex", gap: 2, width: "100%", mt: 3 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={onClose}
              sx={{
                borderColor: "#e2e8f0",
                color: "#64748b",
                "&:hover": { borderColor: "#cbd5e1", bgcolor: "#f8fafc" },
              }}
            >
              Cancelar
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={onConfirm}
              disabled={loading}
              sx={{
                bgcolor: "#ef4444",
                "&:hover": { bgcolor: "#dc2626" },
                fontWeight: "bold",
              }}
            >
              {loading ? "Excluindo..." : "Sim, Excluir"}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModal;
