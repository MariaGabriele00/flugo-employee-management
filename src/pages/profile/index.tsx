import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
  Paper,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { useAuth } from "../../contexts/auth-context";
import { updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../services/firebase";

const Profile: React.FC = () => {
  const { user, userMetadata } = useAuth();
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({
    type: "success" as "success" | "error",
    text: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (userMetadata) {
      setName(userMetadata.displayName || user?.displayName || "");
      setAvatar(userMetadata.photoURL || user?.photoURL || "");
    }
  }, [userMetadata, user]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 800 * 1024) {
        setMessage({
          type: "error",
          text: "A imagem deve ter menos de 800KB para ser guardada no banco de dados.",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    setMessage({ type: "success", text: "" });
    try {
      await updateProfile(user, { displayName: name });
      await setDoc(
        doc(db, "users_metadata", user.uid),
        {
          photoURL: avatar,
          displayName: name,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      setMessage({ type: "success", text: "Perfil atualizado com sucesso!" });
    } catch (error) {
      setMessage({
        type: "error",
        text: "Erro ao atualizar os dados no servidor.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 0 } }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 800,
          color: "#1e293b",
          mb: 4,
          fontSize: { xs: "1.75rem", md: "2.125rem" },
        }}
      >
        Meu Perfil
      </Typography>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 4 },
          borderRadius: "16px",
          border: "1px solid #f1f5f9",
          maxWidth: 800,
        }}
      >
        {message.text && (
          <Alert
            severity={message.type}
            sx={{ mb: 3, borderRadius: "8px", fontWeight: 600 }}
          >
            {message.text}
          </Alert>
        )}
        <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
          <Grid
            size={{ xs: 12, md: 4 }}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box sx={{ position: "relative" }}>
              <Avatar
                src={avatar}
                sx={{
                  width: { xs: 120, md: 150 },
                  height: { xs: 120, md: 150 },
                  border: "4px solid #e2e8f0",
                }}
              >
                {!avatar && name.charAt(0).toUpperCase()}
              </Avatar>
              <IconButton
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  position: "absolute",
                  bottom: 5,
                  right: 5,
                  bgcolor: "#2ecc71",
                  color: "#fff",
                  "&:hover": { bgcolor: "#27ae60" },
                  border: "3px solid #fff",
                }}
              >
                <PhotoCameraIcon />
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
              sx={{
                mt: 2,
                color: "#64748b",
                textAlign: "center",
                display: "block",
              }}
            >
              Tamanho máximo: 800KB
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <TextField
                label="Nome de Exibição"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                label="E-mail"
                fullWidth
                disabled
                value={user?.email || ""}
              />
              <Button
                variant="contained"
                fullWidth
                onClick={handleSave}
                disabled={loading}
                sx={{
                  bgcolor: "#2ecc71",
                  py: 1.5,
                  fontWeight: "bold",
                  borderRadius: "10px",
                  "&:hover": { bgcolor: "#27ae60" },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Guardar Alterações"
                )}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Profile;
