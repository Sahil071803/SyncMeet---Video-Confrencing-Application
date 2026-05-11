import React from "react";
import { Alert, Snackbar, Slide } from "@mui/material";
import { connect } from "react-redux";
import { closeAlertMessage } from "../../store/actions/alertActions";

const SlideTransition = (props) => {
  return <Slide {...props} direction="up" />;
};

const AlertNotification = ({
  showAlertMessage,
  alertMessageContent,
  alertMessageSeverity,
  closeAlertMessage,
}) => {
  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    closeAlertMessage();
  };

  return (
    <Snackbar
      open={showAlertMessage}
      onClose={handleClose}
      autoHideDuration={4000}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      TransitionComponent={SlideTransition}
    >
      <Alert
        onClose={handleClose}
        severity={alertMessageSeverity}
        variant="filled"
        sx={{
          width: "100%",
          minWidth: "280px",
          borderRadius: "10px",
          boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
        }}
      >
        {alertMessageContent}
      </Alert>
    </Snackbar>
  );
};

const mapStoreStateToProps = ({ alert }) => {
  return {
    ...alert,
  };
};

export default connect(mapStoreStateToProps, { closeAlertMessage })(
  AlertNotification
);