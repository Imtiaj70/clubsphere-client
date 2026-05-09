import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/shared/LoadingSpinner";

// Any logged-in user
export const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
};

// Only admin
export const AdminRoute = ({ children }) => {
  const { user, dbUser, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (dbUser?.role !== "admin") return <Navigate to="/" replace />;
  return children;
};

// Only clubManager (or admin)
export const ManagerRoute = ({ children }) => {
  const { user, dbUser, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (dbUser?.role !== "clubManager" && dbUser?.role !== "admin")
    return <Navigate to="/" replace />;
  return children;
};
