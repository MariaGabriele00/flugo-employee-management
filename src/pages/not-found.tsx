import React, { useEffect } from "react";
import { Box, Typography, Button, Container, styled } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";

interface SphereCoords {
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
}

interface FloatingSphereProps {
  size: number;
  coords: SphereCoords;
  delay?: string;
}

const FloatingSphere = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== "coords" && prop !== "size" && prop !== "delay",
})<FloatingSphereProps>(({ size, coords, delay }) => ({
  width: size,
  height: size,
  borderRadius: "50%",
  backgroundColor: "#2ecc71",
  opacity: 0.12,
  position: "absolute",
  ...coords,
  zIndex: 1,
  animation: "floatSpheres 8s ease-in-out infinite",
  animationDelay: delay || "0s",
  "@keyframes floatSpheres": {
    "0%, 100%": { transform: "translateY(0) translateX(0)" },
    "33%": { transform: "translateY(-20px) translateX(10px)" },
    "66%": { transform: "translateY(10px) translateX(-10px)" },
  },
}));

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.error("[SYSTEM_ERROR]: 404 ->", location.pathname);
  }, [location.pathname]);

  const spheres = [
    { size: 140, coords: { top: "15%", left: "10%" }, delay: "0s" },
    { size: 60, coords: { top: "60%", left: "20%" }, delay: "2s" },
    { size: 180, coords: { top: "10%", right: "10%" }, delay: "1s" },
    { size: 90, coords: { bottom: "15%", left: "35%" }, delay: "4s" },
    { size: 70, coords: { top: "75%", right: "15%" }, delay: "3s" },
    { size: 110, coords: { top: "5%", left: "45%" }, delay: "5s" },
  ];

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        bgcolor: "#ffffff",
        display: "flex",
        alignItems: "center",
      }}
    >
      {spheres.map((sphere, index) => (
        <FloatingSphere
          key={index}
          size={sphere.size}
          coords={sphere.coords}
          delay={sphere.delay}
        />
      ))}

      <Container maxWidth="md" sx={{ position: "relative", zIndex: 10 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h1"
              sx={{
                fontWeight: 950,
                color: "#2ecc71",
                fontSize: { xs: "10rem", md: "15rem" },
                lineHeight: 0.8,
                letterSpacing: "-8px",
                userSelect: "none",
                display: "inline-block",
                filter: "drop-shadow(0px 10px 20px rgba(46, 204, 113, 0.2))",
                animation: "floatText 4s ease-in-out infinite",
                "@keyframes floatText": {
                  "0%, 100%": { transform: "translateY(0)" },
                  "50%": { transform: "translateY(-30px)" },
                },
              }}
            >
              404
            </Typography>
            <Box
              sx={{
                height: 6,
                width: 120,
                bgcolor: "#2ecc71",
                mx: "auto",
                borderRadius: 3,
                mt: 2,
                opacity: 0.8,
              }}
            />
          </Box>

          <Typography
            variant="h3"
            sx={{
              color: "#1e293b",
              mb: 2,
              fontWeight: 800,
              fontSize: { xs: "2rem", md: "3rem" },
            }}
          >
            Página não encontrada
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "#64748b",
              mb: 6,
              maxWidth: 500,
              fontSize: "1.25rem",
              lineHeight: 1.6,
            }}
          >
            A página que você está procurando não existe ou foi movida para
            outro endereço.
          </Typography>

          <Button
            variant="contained"
            onClick={() => navigate("/")}
            sx={{
              bgcolor: "#2ecc71",
              color: "white",
              px: 6,
              py: 2,
              borderRadius: "50px",
              fontWeight: "bold",
              textTransform: "none",
              fontSize: "1.2rem",
              boxShadow: "0 15px 30px rgba(46, 204, 113, 0.4)",
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor: "#27ae60",
                transform: "translateY(-3px)",
                boxShadow: "0 20px 40px rgba(46, 204, 113, 0.5)",
              },
            }}
          >
            <HomeIcon sx={{ mr: 1.5 }} />
            Voltar ao Início
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default NotFound;
