import React from "react";
import { Box } from "@mui/material";
import InputWithLabel from "../../shared/components/InputWithLabel";

const LoginPageInputs = ({ email, setEmail, password, setPassword }) => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        mt: 3,
      }}
    >

      <InputWithLabel
        value={email}
        setValue={setEmail}
        label="E-mail"
        type="text"
        placeholder="Enter email"
      />

      <InputWithLabel
        value={password}
        setValue={setPassword}
        label="Password"
        type="password"
        placeholder="Enter password"
      />

    </Box>
  );
};

export default LoginPageInputs;