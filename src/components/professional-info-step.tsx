import React from "react";
import { MenuItem, TextField, Box, Grid, InputAdornment } from "@mui/material";
import { Employee } from "../types/employee";
import { DepartmentData } from "../schemas/department";
import { Seniority } from "../constants/employee";

interface Props {
  data: Employee;
  onUpdate: (field: keyof Employee, value: any) => void;
  errors?: any;
  departments: DepartmentData[];
  managers: Employee[];
  loadingDeps: boolean;
}

const ProfessionalInfoStep: React.FC<Props> = ({
  data,
  onUpdate,
  errors,
  departments,
  managers,
  loadingDeps,
}) => {
  const formatDisplayCurrency = (value: number | undefined) => {
    if (!value && value !== 0) return "";
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    const numericValue = Number(rawValue) / 100;
    onUpdate("salary", numericValue);
  };

  const isGestor = data.seniority === "Gestor";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            select
            label="Departamento"
            fullWidth
            value={data.departmentId || ""}
            onChange={(e) => onUpdate("departmentId", e.target.value)}
            error={!!errors?.departmentId}
            helperText={errors?.departmentId}
            disabled={loadingDeps}
          >
            {departments.map((dept) => (
              <MenuItem key={dept.id} value={dept.name}>
                {dept.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Cargo"
            fullWidth
            value={data.role || ""}
            onChange={(e) => onUpdate("role", e.target.value)}
            error={!!errors?.role}
            helperText={errors?.role}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Data de Admissão"
            type="date"
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            value={data.admissionDate || ""}
            onChange={(e) => onUpdate("admissionDate", e.target.value)}
            error={!!errors?.admissionDate}
            helperText={errors?.admissionDate}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            select
            label="Nível Hierárquico"
            fullWidth
            value={data.seniority || ""}
            onChange={(e) => onUpdate("seniority", e.target.value)}
            error={!!errors?.seniority}
            helperText={errors?.seniority}
          >
            {Object.values(Seniority).map((value) => (
              <MenuItem key={value} value={value}>
                {value}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            select
            label="Gestor Responsável"
            fullWidth
            value={data.managerId || ""}
            onChange={(e) => onUpdate("managerId", e.target.value)}
            error={!isGestor && !!errors?.managerId}
            helperText={
              isGestor
                ? "Opcional para nível Gestor (Reporta à Diretoria)"
                : errors?.managerId
            }
            disabled={loadingDeps}
          >
            <MenuItem value="">
              <em>{isGestor ? "Nenhum (Diretoria)" : "Selecione um gestor"}</em>
            </MenuItem>
            {managers
              .filter((m) => m.id !== data.id)
              .map((m) => (
                <MenuItem key={m.id} value={m.name}>
                  {m.name}
                </MenuItem>
              ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Salário Base"
            fullWidth
            value={formatDisplayCurrency(data.salary)}
            onChange={handleSalaryChange}
            error={!!errors?.salary}
            helperText={errors?.salary}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">R$</InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfessionalInfoStep;
