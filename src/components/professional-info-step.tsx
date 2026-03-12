import React from "react";
import { MenuItem, TextField, Box, Typography } from "@mui/material";
import { Employee } from "../types/employee";

interface Props {
  data: Employee;
  onUpdate: (field: keyof Employee, value: any) => void;
  errors?: Partial<Record<keyof Employee, string>>;
}

const department = ["Design", "TI", "Marketing", "Produto", "Financeiro"];

const ProfessionalInfoStep: React.FC<Props> = ({ data, onUpdate, errors }) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
    <TextField
      select
      fullWidth
      value={data.department || ""}
      onChange={(e) => onUpdate("department", e.target.value)}
      error={!!errors?.department}
      helperText={errors?.department}
      slotProps={{
        select: {
          displayEmpty: true,
          renderValue: (selected: unknown) => {
            if (!selected || (selected as string).length === 0) {
              return (
                <Typography sx={{ color: "#94a3b8" }}>
                  Selecione um departamento
                </Typography>
              );
            }
            return selected as string;
          },
        },
      }}
    >
      <MenuItem disabled value="">
        <Typography sx={{ color: "#94a3b8" }}>
          Selecione um departamento
        </Typography>
      </MenuItem>
      {department.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </TextField>
  </Box>
);

export default ProfessionalInfoStep;
