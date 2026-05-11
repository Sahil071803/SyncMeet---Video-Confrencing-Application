import React from "react";

import { IconButton } from "@mui/material";

import { styled } from "@mui/system";

import Groups2Icon from "@mui/icons-material/Groups2";

const StyledButton = styled(IconButton)({
  width: "56px",

  height: "56px",

  borderRadius: "18px",

  background:
    "linear-gradient(135deg,#7B61FF,#5B42F3)",

  color: "#fff",

  transition: "all 0.3s ease",

  boxShadow:
    "0 8px 25px rgba(123,97,255,0.4)",

  "&:hover": {
    transform: "translateY(-3px)",

    background:
      "linear-gradient(135deg,#8B73FF,#6D55FF)",
  },
});

const MainPageButton = () => {
  return (
    <StyledButton>
      <Groups2Icon />
    </StyledButton>
  );
};

export default MainPageButton;