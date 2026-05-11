import React from "react";
import { styled } from "@mui/system";
import MainPageButton from "./MainPageButton";

const MainContainer = styled("div")({
  height: "100%",

  background: "rgba(17,24,39,0.95)",

  borderRight: "1px solid rgba(255,255,255,0.05)",

  display: "flex",
  flexDirection: "column",
  alignItems: "center",

  paddingTop: "16px",

  backdropFilter: "blur(10px)",
});

const SideBar = () => {
  return (
    <MainContainer>
      <MainPageButton />
    </MainContainer>
  );
};

export default SideBar;