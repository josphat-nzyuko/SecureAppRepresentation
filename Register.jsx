import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { sanitizeInput, isStrongPassword } from "../utils/sanitize";
import api from "../api/axios";

const Register = () => {
  const navigate = useNavigate();

  // Store what the user types in the form
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  // Store any error or success messages
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Password strength checker results
  const passwordStrength = isStrongPassword(formData.password);

  // Runs every time user types in any field
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Sanitize input as the user types
    // This is our XSS protection on the frontend
    const sanitizedValue = sanitizeInput(value);

    setFormData((prev) => ({
      ...prev,
      [name]: sanitizedValue,
    }));
  };

  // Runs when user clicks the Register button
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Check password strength before sending to backend
    if (!passwordStrength.isValid) {
      setError("Please make sure your password meets all requirements");
      return;
    }

    setLoading(true);

    try {

      const res = fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: sanitizeInput(formData.username),
          email: sanitizeInput(formData.email),
          password: formData.password,
        }),
      });

      // Send registration data to our backend
      // await api.post("/auth/register", {
      //   username: sanitizeInput(formData.username),
      //   email: sanitizeInput(formData.email),
      //   password: formData.password,
      // });

      setSuccess("Account created successfully! Redirecting to login...");

      // Redirect to login after 2 seconds
      setTimeout(() => navigate("/login"), 2000);

    } catch (err) {
      // Show the error message from the backend
      const message = err.response?.data?.detail;
      if (Array.isArray(message)) {
        setError(message[0]?.msg || "Registration failed");
      } else {
        setError(message || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔐 Create Account</h2>
        <p style={styles.subtitle}>SecureApp Registration</p>

        {/* Show error message if any */}
        {error && <div style={styles.error}>{error}</div>}

        {/* Show success message if any */}
        {success && <div style={styles.success}>{success}</div>}

        <form onSubmit={handleSubmit}>
          {/* Username Field */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
              style={styles.input}
              required
            />
          </div>

          {/* Email Field */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              style={styles.input}
              required
            />
          </div>

          {/* Password Field */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              style={styles.input}
              required
            />

            {/* Password strength indicators */}
            {formData.password && (
              <div style={styles.strengthBox}>
                <p style={strengthItem(passwordStrength.hasMinLength)}>
                  {passwordStrength.hasMinLength ? "✅" : "❌"} At least 8 characters
                </p>
                <p style={strengthItem(passwordStrength.hasUpperCase)}>
                  {passwordStrength.hasUpperCase ? "✅" : "❌"} One uppercase letter
                </p>
                <p style={strengthItem(passwordStrength.hasNumber)}>
                  {passwordStrength.hasNumber ? "✅" : "❌"} One number
                </p>
                <p style={strengthItem(passwordStrength.hasSpecialChar)}>
                  {passwordStrength.hasSpecialChar ? "✅" : "❌"} One special character (!@#$%^&*)
                </p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={loading ? styles.buttonDisabled : styles.button}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p style={styles.loginLink}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

// STYLES

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f2f5",
  },
  card: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "420px",
  },
  title: {
    textAlign: "center",
    color: "#1a1a2e",
    marginBottom: "4px",
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: "24px",
    fontSize: "14px",
  },
  fieldGroup: {
    marginBottom: "16px",
  },
  label: {
    display: "block",
    marginBottom: "6px",
    fontWeight: "600",
    color: "#333",
    fontSize: "14px",
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    boxSizing: "border-box",
    outline: "none",
  },
  strengthBox: {
    marginTop: "8px",
    padding: "10px",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#4361ee",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "8px",
  },
  buttonDisabled: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#a0a0a0",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "not-allowed",
    marginTop: "8px",
  },
  error: {
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    padding: "10px 14px",
    borderRadius: "8px",
    marginBottom: "16px",
    fontSize: "14px",
  },
  success: {
    backgroundColor: "#dcfce7",
    color: "#16a34a",
    padding: "10px 14px",
    borderRadius: "8px",
    marginBottom: "16px",
    fontSize: "14px",
  },
  loginLink: {
    textAlign: "center",
    marginTop: "20px",
    fontSize: "14px",
    color: "#666",
  },
  link: {
    color: "#4361ee",
    textDecoration: "none",
    fontWeight: "600",
  },
};

const strengthItem = (passed) => ({
  margin: "4px 0",
  fontSize: "12px",
  color: passed ? "#16a34a" : "#dc2626",
});

export default Register;