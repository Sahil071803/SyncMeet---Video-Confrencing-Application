import axios from "axios";
import { logout } from "../shared/utils/auth";

// ==========================================
// API BASE URL
// ==========================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5002/api";

// ==========================================
// AXIOS INSTANCE
// ==========================================

const API = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

// ==========================================
// GET TOKEN
// ==========================================

const getToken = () => {
  try {
    const user = JSON.parse(
      localStorage.getItem("user")
    );

    return (
      user?.token ||
      localStorage.getItem("token") ||
      null
    );
  } catch {
    return localStorage.getItem("token") || null;
  }
};

// ==========================================
// REQUEST INTERCEPTOR
// ==========================================

API.interceptors.request.use(
  (req) => {
    const token = getToken();

    const fullUrl = `${API_URL}${req.url}`;

    console.log("🌐 API REQUEST:", fullUrl);

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
  },

  (error) => Promise.reject(error)
);

// ==========================================
// RESPONSE INTERCEPTOR
// ==========================================

API.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error?.response?.status;

    const message =
      error?.response?.data?.message ||
      error?.response?.data ||
      error?.message ||
      "Something went wrong";

    console.log("❌ API ERROR:", {
      status,
      message,
      url: error?.config?.url,
    });

    if (status === 401 || status === 403) {
      logout();
    }

    return Promise.reject(error);
  }
);

// ==========================================
// ERROR HANDLER
// ==========================================

const handleApiError = (exception) => {
  return {
    error: true,
    exception,
    status: exception?.response?.status,
    message:
      exception?.response?.data?.message ||
      exception?.response?.data ||
      exception?.message ||
      "Something went wrong",
  };
};

// ==========================================
// AUTH
// ==========================================

export const login = async (data) => {
  try {
    return await API.post("/auth/login", data);
  } catch (exception) {
    return handleApiError(exception);
  }
};

export const register = async (data) => {
  try {
    return await API.post("/auth/register", data);
  } catch (exception) {
    return handleApiError(exception);
  }
};

// ==========================================
// FRIEND INVITATIONS
// ==========================================

export const sendFriendInvitation = async (
  data
) => {
  try {
    return await API.post(
      "/friend-invitation/invite",
      data
    );
  } catch (exception) {
    return handleApiError(exception);
  }
};

export const acceptFriendInvitation = async (
  data
) => {
  try {
    return await API.post(
      "/friend-invitation/accept",
      data
    );
  } catch (exception) {
    return handleApiError(exception);
  }
};

export const rejectFriendInvitation = async (
  data
) => {
  try {
    return await API.post(
      "/friend-invitation/reject",
      data
    );
  } catch (exception) {
    return handleApiError(exception);
  }
};

export const acceptInvitationByToken = async (
  data
) => {
  try {
    return await API.post(
      "/friend-invitation/accept-token",
      data
    );
  } catch (exception) {
    return handleApiError(exception);
  }
};

// ==========================================
// REMOVE FRIEND
// ==========================================

export const removeFriend = async (
  friendId
) => {
  try {
    return await API.delete(
      `/friend-invitation/remove/${friendId}`
    );
  } catch (exception) {
    return handleApiError(exception);
  }
};

// ==========================================
// EXPORT
// ==========================================

export default API;