import React, { useState } from "react";
import { styled } from "@mui/system";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Wrapper = styled("div")({
  width: "100%",
  maxWidth: "500px",
  marginBottom: "22px",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
});

const Label = styled("label")({
  fontWeight: 600,
  fontSize: "15px",
  marginBottom: "8px",
  color: "#f3eaea",
  textAlign: "left",
  width: "100%",
});

const ErrorText = styled("span")({
  fontSize: "13px",
  color: "#ff6b6b",
  marginTop: "4px",
  width: "100%",
  textAlign: "left",
});

const InputWithLabel = ({
  value,
  setValue,
  label,
  type,
  placeholder,
  error = "", // 🔥 Add error prop
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setValue(e.target.value);
  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  return (
    <Wrapper>
      <Label>{label}</Label>

      <TextField
        fullWidth
        variant="outlined"
        value={value}
        onChange={handleChange}
        type={type === "password" && showPassword ? "text" : type}
        placeholder={placeholder}
        size="medium"
        error={!!error} // 🔥 Shows red outline if error exists
        helperText={error} // 🔥 Shows error message below input
        sx={{
          width: "100%",
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
          },
        }}
        InputProps={
          type === "password"
            ? {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }
            : {}
        }
      />
    </Wrapper>
  );
};

export default InputWithLabel;