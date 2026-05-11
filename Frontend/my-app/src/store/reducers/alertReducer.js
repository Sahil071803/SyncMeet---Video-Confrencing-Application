import { alertActions } from "../actions/alertActions";

const initState = {
  showAlertMessage: false,
  alertMessageContent: "",
  alertMessageSeverity: "info",
};

const alertReducer = (state = initState, action) => {
  switch (action.type) {
    case alertActions.OPEN_ALERT_MESSAGE:
      return {
        ...state,
        showAlertMessage: true,
        alertMessageContent: action.payload.message,
        alertMessageSeverity: action.payload.severity,
      };

    case alertActions.CLOSE_ALERT_MESSAGE:
      return {
        ...state,
        showAlertMessage: false,
        alertMessageContent: "",
        alertMessageSeverity: "info",
      };

    default:
      return state;
  }
};

export default alertReducer;