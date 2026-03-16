import { z } from "zod";
import { Seniority } from "../constants/employee";

export const employeeSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
  active: z.boolean(),
  avatar: z.string().optional(),
});

export const stepProfissionaisSchema = z.object({
  departmentId: z.string().min(1, "Selecione um departamento"),
  role: z.string().min(2, "O cargo é obrigatório"),
  admissionDate: z.string().min(1, "Data de admissão é obrigatória"),
  seniority: z.nativeEnum(Seniority),
  salary: z.number().min(1000, "O salário base deve ser maior que R$ 1.000"),
  managerId: z.string().optional(),
});

export const employeesSchema = employeeSchema
  .merge(stepProfissionaisSchema)
  .refine(
    (data) => {
      if (data.seniority !== Seniority.Gestor) {
        return !!data.managerId && data.managerId.length > 0;
      }
      return true;
    },
    {
      message: "O gestor responsável é obrigatório para este nível",
      path: ["managerId"],
    }
  );
