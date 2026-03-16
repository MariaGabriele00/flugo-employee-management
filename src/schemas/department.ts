import { z } from "zod";

export const departmentSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  description: z.string().optional(),
  manager: z.string().optional(),
});

export type DepartmentData = z.infer<typeof departmentSchema>;
