import React, { useEffect, useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";

import { useDispatch } from "react-redux";

import InputWithLabel from "../../shared/components/InputWithLabel";
import { validateMail } from "../../shared/utils/validators";
import { sendFriendInvitation } from "../../store/actions/friendsActions";

const AddFriendDialog = ({ isDialogOpen, closeDialogHandler }) => {
  const dispatch = useDispatch();

  const [mail, setMail] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsFormValid(validateMail(mail));
  }, [mail]);

  const getFeedbackMessage = () => {
    if (!feedback) return "";
    if (typeof feedback === "string") return feedback;
    return feedback?.message || "Something went wrong";
  };

  const handleSendInvitation = async () => {
    if (!isFormValid || loading) return;

    try {
      document.activeElement?.blur();

      setLoading(true);
      setFeedback(null);

      const result = await dispatch(
        sendFriendInvitation({ targetEmail: mail }, closeDialogHandler)
      );

      if (result?.success === false) {
        setFeedback(result);
        return;
      }

      setMail("");
    } catch (error) {
      setFeedback({
        success: false,
        message:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to send invitation",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    document.activeElement?.blur();

    setMail("");
    setFeedback(null);
    setLoading(false);
    closeDialogHandler?.();
  };

  return (
    <Dialog
      open={isDialogOpen}
      onClose={handleClose}
      disableRestoreFocus
      keepMounted={false}
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: "420px",
          borderRadius: "22px",
          background: "#0F172A",
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.08)",
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700 }}>Add Friend</DialogTitle>

      <DialogContent>
        <Typography sx={{ mb: 2, color: "#94A3B8", fontSize: "14px" }}>
          Enter your friend&apos;s email
        </Typography>

        {feedback && (
          <Alert severity={feedback?.success ? "success" : "error"} sx={{ mb: 2 }}>
            {getFeedbackMessage()}
          </Alert>
        )}

        <InputWithLabel
          value={mail}
          setValue={setMail}
          label="E-mail address"
          type="text"
          placeholder="Enter e-mail address"
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>

        <Button
          onClick={handleSendInvitation}
          disabled={!isFormValid || loading}
          variant="contained"
          sx={{
            textTransform: "none",
            borderRadius: "12px",
            background: "linear-gradient(135deg,#8B5CF6,#6D28D9)",
          }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : "Send"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddFriendDialog;