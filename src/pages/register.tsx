import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Link as MuiLink,
  styled,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigate, Link } from "react-router-dom";
import { registerSchema, RegisterData } from "../schemas/auth";

const FloatingSphere = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== "size" && prop !== "coords" && prop !== "delay",
})<{
  size: number;
  coords: { top?: string; left?: string; right?: string; bottom?: string };
  delay?: string;
}>(({ size, coords, delay }) => ({
  width: size,
  height: size,
  borderRadius: "50%",
  backgroundColor: "#2ecc71",
  opacity: 0.15,
  position: "absolute",
  ...coords,
  zIndex: 1,
  animation:
    "floatNotFound 6s ease-in-out infinite, pulseNotFound 4s ease-in-out infinite",
  animationDelay: delay || "0s",
  "@keyframes floatNotFound": {
    "0%": { transform: "translateY(0px)" },
    "50%": { transform: "translateY(-15px)" },
    "100%": { transform: "translateY(0px)" },
  },
  "@keyframes pulseNotFound": {
    "0%": { transform: "scale(1)", opacity: 0.15 },
    "50%": { transform: "scale(1.1)", opacity: 0.2 },
    "100%": { transform: "scale(1)", opacity: 0.15 },
  },
}));

const SnakeCardWrapper = styled(Box)({
  position: "relative",
  width: "100%",
  maxWidth: 460,
  padding: "2px",
  borderRadius: "22px",
  overflow: "hidden",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 10,
  boxShadow: "0 20px 40px rgba(0,0,0,0.05)",
  "&::before": {
    content: '""',
    position: "absolute",
    width: "200%",
    height: "200%",
    background:
      "conic-gradient(transparent, transparent, #2ecc71, transparent)",
    animation: "rotateSnake 8s linear infinite",
  },
  "@keyframes rotateSnake": {
    "0%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(360deg)" },
  },
});

const InnerCard = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
  backgroundColor: "#ffffff",
  borderRadius: "20px",
  padding: theme.spacing(3),
  zIndex: 2,
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(5),
  },
}));

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<RegisterData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [firebaseError, setFirebaseError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setFirebaseError("");
    const result = registerSchema.safeParse(formData);
    if (!result.success) {
      const newErrors: any = {};
      result.error.issues.forEach((i) => (newErrors[i.path[0]] = i.message));
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      await updateProfile(userCredential.user, { displayName: formData.name });
      navigate("/");
    } catch (error: any) {
      setFirebaseError(
        error.code === "auth/email-already-in-use"
          ? "Este e-mail já está em uso."
          : "Erro ao criar conta."
      );
    } finally {
      setLoading(false);
    }
  };

  const spheres = [
    { size: 120, coords: { top: "5%", right: "5%" }, delay: "0s" },
    { size: 80, coords: { bottom: "15%", left: "8%" }, delay: "2s" },
    { size: 150, coords: { top: "15%", left: "10%" }, delay: "1s" },
    { size: 60, coords: { bottom: "10%", right: "15%" }, delay: "3s" },
    { size: 100, coords: { top: "40%", right: "20%" }, delay: "4s" },
    { size: 70, coords: { bottom: "30%", left: "20%" }, delay: "6s" },
    { size: 130, coords: { top: "60%", left: "5%" }, delay: "2.5s" },
    { size: 40, coords: { top: "10%", left: "45%" }, delay: "7s" },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f4f7f6",
        position: "relative",
        overflow: "hidden",
        p: 2,
      }}
    >
      {spheres.map((s, i) => (
        <FloatingSphere
          key={i}
          size={s.size}
          coords={s.coords}
          delay={s.delay}
        />
      ))}

      <SnakeCardWrapper>
        <InnerCard>
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Box
              component="img"
              src="/logo_flugo.png"
              alt="Flugo Logo"
              sx={{ width: { xs: 120, sm: 150 }, height: "auto", mb: 1 }}
            />
            <Typography variant="body2" color="#94a3b8" fontWeight={500}>
              Crie sua conta administrativa
            </Typography>
          </Box>

          {firebaseError && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {firebaseError}
            </Alert>
          )}

          <form onSubmit={handleRegister}>
            <TextField
              label="Nome Completo"
              fullWidth
              margin="dense"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              error={!!errors.name}
              helperText={errors.name}
            />
            <TextField
              label="E-mail"
              fullWidth
              margin="dense"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              error={!!errors.email}
              helperText={errors.email}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: { xs: 1, sm: 2 },
                mt: 1,
              }}
            >
              <TextField
                label="Senha"
                type={showPassword ? "text" : "password"}
                fullWidth
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                error={!!errors.password}
                helperText={errors.password}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                label="Confirmar"
                type={showConfirmPassword ? "text" : "password"}
                fullWidth
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          edge="end"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                mt: 4,
                py: 1.6,
                bgcolor: "#2ecc71",
                fontWeight: "bold",
                textTransform: "none",
                fontSize: "1rem",
                borderRadius: "10px",
                "&:hover": { bgcolor: "#27ae60" },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Criar Conta"
              )}
            </Button>
            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Typography variant="body2" color="#64748b">
                Já tem uma conta?{" "}
                <MuiLink
                  component={Link}
                  to="/login"
                  sx={{
                    color: "#2ecc71",
                    fontWeight: "bold",
                    textDecoration: "none",
                  }}
                >
                  Entrar
                </MuiLink>
              </Typography>
            </Box>
          </form>
        </InnerCard>
      </SnakeCardWrapper>
    </Box>
  );
};

export default Register;
