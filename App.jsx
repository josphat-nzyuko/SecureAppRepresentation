import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

const App = () => {
  return (
    // AuthProvider wraps everything so all pages
    // can access the login state
    <AuthProvider>

      {/* BrowserRouter enables navigation between pages */}
      <BrowserRouter>
        <Routes>

          {/* Default route - redirect to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public routes - anyone can visit these */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected route - only logged in users can visit */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch all unknown routes and redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
      </BrowserRouter>

    </AuthProvider>
  );
};

export default App;