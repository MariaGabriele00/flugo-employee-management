import React, { useRef } from "react";
import {
  TextField,
  FormControlLabel,
  Box,
  Typography,
  Switch,
  styled,
  Avatar,
  IconButton,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { Employee } from "../types/employee";

const StyledSwitch = styled(Switch)(() => ({
  width: 42,
  height: 22,
  padding: 0,
  display: "flex",
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(20px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "#2ecc71",
        border: 0,
      },
    },
  },
  "& .MuiSwitch-thumb": { width: 18, height: 18, boxShadow: "none" },
  "& .MuiSwitch-track": {
    borderRadius: 11,
    opacity: 1,
    backgroundColor: "#cfd8dc",
  },
}));

interface Props {
  data: Employee;
  onUpdate: (field: keyof Employee, value: any) => void;
  onUploadError: (message: string) => void;
  errors?: any;
}

const BasicInfoStep: React.FC<Props> = ({
  data,
  onUpdate,
  onUploadError,
  errors,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 800000) {
      onUploadError(
        "A imagem é muito grande! Selecione uma foto com menos de 800KB."
      );
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      onUpdate("avatar", reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 2,
          gap: 1,
        }}
      >
        <Box sx={{ position: "relative" }}>
          <Avatar
            src={data.avatar}
            sx={{
              width: 100,
              height: 100,
              border: "3px solid #e2e8f0",
              bgcolor: "#f8fafc",
              color: "#94a3b8",
            }}
          >
            {!data.avatar && data.name?.charAt(0).toUpperCase()}
          </Avatar>
          <IconButton
            onClick={() => fileInputRef.current?.click()}
            sx={{
              position: "absolute",
              bottom: 0,
              right: 0,
              bgcolor: "#2ecc71",
              color: "#fff",
              "&:hover": { bgcolor: "#27ae60" },
              width: 32,
              height: 32,
              border: "3px solid #fff",
            }}
          >
            <PhotoCameraIcon sx={{ fontSize: 16 }} />
          </IconButton>
          <input
            type="file"
            hidden
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
          />
        </Box>
        <Typography
          variant="caption"
          sx={{ color: "#94a3b8", fontWeight: 600 }}
        >
          {data.avatar ? "Alterar foto" : "Adicionar foto"}
        </Typography>
      </Box>

      <TextField
        label="Nome"
        fullWidth
        value={data.name}
        onChange={(e) => onUpdate("name", e.target.value)}
        error={!!errors?.name}
        helperText={errors?.name}
      />
      <TextField
        label="E-mail"
        fullWidth
        value={data.email}
        onChange={(e) => onUpdate("email", e.target.value)}
        error={!!errors?.email}
        helperText={errors?.email}
      />

      <Box sx={{ ml: 0.5 }}>
        <FormControlLabel
          sx={{ ml: -0.5, width: "fit-content" }}
          control={
            <StyledSwitch
              checked={data.active}
              onChange={(e) => onUpdate("active", e.target.checked)}
            />
          }
          label={
            <Typography
              variant="body2"
              sx={{ ml: 1, color: "#37474f", fontWeight: 500 }}
            >
              Ativo na criação
            </Typography>
          }
        />
      </Box>
    </Box>
  );
};

export default BasicInfoStep;
