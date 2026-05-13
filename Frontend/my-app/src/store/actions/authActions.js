import * as api from "../../api/api";
import { openAlertMessage } from "./alertActions";
import { jwtDecode } from "jwt-decode";

export const authActions = {
  SET_USER_DETAILS: "AUTH.SET_USER_DETAILS",
};

export const getActions = (dispatch) => {
  return {
    login: (userDetails, navigate) => dispatch(login(userDetails, navigate)),
    register: (userDetails, navigate) =>
      dispatch(register(userDetails, navigate)),
  };
};

const setUserDetails = (userDetails) => ({
  type: authActions.SET_USER_DETAILS,
  payload: userDetails,
});

const getErrorMessage = (error, fallback = "Something went wrong") => {
  const data =
    error?.response?.data ||
    error?.exception?.response?.data ||
    error?.data;

  if (typeof data === "string") return data;
  if (data?.message) return data.message;
  if (error?.message) return error.message;

  return fallback;
};

const extractUserData = (response) => {
  if (!response) return null;

  console.log("🔥 RAW AUTH RESPONSE:", response);

  const root = response?.data || response;

  const token =
    root?.token ||
    root?.data?.token ||
    root?.user?.token ||
    root?.userDetails?.token ||
    null;

  const user =
    root?.userDetails ||
    root?.user ||
    root?.data?.userDetails ||
    root?.data?.user ||
    root?.data ||
    root;

  let decodedUserId = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);

      console.log("🔥 DECODED TOKEN:", decoded);

      decodedUserId =
        decoded?.userId ||
        decoded?._id ||
        decoded?.id ||
        decoded?.sub ||
        null;
    } catch (error) {
      console.log("❌ JWT decode failed:", error);
    }
  }

  const userId =
    user?._id ||
    user?.id ||
    user?.userId ||
    root?._id ||
    root?.id ||
    root?.userId ||
    root?.data?._id ||
    root?.data?.id ||
    root?.data?.userId ||
    decodedUserId ||
    null;

  if (!userId) {
    console.log("❌ USER ID MISSING IN RESPONSE:", response);
    return null;
  }

  return {
    ...user,
    _id: userId,
    id: userId,
    userId,
    token,
  };
};

const handleAuthSuccess = (response, dispatch, navigate, successMessage) => {
  const userData = extractUserData(response);

  console.log("🔥 FINAL USER DATA:", userData);

  if (!userData?.userId) {
    dispatch(openAlertMessage("User ID missing from backend response."));
    return;
  }

  localStorage.setItem("user", JSON.stringify(userData));

  if (userData.token) {
    localStorage.setItem("token", userData.token);
  }

  dispatch(setUserDetails(userData));
  dispatch(openAlertMessage(successMessage));

  navigate("/welcome", { replace: true });
};

const login = (userDetails, navigate) => {
  return async (dispatch) => {
    try {
      const response = await api.login(userDetails);

      console.log("🔥 LOGIN RESPONSE:", response);

      if (response?.error) {
        dispatch(
          openAlertMessage(
            getErrorMessage(response, "Login failed. Check credentials.")
          )
        );
        return;
      }

      handleAuthSuccess(response, dispatch, navigate, "Login successful");
    } catch (error) {
      console.log("❌ LOGIN ERROR:", error);

      dispatch(
        openAlertMessage(
          getErrorMessage(error, "Something went wrong during login.")
        )
      );
    }
  };
};

const register = (userDetails, navigate) => {
  return async (dispatch) => {
    try {
      const response = await api.register(userDetails);

      console.log("🔥 REGISTER RESPONSE:", response);

      if (response?.error) {
        dispatch(
          openAlertMessage(
            getErrorMessage(response, "Registration failed. Try again.")
          )
        );
        return;
      }

      handleAuthSuccess(response, dispatch, navigate, "Registration successful");
    } catch (error) {
      console.log("❌ REGISTER ERROR:", error);

      dispatch(
        openAlertMessage(
          getErrorMessage(error, "Something went wrong during registration.")
        )
      );
    }
  };
};