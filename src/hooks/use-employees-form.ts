import { useState } from "react";
import { Employee } from "../types/employee";
import { employeeService } from "../services/firebase";
import { employeeSchema, stepProfissionaisSchema } from "../schemas/employee";

const initialData: Employee = {
  name: "",
  email: "",
  active: true,
  avatar: "",
  departmentId: "",
  role: "",
  admissionDate: "",
  seniority: "Junior",
  salary: 0,
  managerId: "",
};

export const useEmployeesForm = (existingEmployees: Employee[]) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<Employee>(initialData);
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const updateField = (field: keyof Employee, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev: any) => ({ ...prev, [field]: null }));
  };

  const validateStep = () => {
    const schema = activeStep === 0 ? employeeSchema : stepProfissionaisSchema;
    const result = schema.safeParse(formData);
    const newErrors: any = {};

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        newErrors[issue.path[0]] = issue.message;
      });
    }

    if (activeStep === 0 && formData.email) {
      const emailExists = existingEmployees.some(
        (e) => e.email === formData.email && e.id !== formData.id
      );
      if (emailExists) newErrors.email = "Este e-mail já está cadastrado";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const resetForm = () => {
    setFormData(initialData);
    setActiveStep(0);
    setErrors({});
  };

  const prepareEdit = (employee: Employee) => {
    setFormData(employee);
    setActiveStep(0);
    setErrors({});
  };

  const submitForm = async () => {
    if (!validateStep()) return false;
    setLoading(true);
    try {
      await employeeService.save(formData);
      return true;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    activeStep,
    formData,
    errors,
    loading,
    updateField,
    handleNext,
    handleBack,
    submitForm,
    resetForm,
    prepareEdit,
  };
};
