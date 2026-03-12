import { z } from "zod";

export const employeeSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.email({ message: "E-mail inválido" }).min(1, "E-mail é obrigatório"),
  active: z.boolean(),
});

export const stepProfissionaisSchema = z.object({
  department: z.string().min(1, "Selecione um departamento"),
});

export const employeesSchema = employeeSchema.merge(stepProfissionaisSchema);
