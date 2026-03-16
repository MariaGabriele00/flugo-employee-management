import React from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  LinearProgress,
  Grid,
  StepIconProps,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Employee } from "../types/employee";
import BasicInfoStep from "./basic-info-step";
import ProfessionalInfoStep from "./professional-info-step";
import { useFormDependencies } from "../hooks/use-form-dependencies";

interface Props {
  activeStep: number;
  formData: Employee;
  errors: any;
  loading: boolean;
  isCompleted: boolean;
  updateField: (field: keyof Employee, value: any) => void;
  handleNext: () => void;
  handleBack: () => void;
  onFinish: () => void;
  onUploadError: (message: string) => void;
}

const CustomStepIcon = (props: StepIconProps) => {
  const { active, completed, icon } = props;
  if (completed)
    return <CheckCircleIcon sx={{ color: "#2ecc71", fontSize: 24 }} />;
  return (
    <Box
      sx={{
        width: 24,
        height: 24,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: active ? "#2ecc71" : "#cfd8dc",
        color: "#ffffff",
        fontSize: "0.75rem",
        fontWeight: "bold",
      }}
    >
      {icon}
    </Box>
  );
};

const RegistrationForm: React.FC<Props> = (props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const isEditing = location.pathname === "/editar";
  const steps = ["Infos Básicas", "Infos Profissionais"];
  const progress = props.isCompleted ? 100 : props.activeStep === 0 ? 0 : 50;
  const { departments, managers, loading: loadingDeps } = useFormDependencies();

  return (
    <Box>
      <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: props.activeStep === 0 ? 700 : 400,
            color: props.activeStep === 0 ? "#37474f" : "#90a4ae",
          }}
        >
          Colaboradores
        </Typography>
        <Typography variant="body2" color="#90a4ae">
          •
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontWeight: props.activeStep === 1 ? 700 : 400,
            color: props.activeStep === 1 ? "#37474f" : "#90a4ae",
          }}
        >
          {isEditing ? "Editar Colaborador" : "Cadastrar Colaborador"}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            flexGrow: 1,
            height: 4,
            borderRadius: 2,
            bgcolor: "#e0f2f1",
            "& .MuiLinearProgress-bar": { bgcolor: "#2ecc71" },
          }}
        />
        <Typography variant="body2" fontWeight="bold" color="#90a4ae">
          {progress}%
        </Typography>
      </Box>

      <Grid container spacing={{ xs: 4, md: 10 }}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Stepper
            activeStep={props.isCompleted ? 2 : props.activeStep}
            orientation={isMobile ? "horizontal" : "vertical"}
            sx={{ mb: { xs: 4, md: 0 } }}
          >
            {steps.map((label, index) => (
              <Step
                key={label}
                completed={props.isCompleted || props.activeStep > index}
              >
                <StepLabel slots={{ stepIcon: CustomStepIcon }}>
                  {!isMobile && (
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight:
                          props.activeStep === index && !props.isCompleted
                            ? 700
                            : 400,
                        color:
                          props.activeStep === index && !props.isCompleted
                            ? "#37474f"
                            : "#90a4ae",
                      }}
                    >
                      {label}
                    </Typography>
                  )}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Grid>

        <Grid size={{ xs: 12, md: 9 }}>
          <Box sx={{ maxWidth: 600, mx: { xs: "auto", md: 0 } }}>
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{
                mb: 4,
                color: "#546e7a",
                textAlign: { xs: "center", md: "left" },
              }}
            >
              {isEditing
                ? "Editar Colaborador"
                : props.activeStep === 0
                ? "Informações Básicas"
                : "Informações Profissionais"}
            </Typography>

            {props.activeStep === 0 ? (
              <BasicInfoStep
                data={props.formData}
                onUpdate={props.updateField}
                errors={props.errors}
                onUploadError={props.onUploadError}
              />
            ) : (
              <ProfessionalInfoStep
                data={props.formData}
                onUpdate={props.updateField}
                errors={props.errors}
                departments={departments}
                managers={managers}
                loadingDeps={loadingDeps}
              />
            )}

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 6,
                alignItems: "center",
              }}
            >
              <Button
                onClick={props.handleBack}
                sx={{ color: "#37474f", fontWeight: "bold" }}
              >
                {props.activeStep === 0 ? "Cancelar" : "Voltar"}
              </Button>
              <Button
                variant="contained"
                onClick={
                  props.activeStep === 1 ? props.onFinish : props.handleNext
                }
                disabled={props.loading}
                sx={{
                  bgcolor: "#2ecc71",
                  borderRadius: "8px",
                  px: 4,
                  "&:hover": { bgcolor: "#27ae60" },
                }}
              >
                {props.loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : props.activeStep === 1 ? (
                  "Concluir"
                ) : (
                  "Próximo"
                )}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RegistrationForm;
