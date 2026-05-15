import React from "react";
import Button from "@mui/material/Button";

const CustomPrimaryButton = ({ label, additionalStyles, disabled, onClick }) => {
  return (
    <Button
      variant="contained"
      sx={{
        background: "linear-gradient(135deg,#8B5CF6,#6D28D9)",
        "&:hover": { background: "linear-gradient(135deg,#9D6CFF,#7C3AED)" },
        color: "white",
        textTransform: "none",
        fontWeight: 700,
        fontSize: "14px",
        width: "100%",
        height: "48px",
        borderRadius: "14px",
        boxShadow: "0 12px 28px rgba(139,92,246,0.34)",
        ...additionalStyles,
      }}
      disabled={disabled}
      onClick={onClick}
    >
      {label}
    </Button>
  );
};

export default CustomPrimaryButton;