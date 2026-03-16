export type Seniority = "Junior" | "Pleno" | "Senior" | "Gestor";

export interface Employee {
  id?: string;
  name: string;
  email: string;
  active: boolean;
  avatar?: string;
  departmentId: string;
  role: string;
  admissionDate: string;
  seniority: Seniority;
  managerId?: string;
  salary: number;
}
