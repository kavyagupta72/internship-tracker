import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://internship-tracker-1-q568.onrender.com";

export const apiUrl = (path) => `${API_BASE_URL}${path}`;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000
});

