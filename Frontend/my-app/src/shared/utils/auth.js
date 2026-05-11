import apiClient from "../../api/api";

// LOGIN
export const login = async (data) => {
  try {
    const response = await apiClient.post("/auth/login", data);

    if (response?.data?.userDetails) {
      localStorage.setItem("user", JSON.stringify(response.data.userDetails));
    }

    return response;
  } catch (exception) {
    return {
      error: true,
      exception,
    };
  }
};

// REGISTER
export const register = async (data) => {
  try {
    const response = await apiClient.post("/auth/register", data);
    return response;
  } catch (exception) {
    return {
      error: true,
      exception,
    };
  }
};

// LOGOUT
export const logout = () => {
  localStorage.removeItem("user");
  window.location.pathname = "/login";
};