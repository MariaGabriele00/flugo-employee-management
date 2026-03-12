import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  IconButton,
  Grid,
  Avatar,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PeopleIcon from "@mui/icons-material/People";
import AddBoxIcon from "@mui/icons-material/AddBox";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface Props {
  open: boolean;
  onClose: () => void;
}

const SystemGuide: React.FC<Props> = ({ open, onClose }) => {
  const itensGuia = [
    {
      icon: <PeopleIcon />,
      title: "Gestão de Lista",
      desc: "Visualize todos os colaboradores. Use as setas no cabeçalho para ordenar por nome, e-mail ou departamento.",
    },
    {
      icon: <AddBoxIcon />,
      title: "Novo Cadastro",
      desc: "O cadastro é feito em 2 etapas: Informações Básicas (com upload de foto) e Informações Profissionais.",
    },
    {
      icon: <EditIcon />,
      title: "Edição Rápida",
      desc: "Clique no ícone de lápis verde para carregar os dados de um colaborador e realizar alterações.",
    },
    {
      icon: <DeleteIcon />,
      title: "Exclusão Segura",
      desc: "Ao excluir, um modal de confirmação aparecerá. Uma vez confirmado, os dados são removidos permanentemente.",
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: { borderRadius: 4, p: 1 },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" fontWeight="800" color="#1e293b">
          Guia do Usuário
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" color="#64748b" mb={4}>
          Bem-vindo ao sistema da Flugo. Aqui está um resumo de como navegar e
          utilizar as ferramentas de gerenciamento:
        </Typography>

        <Grid container spacing={4}>
          {itensGuia.map((item, index) => (
            <Grid size={{ xs: 12, sm: 6 }} key={index}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: "#e8f5e9",
                    color: "#2ecc71",
                    width: 48,
                    height: 48,
                  }}
                >
                  {item.icon}
                </Avatar>
                <Box>
                  <Typography
                    variant="subtitle1"
                    fontWeight="700"
                    color="#334155"
                  >
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="#64748b">
                    {item.desc}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box
          sx={{
            bgcolor: "#f8fafc",
            p: 3,
            borderRadius: 3,
            border: "1px solid #f1f5f9",
          }}
        >
          <Typography
            variant="subtitle2"
            fontWeight="700"
            color="#334155"
            mb={1}
          >
            Dica Pro:
          </Typography>
          <Typography variant="body2" color="#64748b">
            O sistema salva os dados em tempo real no Firebase. Certifique-se de
            que o e-mail do colaborador seja único, caso contrário, o formulário
            impedirá o avanço para a segunda etapa.
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default SystemGuide;
