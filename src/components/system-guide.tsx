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
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ApartmentIcon from "@mui/icons-material/Apartment";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";

interface Props {
  open: boolean;
  onClose: () => void;
}

const SystemGuide: React.FC<Props> = ({ open, onClose }) => {
  const itensGuia = [
    {
      icon: <AdminPanelSettingsIcon />,
      title: "Acesso Restrito",
      desc: "O sistema é protegido por autenticação Firebase. Apenas usuários logados podem gerenciar colaboradores e departamentos.",
    },
    {
      icon: <ApartmentIcon />,
      title: "Gestão de Setores",
      desc: "Cadastre departamentos e vincule gestores. Você pode visualizar todos os membros de um setor diretamente na edição.",
    },
    {
      icon: <DeleteSweepIcon />,
      title: "Ações em Massa",
      desc: "Na listagem principal, selecione múltiplos colaboradores para realizar a exclusão em massa de forma rápida e segura.",
    },
    {
      icon: <AccountCircleIcon />,
      title: "Meu Perfil",
      desc: "Personalize sua experiência alterando seu nome de exibição e foto de perfil, salvos automaticamente no banco de dados.",
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
          Guia de Funcionalidades
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" color="#64748b" mb={4}>
          O painel administrativo da Flugo foi atualizado. Confira as regras
          essenciais para a operação do sistema:
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
            bgcolor: "#fff1f2",
            p: 3,
            borderRadius: 3,
            border: "1px solid #ffe4e6",
          }}
        >
          <Typography
            variant="subtitle2"
            fontWeight="700"
            color="#be123c"
            mb={1}
          >
            Regras de Integridade:
          </Typography>
          <Typography variant="body2" color="#be123c">
            Um departamento não pode ser excluído se houver colaboradores
            vinculados a ele. Para excluir um setor, transfira os membros para
            outra área primeiro. Além disso, o Gestor Responsável deve ser um
            colaborador já cadastrado com nível hierárquico de "Gestor".
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default SystemGuide;
