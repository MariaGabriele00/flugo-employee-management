import React, { useEffect, useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Skeleton,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
  Chip,
  Checkbox,
  TableSortLabel,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SearchIcon from "@mui/icons-material/Search";
import ApartmentIcon from "@mui/icons-material/Apartment";
import DomainDisabledIcon from "@mui/icons-material/DomainDisabled";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import GroupIcon from "@mui/icons-material/Group";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { Building2 } from "lucide-react";
import { departmentService } from "../../services/department-service";
import { employeeService } from "../../services/firebase";
import { departmentSchema, DepartmentData } from "../../schemas/department";
import { Employee } from "../../types/employee";
import DeleteModal from "../../components/delete-modal";

const Departments: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [departments, setDepartments] = useState<DepartmentData[]>([]);
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [orderBy, setOrderBy] = useState<keyof DepartmentData>("name");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [openModal, setOpenModal] = useState(false);
  const [selectedDept, setSelectedDept] = useState<DepartmentData | null>(null);
  const [formErrors, setFormErrors] = useState<any>({});
  const [saveLoading, setSaveLoading] = useState(false);
  const [selectedNewMember, setSelectedNewMember] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [idsToDelete, setIdsToDelete] = useState<string[]>([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error" as "error" | "success",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [depts, emps] = await Promise.all([
        departmentService.getAll(),
        employeeService.getAll(),
      ]);
      setDepartments(depts);
      setAllEmployees(emps);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const gestoresDisponiveis = useMemo(
    () => allEmployees.filter((e) => e.seniority?.toLowerCase() === "gestor"),
    [allEmployees]
  );

  const sortedDepts = useMemo(() => {
    const filtered = departments.filter(
      (d) =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (d.manager || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
    return [...filtered].sort((a, b) => {
      const vA = String(a[orderBy] || "").toLowerCase();
      const vB = String(b[orderBy] || "").toLowerCase();
      if (order === "asc") return vA.localeCompare(vB);
      return vB.localeCompare(vA);
    });
  }, [departments, searchTerm, order, orderBy]);

  const handleSort = (property: keyof DepartmentData) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedIds(sortedDepts.map((d) => d.id!));
      return;
    }
    setSelectedIds([]);
  };

  const handleSelectOne = (id: string) => {
    const selectedIndex = selectedIds.indexOf(id);
    if (selectedIndex === -1) {
      setSelectedIds([...selectedIds, id]);
      return;
    }
    setSelectedIds(selectedIds.filter((item) => item !== id));
  };

  const handleAddMember = async () => {
    if (!selectedNewMember || !selectedDept?.name) return;
    try {
      const emp = allEmployees.find((e) => e.id === selectedNewMember);
      if (emp) {
        await employeeService.update(emp.id!, {
          departmentId: selectedDept.name,
        });
        await fetchData();
        setSelectedNewMember("");
      }
    } catch (error) {
      showFeedback("Erro ao transferir", "error");
    }
  };

  const handleSave = async () => {
    if (!selectedDept) return;
    const result = departmentSchema.safeParse(selectedDept);
    if (!result.success) {
      const errors: any = {};
      result.error.issues.forEach((i) => (errors[i.path[0]] = i.message));
      setFormErrors(errors);
      return;
    }
    try {
      setSaveLoading(true);
      if (selectedDept.id) {
        await departmentService.update(selectedDept.id, selectedDept);
      }
      if (!selectedDept.id) {
        await departmentService.create(selectedDept);
      }
      setOpenModal(false);
      fetchData();
      showFeedback("Sucesso!", "success");
    } catch (error) {
      showFeedback("Erro ao salvar!", "error");
    }
    setSaveLoading(false);
  };

  const showFeedback = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleDeleteTrigger = (ids: string | string[]) => {
    const idsArray = Array.isArray(ids) ? ids : [ids];
    const deptsWithMembers = sortedDepts.filter(
      (d) =>
        idsArray.includes(d.id!) &&
        allEmployees.some((e) => e.departmentId === d.name)
    );
    if (deptsWithMembers.length > 0) {
      showFeedback(
        `Bloqueado: Setores com membros vinculados (${deptsWithMembers
          .map((d) => d.name)
          .join(", ")}).`,
        "error"
      );
      return;
    }
    setIdsToDelete(idsArray);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (idsToDelete.length === 0) return;
    try {
      await departmentService.deleteMany(idsToDelete);
      setSelectedIds([]);
      fetchData();
      showFeedback("Operação realizada!", "success");
    } catch (error) {
      showFeedback("Erro ao excluir.", "error");
    }
    setDeleteModalOpen(false);
    setIdsToDelete([]);
  };

  const renderMobileCards = () => (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}
    >
      {sortedDepts.map((dept) => (
        <Paper
          key={dept.id}
          elevation={0}
          sx={{
            p: 2,
            borderRadius: "16px",
            border: "1px solid #f1f5f9",
            width: "100%",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
            <Checkbox
              checked={selectedIds.includes(dept.id!)}
              onChange={() => handleSelectOne(dept.id!)}
              sx={{
                p: 0,
                mt: 0.5,
                color: "#cbd5e1",
                "&.Mui-checked": { color: "#2ecc71" },
              }}
            />
            <Avatar
              sx={{
                bgcolor: "#e8f5e9",
                color: "#2ecc71",
                width: 44,
                height: 44,
              }}
            >
              <ApartmentIcon />
            </Avatar>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 0.5,
                  gap: 1,
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold" noWrap>
                  {dept.name}
                </Typography>
                <Chip
                  icon={<GroupIcon style={{ fontSize: 14 }} />}
                  label={
                    allEmployees.filter((e) => e.departmentId === dept.name)
                      .length
                  }
                  size="small"
                  sx={{ height: 20, fontSize: "0.65rem" }}
                />
              </Box>
              <Typography
                variant="caption"
                color="#64748b"
                display="block"
                noWrap
                sx={{ mb: 1.5 }}
              >
                Gestor: {dept.manager || "Diretoria"}
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    setSelectedDept(dept);
                    setOpenModal(true);
                  }}
                  sx={{
                    borderRadius: "8px",
                    borderColor: "#2ecc71",
                    color: "#2ecc71",
                    fontWeight: "bold",
                    textTransform: "none",
                    fontSize: "0.75rem",
                  }}
                >
                  Editar
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  size="small"
                  onClick={() => handleDeleteTrigger(dept.id!)}
                  sx={{
                    borderRadius: "8px",
                    borderColor: "#ffe4e6",
                    color: "#ef4444",
                    fontWeight: "bold",
                    textTransform: "none",
                    fontSize: "0.75rem",
                  }}
                >
                  Excluir
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>
      ))}
    </Box>
  );

  return (
    <Box sx={{ width: "100%", overflow: "hidden" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "flex-end" },
          mb: 4,
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: "#1e293b",
              mb: 0.5,
              fontSize: { xs: "1.5rem", sm: "2.125rem" },
            }}
          >
            Departamentos
          </Typography>
          <Typography variant="body2" color="#64748b">
            Gestão de setores e lideranças
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            width: { xs: "100%", sm: "auto" },
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Box sx={{ display: "flex", gap: 1, width: "100%" }}>
            <TextField
              placeholder="Pesquisar..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                flexGrow: 1,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  bgcolor: "#ffffff",
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#94a3b8" }} />
                  </InputAdornment>
                ),
              }}
            />
            {selectedIds.length > 0 && (
              <IconButton
                color="error"
                onClick={() => handleDeleteTrigger(selectedIds)}
                sx={{
                  bgcolor: "#fff1f2",
                  borderRadius: "10px",
                  border: "1px solid #fecdd3",
                }}
              >
                <DeleteSweepIcon />
              </IconButton>
            )}
          </Box>
          <Button
            variant="contained"
            fullWidth={isMobile}
            onClick={() => {
              setSelectedDept({ name: "", manager: "", description: "" });
              setOpenModal(true);
            }}
            startIcon={<AddBusinessIcon />}
            sx={{
              bgcolor: "#2ecc71",
              borderRadius: "10px",
              px: 3,
              py: 1.1,
              fontWeight: "bold",
              textTransform: "none",
            }}
          >
            Novo
          </Button>
        </Box>
      </Box>
      {loading ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {[...Array(2)].map((_, i) => (
            <Skeleton
              key={i}
              variant="rounded"
              height={isMobile ? 120 : 60}
              sx={{ borderRadius: "16px" }}
            />
          ))}
        </Box>
      ) : sortedDepts.length === 0 ? (
        <Box sx={{ py: 10, textAlign: "center" }}>
          <DomainDisabledIcon sx={{ fontSize: 48, color: "#cbd5e1" }} />
          <Typography variant="body2" color="#94a3b8">
            Nenhum departamento encontrado
          </Typography>
        </Box>
      ) : isMobile ? (
        renderMobileCards()
      ) : (
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            borderRadius: "16px",
            border: "1px solid #f1f5f9",
            width: "100%",
          }}
        >
          <Table sx={{ width: "100%" }}>
            <TableHead sx={{ bgcolor: "#f8fafc" }}>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selectedIds.length > 0 &&
                      selectedIds.length < sortedDepts.length
                    }
                    checked={
                      sortedDepts.length > 0 &&
                      selectedIds.length === sortedDepts.length
                    }
                    onChange={handleSelectAll}
                    sx={{
                      color: "#cbd5e1",
                      "&.Mui-checked": { color: "#2ecc71" },
                    }}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>
                  <TableSortLabel
                    active={orderBy === "name"}
                    direction={orderBy === "name" ? order : "asc"}
                    onClick={() => handleSort("name")}
                    IconComponent={ArrowDownwardIcon}
                  >
                    Nome do Setor
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>
                  <TableSortLabel
                    active={orderBy === "manager"}
                    direction={orderBy === "manager" ? order : "asc"}
                    onClick={() => handleSort("manager")}
                    IconComponent={ArrowDownwardIcon}
                  >
                    Gestor
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, width: 100 }}>
                  Ações
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedDepts.map((dept) => (
                <TableRow
                  key={dept.id}
                  hover
                  selected={selectedIds.includes(dept.id!)}
                  sx={{ "&:last-child td": { border: 0 } }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedIds.includes(dept.id!)}
                      onChange={() => handleSelectOne(dept.id!)}
                      sx={{
                        color: "#cbd5e1",
                        "&.Mui-checked": { color: "#2ecc71" },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <ApartmentIcon sx={{ color: "#2ecc71" }} />
                      <Typography variant="body2" fontWeight={600} noWrap>
                        {dept.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    <Typography variant="body2" noWrap>
                      {dept.manager || "Diretoria"}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <IconButton
                        onClick={() => {
                          setSelectedDept(dept);
                          setOpenModal(true);
                        }}
                        sx={{ color: "#2ecc71" }}
                        size="small"
                      >
                        <EditOutlinedIcon fontSize="inherit" />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteTrigger(dept.id!)}
                        sx={{ color: "#ef4444" }}
                        size="small"
                      >
                        <DeleteOutlineIcon fontSize="inherit" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: "16px" } }}
      >
        <DialogTitle sx={{ fontWeight: 800, pt: 3 }}>
          <Building2
            size={24}
            color="#2ecc71"
            style={{ marginRight: 8, verticalAlign: "middle" }}
          />
          {selectedDept?.id ? "Editar Setor" : "Novo Setor"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}>
            <TextField
              label="Nome do Departamento"
              fullWidth
              value={selectedDept?.name}
              onChange={(e) =>
                setSelectedDept({ ...selectedDept!, name: e.target.value })
              }
              error={!!formErrors.name}
              helperText={formErrors.name}
            />
            <TextField
              select
              label="Gestor Responsável"
              fullWidth
              value={selectedDept?.manager || ""}
              onChange={(e) =>
                setSelectedDept({ ...selectedDept!, manager: e.target.value })
              }
            >
              <MenuItem value="">
                <em>Diretoria (Padrão)</em>
              </MenuItem>
              {gestoresDisponiveis.map((g) => (
                <MenuItem key={g.id} value={g.name}>
                  {g.name}
                </MenuItem>
              ))}
            </TextField>
            {selectedDept?.name && selectedDept.name.length >= 3 && (
              <>
                <Divider />
                <Box>
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    sx={{
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <PersonAddIcon fontSize="small" /> Transferir Colaborador
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      label="Colaborador"
                      value={selectedNewMember}
                      onChange={(e) => setSelectedNewMember(e.target.value)}
                    >
                      {allEmployees
                        .filter((e) => e.departmentId !== selectedDept.name)
                        .map((e) => (
                          <MenuItem key={e.id} value={e.id}>
                            {e.name} ({e.departmentId || "Sem setor"})
                          </MenuItem>
                        ))}
                    </TextField>
                    <Button
                      variant="contained"
                      onClick={handleAddMember}
                      disabled={!selectedNewMember}
                      sx={{ bgcolor: "#2ecc71" }}
                    >
                      Add
                    </Button>
                  </Box>
                </Box>
                <Box>
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    sx={{ mb: 1 }}
                  >
                    Membros Atuais (
                    {
                      allEmployees.filter(
                        (e) => e.departmentId === selectedDept.name
                      ).length
                    }
                    )
                  </Typography>
                  <List
                    sx={{
                      bgcolor: "#f8fafc",
                      borderRadius: 2,
                      maxHeight: 180,
                      overflow: "auto",
                    }}
                  >
                    {allEmployees
                      .filter((e) => e.departmentId === selectedDept.name)
                      .map((m) => (
                        <ListItem key={m.id} divider>
                          <ListItemAvatar>
                            <Avatar
                              src={m.avatar}
                              sx={{ width: 32, height: 32 }}
                            >
                              {m.name.charAt(0)}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography variant="body2" fontWeight={600}>
                                {m.name}
                              </Typography>
                            }
                            secondary={m.role}
                          />
                        </ListItem>
                      ))}
                  </List>
                </Box>
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenModal(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saveLoading}
            sx={{ bgcolor: "#2ecc71" }}
          >
            {saveLoading ? <CircularProgress size={20} /> : "Salvar"}
          </Button>
        </DialogActions>
      </Dialog>
      <DeleteModal
        open={deleteModalOpen}
        title="Excluir Departamento?"
        description="Esta ação é permanente. O setor será removido da base de dados."
        onClose={() => {
          setDeleteModalOpen(false);
          setIdsToDelete([]);
        }}
        onConfirm={handleConfirmDelete}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Departments;
