import React from "react";
import { Snackbar, Alert, Slide, SlideProps } from "@mui/material";

interface Props {
  open: boolean;
  message: string;
  severity: "success" | "error";
  onClose: () => void;
}

function TransitionLeft(props: SlideProps) {
  return <Slide {...props} direction="left" />;
}

const FeedbackSnackbar: React.FC<Props> = ({
  open,
  message,
  severity,
  onClose,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      slots={{
        transition: TransitionLeft,
      }}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{
          width: "100%",
          borderRadius: "8px",
          fontWeight: "bold",
          bgcolor: severity === "success" ? "#2ecc71" : "#ef4444",
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default FeedbackSnackbar;
