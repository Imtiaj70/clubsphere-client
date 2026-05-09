import axios from "axios";
import { auth } from "../firebase/firebase.config";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://clubsphere-server-seven.vercel.app/",
});

// Attach Firebase ID token to every request automatically
axiosInstance.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
