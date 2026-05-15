import axios from "axios";
import { logout } from "../shared/utils/auth";

const PROD_API = "https://syncmeet-video-confrencing-application.onrender.com/api";

const getBaseUrl = () => {
  try {
    const envUrl = import.meta.env.VITE_API_URL;
    if (envUrl) return envUrl;
    if (typeof window !== "undefined") {
      const host = window.location.hostname;
      if (host.includes("vercel.app")) return PROD_API;
      return `${window.location.protocol}//${host}:5002/api`;
    }
  } catch {}
  return PROD_API;
};

const API_URL = getBaseUrl();

const API = axios.create({
  baseURL: API_URL,
  timeout: 60000,
});

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

API.interceptors.request.use(
  (req) => {
    const token = getToken();

    console.log(
      "🌐 API REQUEST:",
      `${API_URL}${req.url}`
    );

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
  },
  (error) => Promise.reject(error)
);

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

export const sendFriendInvitation = async (data) => {
  try {
    return await API.post(
      "/friend-invitation/invite",
      data
    );
  } catch (exception) {
    return handleApiError(exception);
  }
};

export const acceptFriendInvitation = async (data) => {
  try {
    return await API.post(
      "/friend-invitation/accept",
      data
    );
  } catch (exception) {
    return handleApiError(exception);
  }
};

export const rejectFriendInvitation = async (data) => {
  try {
    return await API.post(
      "/friend-invitation/reject",
      data
    );
  } catch (exception) {
    return handleApiError(exception);
  }
};

export const acceptInvitationByToken = async (data) => {
  try {
    return await API.post(
      "/friend-invitation/accept-token",
      data
    );
  } catch (exception) {
    return handleApiError(exception);
  }
};

export const removeFriend = async (friendId) => {
  try {
    return await API.delete(
      `/friend-invitation/remove/${friendId}`
    );
  } catch (exception) {
    return handleApiError(exception);
  }
};

export default API;