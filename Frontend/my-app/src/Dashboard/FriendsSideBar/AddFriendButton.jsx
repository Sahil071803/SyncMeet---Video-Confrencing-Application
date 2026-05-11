import React, { useState } from "react";

import { Button } from "@mui/material";

import { styled } from "@mui/system";

import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";

import AddFriendDialog from "./AddFriendDialog";

const StyledButton = styled(Button)({
  width: "100%",

  height: "52px",

  borderRadius: "16px",

  background:
    "linear-gradient(135deg,#7B61FF,#5B42F3)",

  color: "#fff",

  textTransform: "none",

  fontWeight: 700,

  fontSize: "15px",

  boxShadow:
    "0 8px 30px rgba(123,97,255,0.35)",

  transition: "all 0.3s ease",

  "&:hover": {
    transform: "translateY(-2px)",

    background:
      "linear-gradient(135deg,#8B73FF,#6D55FF)",
  },
});

const AddFriendButton = () => {
  const [isDialogOpen, setIsDialogOpen] =
    useState(false);

  const handleOpenAddFriendDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseAddFriendDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      <StyledButton
        onClick={handleOpenAddFriendDialog}
        startIcon={<PersonAddAlt1Icon />}
      >
        Add Friend
      </StyledButton>

      <AddFriendDialog
        isDialogOpen={isDialogOpen}
        closeDialogHandler={
          handleCloseAddFriendDialog
        }
      />
    </>
  );
};

export default AddFriendButton;