import React, { useState } from "react";
import { Button, IconButton, Tooltip } from "@mui/material";
import { styled } from "@mui/system";

import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import AddFriendDialog from "./AddFriendDialog";

const StyledButton = styled(Button)(({ theme }) => ({
  minWidth: "132px",
  height: "44px",
  borderRadius: "16px",
  padding: "0 18px",

  background: "linear-gradient(135deg,#8B5CF6,#6D28D9)",
  color: "#fff",

  textTransform: "none",
  fontWeight: 800,
  fontSize: "13px",

  border: "1px solid rgba(255,255,255,0.10)",
  boxShadow: "0 12px 28px rgba(139,92,246,0.34)",

  transition: "all 0.25s ease",
  whiteSpace: "nowrap",

  "& .MuiButton-startIcon": {
    marginRight: "7px",
  },

  "& svg": {
    fontSize: "18px",
  },

  "&:hover": {
    transform: "translateY(-2px)",
    background: "linear-gradient(135deg,#9D6CFF,#7C3AED)",
    boxShadow: "0 16px 34px rgba(139,92,246,0.42)",
  },

  [theme.breakpoints.down("sm")]: {
    minWidth: "auto",
    width: "42px",
    height: "42px",
    padding: 0,
    borderRadius: "15px",

    "& .MuiButton-startIcon": {
      margin: 0,
    },
  },
}));

const CompactButton = styled(IconButton)({
  width: "44px",
  height: "44px",
  borderRadius: "16px",

  color: "#fff",
  background: "linear-gradient(135deg,#8B5CF6,#6D28D9)",

  border: "1px solid rgba(255,255,255,0.10)",
  boxShadow: "0 12px 28px rgba(139,92,246,0.34)",

  transition: "all 0.25s ease",

  "&:hover": {
    transform: "translateY(-2px)",
    background: "linear-gradient(135deg,#9D6CFF,#7C3AED)",
  },
});

const AddFriendButton = ({ compact = false }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenAddFriendDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseAddFriendDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      {compact ? (
        <Tooltip title="Add participant">
          <CompactButton onClick={handleOpenAddFriendDialog}>
            <PersonAddAlt1Icon sx={{ fontSize: 21 }} />
          </CompactButton>
        </Tooltip>
      ) : (
        <StyledButton
          onClick={handleOpenAddFriendDialog}
          startIcon={<PersonAddAlt1Icon />}
        >
          Add Friend
        </StyledButton>
      )}

      <AddFriendDialog
        isDialogOpen={isDialogOpen}
        closeDialogHandler={handleCloseAddFriendDialog}
      />
    </>
  );
};

export default AddFriendButton;