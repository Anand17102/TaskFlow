import axios from "axios";
import api from "./axios";

const API_BASE_URL = "http://127.0.0.1:8000/api/";

export const loginUser = async (email, password) => {
  const response = await axios.post(`${API_BASE_URL}auth/login/`, {
    email,
    password,
  });
  const { access, refresh } = response.data;

  localStorage.setItem("accessToken", access);
  localStorage.setItem("refreshToken", refresh);
  return response.data;
};

export const RegisterUser = async (username, email, password) => {
  const response = await axios.post(`${API_BASE_URL}auth/register/`, {
    username,
    email,
    password,
  });
  return response.data;
};

export const logoutUser = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  try {
    if (refreshToken) {
      await api.post("auth/logout/", {
        refresh: refreshToken,
      });
    }
  } catch (error) {
    console.error("Server-side logout failed:", error);
  } finally {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
};

export const getUserProfile = async () => {
  const response = await api.get("auth/profile/");
  return response.data;
};

export const updateUserProfile = async (profileData) => {
  const response = await api.patch("auth/profile/", profileData);
  return response.data;
};
