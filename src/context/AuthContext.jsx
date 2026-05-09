import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase/firebase.config";
import axiosInstance from "../api/axiosInstance";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [dbUser, setDbUser] = useState(null); // full user doc with role
  const [loading, setLoading] = useState(true);

  // Register with email/password
  const register = async (name, email, password, photoURL = "") => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: name, photoURL });
    // Save to MongoDB
    await axiosInstance.post("/api/auth/register", { name, email, photoURL });
    return result;
  };

  // Login with email/password
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Google login
  const googleLogin = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const { displayName, email, photoURL } = result.user;
    // Upsert user in MongoDB (safe if already exists)
    await axiosInstance.post("/api/auth/register", {
      name: displayName,
      email,
      photoURL,
    });
    return result;
  };

  // Logout
  const logout = () => signOut(auth);

  // Fetch DB user (role etc.) whenever Firebase user changes
  const fetchDbUser = async (firebaseUser) => {
    if (!firebaseUser) {
      setDbUser(null);
      return;
    }
    try {
      const res = await axiosInstance.get("/api/auth/me");
      setDbUser(res.data);
    } catch {
      setDbUser(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      await fetchDbUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    user,
    dbUser,
    loading,
    register,
    login,
    googleLogin,
    logout,
    refetchDbUser: () => fetchDbUser(user),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
