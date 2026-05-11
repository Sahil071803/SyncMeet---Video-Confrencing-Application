import React from "react";
import Button from "@mui/material/Button";

const CustomPrimaryButton = ({ label, additionalStyles, disabled, onClick }) => {
  return (
    <Button
      variant="contained"
      sx={{
        bgcolor: "#5865F2",
        "&:hover": { bgcolor: "#4753d4" },
        color: "white",
        textTransform: "none",
        fontSize: "16px",
        fontWeight: 500,
        width: "100%",
        height: "40px",
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