import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // While checking if user is logged in show nothing
  if (loading) {
    return <div>Loading...</div>;
  }

  // If user is not logged in redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user is logged in show the actual page
  return children;
};

export default ProtectedRoute;