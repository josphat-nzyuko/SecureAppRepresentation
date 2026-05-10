import axios from "axios";

// Create an axios instance with our backend URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// REQUEST INTERCEPTOR
// This runs automatically before every request is sent
api.interceptors.request.use(
  (config) => {
    // Get the token from memory
    const token = localStorage.getItem("access_token");

    // If we have a token attach it to the request
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR
// This runs automatically on every response we receive
api.interceptors.response.use(
  (response) => {
    // Response is good - just return it
    return response;
  },
  (error) => {
    // If a 401 - token expired or invalid
    // Log the user out automatically
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("username");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;