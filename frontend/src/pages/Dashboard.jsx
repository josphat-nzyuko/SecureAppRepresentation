import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Store the user details from the backend
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // When the dashboard loads fetch the current user details
  // This calls our protected /auth/me endpoint
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await api.get("/auth/me");
        setUserDetails(response.data);
      } catch (err) {
        setError("Failed to load user details");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  // Handles logout button click
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>

      {/* ── TOP NAVBAR ── */}
      <nav style={styles.navbar}>
        <div style={styles.navBrand}>🔐 SecureApp</div>
        <div style={styles.navRight}>
          <span style={styles.navUsername}>
            👤 {user?.username}
          </span>
          <button onClick={handleLogout} style={styles.logoutButton}>
            Logout
          </button>
        </div>
      </nav>

      {/* ── MAIN CONTENT ── */}
      <div style={styles.content}>
        <h1 style={styles.welcomeTitle}>
          Welcome back, {user?.username}! 👋
        </h1>
        <p style={styles.welcomeSubtitle}>
          You are securely logged in to SecureApp
        </p>

        {/* Show error if any */}
        {error && <div style={styles.error}>{error}</div>}

        {/* ── USER DETAILS CARD ── */}
        {userDetails && (
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>👤 Your Account Details</h3>
            <div style={styles.detailsGrid}>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>User ID</span>
                <span style={styles.detailValue}>#{userDetails.id}</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Username</span>
                <span style={styles.detailValue}>{userDetails.username}</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Email</span>
                <span style={styles.detailValue}>{userDetails.email}</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Account Status</span>
                <span style={styles.activeTag}>
                  {userDetails.is_active ? "✅ Active" : "❌ Inactive"}
                </span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Role</span>
                <span style={styles.detailValue}>
                  {userDetails.is_admin ? "👑 Admin" : "👤 Regular User"}
                </span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Member Since</span>
                <span style={styles.detailValue}>
                  {new Date(userDetails.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ── SECURITY STATUS CARD ── */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>🛡️ Security Features Active</h3>
          <div style={styles.securityGrid}>
            <div style={styles.securityItem}>
              <span style={styles.securityIcon}>✅</span>
              <div>
                <p style={styles.securityName}>JWT Authentication</p>
                <p style={styles.securityDesc}>
                  Your session is secured with a signed token
                </p>
              </div>
            </div>
            <div style={styles.securityItem}>
              <span style={styles.securityIcon}>✅</span>
              <div>
                <p style={styles.securityName}>XSS Protection</p>
                <p style={styles.securityDesc}>
                  All inputs are sanitized with DOMPurify
                </p>
              </div>
            </div>
            <div style={styles.securityItem}>
              <span style={styles.securityIcon}>✅</span>
              <div>
                <p style={styles.securityName}>Security Headers</p>
                <p style={styles.securityDesc}>
                  CSP, HSTS and X-Frame-Options are active
                </p>
              </div>
            </div>
            <div style={styles.securityItem}>
              <span style={styles.securityIcon}>✅</span>
              <div>
                <p style={styles.securityName}>Password Hashing</p>
                <p style={styles.securityDesc}>
                  Your password is stored with bcrypt
                </p>
              </div>
            </div>
            <div style={styles.securityItem}>
              <span style={styles.securityIcon}>✅</span>
              <div>
                <p style={styles.securityName}>Input Validation</p>
                <p style={styles.securityDesc}>
                  All data is validated before reaching the database
                </p>
              </div>
            </div>
            <div style={styles.securityItem}>
              <span style={styles.securityIcon}>✅</span>
              <div>
                <p style={styles.securityName}>CORS Protection</p>
                <p style={styles.securityDesc}>
                  Only trusted origins can access this API
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// STYLES

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f0f2f5",
  },
  loadingContainer: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  navbar: {
    backgroundColor: "#1a1a2e",
    padding: "16px 32px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navBrand: {
    color: "white",
    fontSize: "20px",
    fontWeight: "700",
  },
  navRight: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  navUsername: {
    color: "#a0a0b0",
    fontSize: "14px",
  },
  logoutButton: {
    backgroundColor: "#e63946",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
  },
  content: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "40px 20px",
  },
  welcomeTitle: {
    color: "#1a1a2e",
    fontSize: "28px",
    marginBottom: "8px",
  },
  welcomeSubtitle: {
    color: "#666",
    marginBottom: "32px",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "28px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
    marginBottom: "24px",
  },
  cardTitle: {
    color: "#1a1a2e",
    marginBottom: "20px",
    fontSize: "18px",
  },
  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
  },
  detailItem: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  detailLabel: {
    fontSize: "12px",
    color: "#888",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  detailValue: {
    fontSize: "15px",
    color: "#1a1a2e",
    fontWeight: "500",
  },
  activeTag: {
    fontSize: "14px",
    color: "#16a34a",
    fontWeight: "600",
  },
  securityGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "16px",
  },
  securityItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    padding: "12px",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
  },
  securityIcon: {
    fontSize: "20px",
  },
  securityName: {
    fontWeight: "600",
    color: "#1a1a2e",
    margin: "0 0 4px 0",
    fontSize: "14px",
  },
  securityDesc: {
    color: "#666",
    margin: "0",
    fontSize: "12px",
  },
  error: {
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    padding: "10px 14px",
    borderRadius: "8px",
    marginBottom: "16px",
    fontSize: "14px",
  },
};

export default Dashboard;