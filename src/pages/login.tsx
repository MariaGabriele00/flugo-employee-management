import React, { useState, useEffect } from "react";
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
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/auth-context";
import { loginSchema, LoginData } from "../schemas/auth";

const FloatingSphere = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== "size" && prop !== "coords" && prop !== "delay",
})<{ size: number; coords: any; delay?: string }>(
  ({ size, coords, delay }) => ({
    width: size,
    height: size,
    borderRadius: "50%",
    backgroundColor: "#2ecc71",
    opacity: 0.15,
    position: "absolute",
    ...coords,
    zIndex: 1,
    animation:
      "floatNF 6s ease-in-out infinite, pulseNF 4s ease-in-out infinite",
    animationDelay: delay || "0s",
    "@keyframes floatNF": {
      "0%, 100%": { transform: "translateY(0)" },
      "50%": { transform: "translateY(-15px)" },
    },
    "@keyframes pulseNF": {
      "0%, 100%": { transform: "scale(1)", opacity: 0.15 },
      "50%": { transform: "scale(1.1)", opacity: 0.2 },
    },
  })
);

const SnakeCardWrapper = styled(Box)({
  position: "relative",
  width: "100%",
  maxWidth: 400,
  padding: "2px",
  borderRadius: "20px",
  overflow: "hidden",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 10,
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
  borderRadius: "18px",
  padding: theme.spacing(4),
  zIndex: 2,
}));

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [firebaseError, setFirebaseError] = useState("");

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFirebaseError("");
    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const newErrors: any = {};
      result.error.issues.forEach((i) => (newErrors[i.path[0]] = i.message));
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      navigate("/");
    } catch (error: any) {
      setFirebaseError("E-mail ou senha incorretos.");
    } finally {
      setLoading(false);
    }
  };

  const spheres = [
    { size: 100, coords: { top: "30%", left: "15%" }, delay: "1s" },
    { size: 120, coords: { top: "25%", right: "15%" }, delay: "0.5s" },
    { size: 80, coords: { bottom: "20%", left: "40%" }, delay: "2.5s" },
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
              alt="Flugo"
              sx={{ width: 180, mb: 1 }}
            />
            <Typography variant="body2" color="#94a3b8" fontWeight={500}>
              Acesse o painel de gestão
            </Typography>
          </Box>
          {firebaseError && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {firebaseError}
            </Alert>
          )}
          <form onSubmit={handleLogin}>
            <TextField
              label="E-mail"
              fullWidth
              margin="normal"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              label="Senha"
              type={showPassword ? "text" : "password"}
              fullWidth
              margin="normal"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
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
              }}
            />
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
                borderRadius: "10px",
                "&:hover": { bgcolor: "#27ae60" },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Entrar"
              )}
            </Button>
            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Typography variant="body2" color="#64748b">
                Não tem uma conta?{" "}
                <MuiLink
                  component={Link}
                  to="/register"
                  sx={{
                    color: "#2ecc71",
                    fontWeight: "bold",
                    textDecoration: "none",
                  }}
                >
                  Cadastrar
                </MuiLink>
              </Typography>
            </Box>
          </form>
        </InnerCard>
      </SnakeCardWrapper>
    </Box>
  );
};

export default Login;
