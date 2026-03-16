import { useState, useEffect } from "react";
import { departmentService } from "../services/department-service";
import { employeeService } from "../services/firebase";
import { Employee } from "../types/employee";
import { DepartmentData } from "../schemas/department";
import { Seniority } from "../constants/employee";

export const useFormDependencies = () => {
  const [departments, setDepartments] = useState<DepartmentData[]>([]);
  const [managers, setManagers] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [depts, emps] = await Promise.all([
          departmentService.getAll(),
          employeeService.getAll(),
        ]);

        setDepartments(depts);
        const filteredManagers = emps.filter(
          (emp) =>
            emp.seniority?.toLowerCase() === Seniority.Gestor.toLowerCase()
        );

        setManagers(filteredManagers);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { departments, managers, loading };
};
