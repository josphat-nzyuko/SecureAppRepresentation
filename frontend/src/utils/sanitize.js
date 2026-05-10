import DOMPurify from "dompurify";

// cleans text input by removing any dangerous HTML or scripts
// for example if someone types <script>alert('hacked')</script>
export const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;
  return DOMPurify.sanitize(input.trim());
};

// Validates email format on the frontend
// before even sending to the backend
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// checks password strength on the frontend
// Follows the same rules as backend schema
export const isStrongPassword = (password) => {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*]/.test(password);
  const hasMinLength = password.length >= 8;

  return {
    isValid: hasUpperCase && hasNumber && hasSpecialChar && hasMinLength,
    hasUpperCase,
    hasNumber,
    hasSpecialChar,
    hasMinLength,
  };
};