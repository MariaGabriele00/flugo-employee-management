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
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Employee } from "../types/employee";

interface Props {
  employees: Employee[];
  loading: boolean;
  onAddClick: () => void;
  onEditClick: (e: Employee) => void;
  onDeleteClick: (id: string) => void;
}

const EmployeeTable: React.FC<Props> = ({
  employees,
  loading,
  onAddClick,
  onEditClick,
  onDeleteClick,
}) => {
  const [orderBy, setOrderBy] = useState<keyof Employee>("name");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const sortedEmployees = useMemo(() => {
    return [...employees].sort((a, b) => {
      const vA = String(a[orderBy] || "").toLowerCase();
      const vB = String(b[orderBy] || "").toLowerCase();
      return order === "asc" ? vA.localeCompare(vB) : vB.localeCompare(vA);
    });
  }, [employees, order, orderBy]);

  const handleSort = (property: keyof Employee) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 800, color: "#1e293b" }}>
          Colaboradores
        </Typography>
        {employees.length > 0 && (
          <Button
            variant="contained"
            onClick={onAddClick}
            sx={{
              bgcolor: "#2ecc71",
              borderRadius: "10px",
              py: 1.5,
              fontWeight: "bold",
              textTransform: "none",
            }}
          >
            Novo Colaborador
          </Button>
        )}
      </Box>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ borderRadius: "16px", border: "1px solid #f1f5f9" }}
      >
        <Table sx={{ minWidth: 700 }}>
          <TableHead sx={{ bgcolor: "#f8fafc" }}>
            <TableRow>
              {[
                { id: "name", label: "Nome" },
                { id: "email", label: "E-mail" },
                { id: "department", label: "Departamento" },
                { id: "active", label: "Status" },
              ].map((column) => (
                <TableCell
                  key={column.id}
                  sx={{ fontWeight: 700, color: "#64748b" }}
                >
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={orderBy === column.id ? order : "asc"}
                    onClick={() => handleSort(column.id as keyof Employee)}
                    IconComponent={ArrowDownwardIcon}
                  >
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell
                align="center"
                sx={{ fontWeight: 700, color: "#64748b", width: 120 }}
              >
                Ações
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              [...Array(3)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5}>
                    <Skeleton height={60} />
                  </TableCell>
                </TableRow>
              ))
            ) : employees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} sx={{ py: 12, textAlign: "center" }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Typography variant="h6" color="#94a3b8" fontWeight={600}>
                      Nenhum colaborador encontrado
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<PersonAddIcon />}
                      onClick={onAddClick}
                      sx={{
                        borderColor: "#2ecc71",
                        color: "#35a865ff",
                        borderRadius: "8px",
                        fontWeight: "bold",
                        "&:hover": {
                          borderColor: "#27ae60",
                          bgcolor: "#f0fff4",
                        },
                      }}
                    >
                      Cadastrar Colaborador
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              sortedEmployees.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        src={item.avatar}
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: "#e8f5e9",
                          color: "#2ecc71",
                        }}
                      >
                        {!item.avatar &&
                          (item.name?.charAt(0).toUpperCase() || "?")}
                      </Avatar>
                      <Typography variant="body2" fontWeight={600}>
                        {item.name || "Sem nome"}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.department}</TableCell>
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
                    <IconButton
                      onClick={() => onEditClick(item)}
                      sx={{ color: "#2ecc71" }}
                    >
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={() => item.id && onDeleteClick(item.id)}
                      sx={{ color: "#ef4444" }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default EmployeeTable;
