import { createContext, useContext, useState, useEffect } from "react";

// context is like a radio signal that any component can tune into
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // When the app first loads check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const username = localStorage.getItem("username");

    if (token && username) {
      setUser({ username, token });
    }
    setLoading(false);
  }, []);

  // Called when user successfully logs in
  const login = (token, username) => {
    localStorage.setItem("access_token", token);
    localStorage.setItem("username", username);
    setUser({ username, token });
  };

  // Called when user logs out
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("username");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook - lets any component easily access auth state
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};