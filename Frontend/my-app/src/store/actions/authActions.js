import * as api from "../../api/api";
import { openAlertMessage } from "./alertActions";
import { jwtDecode } from "jwt-decode";

export const authActions = {
  SET_USER_DETAILS: "AUTH.SET_USER_DETAILS",
};

// ======================================
// ACTIONS
// ======================================

export const getActions = (dispatch) => {
  return {
    login: (userDetails, navigate) =>
      dispatch(login(userDetails, navigate)),

    register: (userDetails, navigate) =>
      dispatch(register(userDetails, navigate)),
  };
};

// ======================================
// SET USER DETAILS
// ======================================

const setUserDetails = (userDetails) => ({
  type: authActions.SET_USER_DETAILS,
  payload: userDetails,
});

// ======================================
// SAFE USER EXTRACTOR (FIXED)
// ======================================

const extractUserData = (responseData) => {
  if (!responseData) return null;

  console.log("🔥 RAW RESPONSE:", responseData);

  const data = responseData?.data || responseData;

  let user =
    data?.userDetails ||
    data?.user ||
    data ||
    {};

  let token =
    data?.token ||
    responseData?.token ||
    null;

  // ======================================
  // NORMALIZE USER ID FIRST
  // ======================================

  const normalizedUser = {
    ...user,
    userId: user?._id || user?.id || user?.userId || null,
  };

  // ======================================
  // JWT FALLBACK (IMPORTANT FIX)
  // ======================================

  if (token) {
    try {
      const decoded = jwtDecode(token);

      console.log("🔥 DECODED TOKEN:", decoded);

      normalizedUser.userId =
        decoded.userId ||
        decoded._id ||
        decoded.id ||
        normalizedUser.userId;
    } catch (err) {
      console.log("❌ JWT decode failed:", err);
    }
  }

  return {
    ...normalizedUser,
    token,
  };
};

// ======================================
// SHARED AUTH HANDLER
// ======================================

const handleAuthSuccess = (response, dispatch, navigate, successMsg) => {
  const userData = extractUserData(response?.data);

  console.log("🔥 FINAL USER DATA:", userData);

  if (!userData?.userId) {
    console.log("❌ USER ID MISSING");
    dispatch(openAlertMessage("User ID missing from backend response."));
    return;
  }

  localStorage.setItem("user", JSON.stringify(userData));
  dispatch(setUserDetails(userData));

  console.log("✅ AUTH SUCCESS");
  navigate("/dashboard");
};

// ======================================
// LOGIN
// ======================================

const login = (userDetails, navigate) => {
  return async (dispatch) => {
    try {
      const response = await api.login(userDetails);

      console.log("🔥 LOGIN RESPONSE:", response);

      if (response.error) {
        dispatch(openAlertMessage("Login failed. Check credentials."));
        return;
      }

      handleAuthSuccess(response, dispatch, navigate, "Login successful");
    } catch (err) {
      console.log("❌ LOGIN ERROR:", err);
      dispatch(openAlertMessage("Something went wrong during login."));
    }
  };
};

// ======================================
// REGISTER
// ======================================

const register = (userDetails, navigate) => {
  return async (dispatch) => {
    try {
      const response = await api.register(userDetails);

      console.log("🔥 REGISTER RESPONSE:", response);

      if (response.error) {
        dispatch(openAlertMessage("Registration failed. Try again."));
        return;
      }

      handleAuthSuccess(response, dispatch, navigate, "Registration successful");
    } catch (err) {
      console.log("❌ REGISTER ERROR:", err);
      dispatch(openAlertMessage("Something went wrong during registration."));
    }
  };
};