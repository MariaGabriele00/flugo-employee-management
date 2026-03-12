import React from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  Zoom,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface Props {
  open: boolean;
  onClose: () => void;
  isEdit?: boolean;
}

const SuccessModal: React.FC<Props> = ({ open, onClose, isEdit }) => {
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
            p: 2,
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
          <CheckCircleIcon sx={{ fontSize: 80, color: "#2ecc71" }} />
          <Typography variant="h5" fontWeight="bold" color="#37474f">
            Sucesso!
          </Typography>
          <Typography variant="body1" color="#90a4ae">
            {isEdit
              ? "O colaborador foi editado corretamente no sistema."
              : "O colaborador foi cadastrado corretamente no sistema."}
          </Typography>
          <Button
            variant="contained"
            fullWidth
            onClick={onClose}
            sx={{
              mt: 2,
              bgcolor: "#2ecc71",
              color: "#ffffff",
              "&:hover": { bgcolor: "#27ae60" },
              py: 1.5,
              fontSize: "1rem",
            }}
          >
            Ótimo
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessModal;
