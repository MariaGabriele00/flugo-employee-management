import React, { useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "./theme/theme";
import { Layout } from "./components/Layout";
import RegistrationForm from "./components/registration-form";
import EmployeeTable from "./components/employee-table";
import SuccessModal from "./components/success-modal";
import DeleteModal from "./components/delete-modal";
import FeedbackSnackbar from "./components/feedback-snackbar";
import { useEmployees } from "./hooks/use-employees";
import { useEmployeesForm } from "./hooks/use-employees-form";
import { employeeService } from "./services/firebase";

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [deleteModalState, setDeleteModalState] = useState({
    open: false,
    id: "",
  });
  const [feedback, setFeedback] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const { employees, loading: loadingList } = useEmployees();
  const formState = useEmployeesForm(employees);

  const showFeedback = (
    message: string,
    severity: "success" | "error" = "error"
  ) => {
    setFeedback({ open: true, message, severity });
  };

  const handleFinish = async () => {
    try {
      const success = await formState.submitForm();

      if (success) {
        setIsCompleted(true);
        setIsSuccessModalOpen(true);
        return;
      }

      showFeedback("Por favor, corrija os erros de validação.");
    } catch (error: any) {
      if (error.code === "permission-denied") {
        showFeedback("Erro: Sem permissão no Firebase (Rules).");
        return;
      }

      if (
        error.message?.includes("too large") ||
        error.code === "invalid-argument"
      ) {
        showFeedback("A foto é muito grande para o banco de dados!");
        return;
      }

      showFeedback(`Erro Técnico: ${error.message || "Falha desconhecida"}`);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModalState.id) return;

    try {
      await employeeService.delete(deleteModalState.id);
      showFeedback("Colaborador excluído com sucesso!", "success");
    } catch (error) {
      showFeedback("Erro ao excluir colaborador.");
    } finally {
      setDeleteModalState({ open: false, id: "" });
    }
  };

  const renderForm = () => (
    <RegistrationForm
      {...formState}
      isCompleted={isCompleted}
      onFinish={handleFinish}
      onUploadError={(msg) => showFeedback(msg, "error")}
      handleBack={() =>
        formState.activeStep === 0 ? navigate("/") : formState.handleBack()
      }
    />
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>
        <Routes>
          <Route
            path="/"
            element={
              <EmployeeTable
                employees={employees}
                loading={loadingList}
                onAddClick={() => {
                  formState.resetForm();
                  setIsCompleted(false);
                  navigate("/cadastrar");
                }}
                onEditClick={(employee) => {
                  formState.prepareEdit(employee);
                  setIsCompleted(false);
                  navigate("/editar");
                }}
                onDeleteClick={(id) => setDeleteModalState({ open: true, id })}
              />
            }
          />
          <Route path="/cadastrar" element={renderForm()} />
          <Route path="/editar" element={renderForm()} />
        </Routes>
      </Layout>

      <SuccessModal
        open={isSuccessModalOpen}
        isEdit={location.pathname === "/editar"}
        onClose={() => {
          setIsSuccessModalOpen(false);
          setIsCompleted(false);
          navigate("/");
        }}
      />

      <DeleteModal
        open={deleteModalState.open}
        onClose={() => setDeleteModalState({ open: false, id: "" })}
        onConfirm={handleConfirmDelete}
      />

      <FeedbackSnackbar
        open={feedback.open}
        message={feedback.message}
        severity={feedback.severity}
        onClose={() => setFeedback({ ...feedback, open: false })}
      />
    </ThemeProvider>
  );
};

export default App;
