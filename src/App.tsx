import React, { useState } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "./theme/theme";
import { Layout } from "./components/Layout";
import RegistrationForm from "./components/registration-form";
import EmployeeTable from "./components/employee-table";
import SuccessModal from "./components/success-modal";
import DeleteModal from "./components/delete-modal";
import FeedbackSnackbar from "./components/feedback-snackbar";
import Login from "./pages/login";
import Register from "./pages/register";
import Profile from "./pages/profile";
import { useEmployees } from "./hooks/use-employees";
import { useEmployeesForm } from "./hooks/use-employees-form";
import { employeeService } from "./services/firebase";
import { ProtectedRoute } from "./components/protected-route";
import { AuthProvider } from "./contexts/auth-context";
import NotFound from "./pages/not-found";
import Departments from "./pages/departments";
import { Employee } from "./types/employee";

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [deleteModalState, setDeleteModalState] = useState<{
    open: boolean;
    id: string | string[];
  }>({ open: false, id: "" });
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
      showFeedback(`Erro Técnico: ${error.message || "Falha desconhecida"}`);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModalState.id) return;
    const idsToDelete = Array.isArray(deleteModalState.id)
      ? deleteModalState.id
      : [deleteModalState.id];
    if (idsToDelete.length === 0) return;
    try {
      await employeeService.deleteMany(idsToDelete);
      showFeedback("Operação realizada com sucesso!", "success");
    } catch (error) {
      showFeedback("Erro ao excluir colaborador(es).");
    }
    setDeleteModalState({ open: false, id: "" });
  };

  const renderForm = () => (
    <RegistrationForm
      {...formState}
      isCompleted={isCompleted}
      onFinish={handleFinish}
      onUploadError={(msg) => showFeedback(msg, "error")}
      handleBack={() => {
        if (formState.activeStep === 0) {
          navigate("/");
          return;
        }
        formState.handleBack();
      }}
    />
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <EmployeeTable
                    employees={employees}
                    loading={loadingList}
                    onAddClick={() => {
                      formState.resetForm();
                      setIsCompleted(false);
                      navigate("/cadastrar");
                    }}
                    onEditClick={(employee: Employee) => {
                      formState.prepareEdit(employee);
                      setIsCompleted(false);
                      navigate("/editar");
                    }}
                    onDeleteClick={(id: string | string[]) =>
                      setDeleteModalState({ open: true, id })
                    }
                  />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/cadastrar"
            element={
              <ProtectedRoute>
                <Layout>{renderForm()}</Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/editar"
            element={
              <ProtectedRoute>
                <Layout>{renderForm()}</Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/departamentos"
            element={
              <ProtectedRoute>
                <Layout>
                  <Departments />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
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
          title="Excluir Colaborador?"
          description="Esta ação é permanente. O colaborador será removido da base de dados."
          onClose={() => setDeleteModalState({ open: false, id: "" })}
          onConfirm={handleConfirmDelete}
        />
        <FeedbackSnackbar
          open={feedback.open}
          message={feedback.message}
          severity={feedback.severity}
          onClose={() => setFeedback({ ...feedback, open: false })}
        />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
