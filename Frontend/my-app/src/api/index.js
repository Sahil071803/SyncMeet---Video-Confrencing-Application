// import axios from "axios";
// import { logout } from "../shared/utils/auth";

// // Axios instance
// const apiClient = axios.create({
//   baseURL: "http://localhost:5002/api",
//   timeout: 5000,
// });

// // 🔐 Request Interceptor (Token attach karega automatically)
// apiClient.interceptors.request.use(
//   (config) => {
//     const userDetails = localStorage.getItem("user");

//     if (userDetails) {
//       const token = JSON.parse(userDetails).token;

//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // 🚨 Response Error Handler (Auto logout on 401/403)
// const checkResponseCode = (exception) => {
//   const responseCode = exception?.response?.status;

//   if (responseCode === 401 || responseCode === 403) {
//     logout();
//   }
// };

// // ========================
// // 🌍 PUBLIC ROUTES
// // ========================

// export const login = async (data) => {
//   try {
//     return await apiClient.post("/auth/login", data);
//   } catch (exception) {
//     checkResponseCode(exception);
//     return {
//       error: true,
//       exception,
//     };
//   }
// };

// export const register = async (data) => {
//   try {
//     return await apiClient.post("/auth/register", data);
//   } catch (exception) {
//     checkResponseCode(exception);
//     return {
//       error: true,
//       exception,
//     };
//   }
// };

// // ========================
// // 🔐 SECURE ROUTES (Example)
// // ========================

// export const getUserProfile = async () => {
//   try {
//     return await apiClient.get("/auth/user-profile");
//   } catch (exception) {
//     checkResponseCode(exception);
//     return {
//       error: true,
//       exception,
//     };
//   }
// };
import axios from "axios";

// ==========================================
// AXIOS INSTANCE
// ==========================================

const API = axios.create({
  baseURL: "http://localhost:5002/api",
});

// ==========================================
// AUTH INTERCEPTOR
// ==========================================

API.interceptors.request.use((req) => {
  try {
    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if (user?.token) {
      req.headers.Authorization = `Bearer ${user.token}`;
    }
  } catch (error) {
    console.log(
      "Token parsing error:",
      error
    );
  }

  return req;
});

// ==========================================
// SEND FRIEND INVITATION
// ==========================================

export const sendFriendInvitation =
  async (data) => {
    try {
      const response = await API.post(
        "/friend-invitation/invite",
        data
      );

      return response.data;
    } catch (exception) {
      return {
        error: true,
        exception,
      };
    }
  };

// ==========================================
// ACCEPT FRIEND INVITATION
// ==========================================

export const acceptFriendInvitation =
  async (data) => {
    try {
      const response = await API.post(
        "/friend-invitation/accept",
        data
      );

      return response.data;
    } catch (exception) {
      return {
        error: true,
        exception,
      };
    }
  };

// ==========================================
// REJECT FRIEND INVITATION
// ==========================================

export const rejectFriendInvitation =
  async (data) => {
    try {
      const response = await API.post(
        "/friend-invitation/reject",
        data
      );

      return response.data;
    } catch (exception) {
      return {
        error: true,
        exception,
      };
    }
  };

// ==========================================
// REMOVE FRIEND
// ==========================================

export const removeFriend = async (
  friendId
) => {
  try {

    console.log(
      "Removing friend:",
      friendId
    );

    const response =
      await API.delete(
        `/friend-invitation/remove/${friendId}`
      );

    return response.data;

  } catch (exception) {

    console.log(
      "REMOVE FRIEND ERROR:",
      exception
    );

    return {
      error: true,
      exception,
    };
  }
};

// ==========================================
// EXPORT API INSTANCE
// ==========================================

export default API;