import React, { useEffect, useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

import { useDispatch } from "react-redux";

import InputWithLabel from "../../shared/components/InputWithLabel";

import { validateMail } from "../../shared/utils/validators";

import { sendFriendInvitation } from "../../store/actions/friendsActions";

const AddFriendDialog = ({
  isDialogOpen,
  closeDialogHandler,
}) => {
  const dispatch = useDispatch();

  const [mail, setMail] = useState("");

  const [isFormValid, setIsFormValid] =
    useState(false);

  useEffect(() => {
    setIsFormValid(validateMail(mail));
  }, [mail]);

  const handleSendInvitation = () => {
    if (!isFormValid) return;

    dispatch(
      sendFriendInvitation(
        { targetEmail: mail },
        closeDialogHandler
      )
    );

    setMail("");
  };

  const handleClose = () => {
    setMail("");
    closeDialogHandler();
  };

  return (
    <Dialog
      open={isDialogOpen}
      onClose={handleClose}
    >
      <DialogTitle>Add Friend</DialogTitle>

      <DialogContent>
        <Typography
          sx={{
            mb: 2,
            color: "#555",
          }}
        >
          Enter your friend&apos;s email
        </Typography>

        <InputWithLabel
          value={mail}
          setValue={setMail}
          label="E-mail address"
          type="text"
          placeholder="Enter e-mail address"
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>
          Cancel
        </Button>

        <Button
          onClick={handleSendInvitation}
          disabled={!isFormValid}
        >
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddFriendDialog;