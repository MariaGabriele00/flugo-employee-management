import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  Typography,
  Box,
  Skeleton,
  Button,
  IconButton,
  TableSortLabel,
  TextField,
  InputAdornment,
  Checkbox,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SearchIcon from "@mui/icons-material/Search";
import GroupxIcon from "@mui/icons-material/PersonOffOutlined";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import { Employee } from "../types/employee";

interface Props {
  employees: Employee[];
  loading: boolean;
  onAddClick: () => void;
  onEditClick: (e: Employee) => void;
  onDeleteClick: (id: string | string[]) => void;
}

const EmployeeTable: React.FC<Props> = ({
  employees,
  loading,
  onAddClick,
  onEditClick,
  onDeleteClick,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [searchTerm, setSearchTerm] = useState("");
  const [orderBy, setOrderBy] = useState<keyof Employee>("name");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const search = searchTerm.toLowerCase();
      return (
        emp.name?.toLowerCase().includes(search) ||
        emp.email?.toLowerCase().includes(search) ||
        emp.departmentId?.toLowerCase().includes(search)
      );
    });
  }, [employees, searchTerm]);

  const sortedEmployees = useMemo(() => {
    return [...filteredEmployees].sort((a, b) => {
      const vA = String(a[orderBy] || "").toLowerCase();
      const vB = String(b[orderBy] || "").toLowerCase();
      if (order === "asc") return vA.localeCompare(vB);
      return vB.localeCompare(vA);
    });
  }, [filteredEmployees, order, orderBy]);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedIds(filteredEmployees.map((n) => n.id!));
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

  const renderMobileCards = () => (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}
    >
      {sortedEmployees.map((item) => (
        <Paper
          key={item.id}
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
              checked={selectedIds.includes(item.id!)}
              onChange={() => handleSelectOne(item.id!)}
              sx={{
                p: 0,
                mt: 0.5,
                color: "#cbd5e1",
                "&.Mui-checked": { color: "#2ecc71" },
              }}
            />
            <Avatar
              src={item.avatar}
              sx={{
                width: 44,
                height: 44,
                bgcolor: "#e8f5e9",
                color: "#2ecc71",
                fontWeight: "bold",
              }}
            >
              {!item.avatar && item.name?.charAt(0).toUpperCase()}
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
                  {item.name}
                </Typography>
                <Chip
                  label={item.active ? "Ativo" : "Inativo"}
                  size="small"
                  sx={{
                    bgcolor: item.active ? "#eefdf3" : "#fff1f2",
                    color: item.active ? "#22c55e" : "#ef4444",
                    fontWeight: 700,
                    height: 18,
                    fontSize: "0.6rem",
                  }}
                />
              </Box>
              <Typography
                variant="caption"
                color="#64748b"
                display="block"
                noWrap
                sx={{ mb: 1.5 }}
              >
                {item.email}
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  size="small"
                  startIcon={
                    <EditOutlinedIcon sx={{ fontSize: "1rem !important" }} />
                  }
                  onClick={() => onEditClick(item)}
                  sx={{
                    borderRadius: "8px",
                    borderColor: "#2ecc71",
                    color: "#2ecc71",
                    textTransform: "none",
                    fontWeight: "bold",
                    fontSize: "0.75rem",
                  }}
                >
                  Editar
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  size="small"
                  startIcon={
                    <DeleteOutlineIcon sx={{ fontSize: "1rem !important" }} />
                  }
                  onClick={() => onDeleteClick(item.id!)}
                  sx={{
                    borderRadius: "8px",
                    borderColor: "#ffe4e6",
                    color: "#ef4444",
                    textTransform: "none",
                    fontWeight: "bold",
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
            Colaboradores
          </Typography>
          <Typography variant="body2" color="#64748b">
            Gerencie sua equipe e permissões
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            alignItems: "center",
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
                onClick={() => {
                  onDeleteClick(selectedIds);
                  setSelectedIds([]);
                }}
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
            onClick={onAddClick}
            startIcon={<PersonAddIcon />}
            sx={{
              bgcolor: "#2ecc71",
              borderRadius: "10px",
              px: 3,
              py: 1.1,
              fontWeight: "bold",
              textTransform: "none",
              "&:hover": { bgcolor: "#27ae60" },
            }}
          >
            Novo
          </Button>
        </Box>
      </Box>
      {loading ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {[...Array(3)].map((_, i) => (
            <Skeleton
              key={i}
              variant="rounded"
              height={isMobile ? 120 : 60}
              sx={{ borderRadius: "16px" }}
            />
          ))}
        </Box>
      ) : sortedEmployees.length === 0 ? (
        <Box sx={{ py: 10, textAlign: "center" }}>
          <GroupxIcon sx={{ fontSize: 48, color: "#cbd5e1", mb: 1 }} />
          <Typography variant="body2" color="#94a3b8">
            Nenhum colaborador encontrado
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
                      selectedIds.length < filteredEmployees.length
                    }
                    checked={
                      filteredEmployees.length > 0 &&
                      selectedIds.length === filteredEmployees.length
                    }
                    onChange={handleSelectAll}
                    sx={{
                      color: "#cbd5e1",
                      "&.Mui-checked": { color: "#2ecc71" },
                    }}
                  />
                </TableCell>
                {[
                  { id: "name", label: "Nome" },
                  { id: "email", label: "E-mail" },
                  { id: "active", label: "Status" },
                ].map((column) => (
                  <TableCell
                    key={column.id}
                    sx={{ fontWeight: 700, color: "#64748b" }}
                  >
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : "asc"}
                      onClick={() => {
                        setOrder(
                          orderBy === column.id && order === "asc"
                            ? "desc"
                            : "asc"
                        );
                        setOrderBy(column.id as keyof Employee);
                      }}
                      IconComponent={ArrowDownwardIcon}
                    >
                      {column.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
                <TableCell
                  align="center"
                  sx={{ fontWeight: 700, color: "#64748b", width: 80 }}
                >
                  Ações
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedEmployees.map((item) => (
                <TableRow
                  key={item.id}
                  hover
                  selected={selectedIds.includes(item.id!)}
                  sx={{ "&:last-child td": { border: 0 } }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedIds.includes(item.id!)}
                      onChange={() => handleSelectOne(item.id!)}
                      sx={{
                        color: "#cbd5e1",
                        "&.Mui-checked": { color: "#2ecc71" },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      <Avatar
                        src={item.avatar}
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: "#e8f5e9",
                          color: "#2ecc71",
                          fontSize: "0.8rem",
                        }}
                      >
                        {!item.avatar && item.name?.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography variant="body2" fontWeight={600} noWrap>
                        {item.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: "#64748b", fontSize: "0.85rem" }}>
                    {item.email}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={item.active ? "Ativo" : "Inativo"}
                      size="small"
                      sx={{
                        bgcolor: item.active ? "#eefdf3" : "#fff1f2",
                        color: item.active ? "#22c55e" : "#ef4444",
                        fontWeight: 700,
                        borderRadius: "6px",
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <IconButton
                        onClick={() => onEditClick(item)}
                        sx={{ color: "#2ecc71" }}
                        size="small"
                      >
                        <EditOutlinedIcon fontSize="inherit" />
                      </IconButton>
                      <IconButton
                        onClick={() => onDeleteClick(item.id!)}
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
    </Box>
  );
};

export default EmployeeTable;
