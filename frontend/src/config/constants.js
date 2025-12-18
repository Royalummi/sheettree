// API Base URL
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Google API Configuration
export const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || null; // Optional for OAuth-only apps
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// App Configuration
export const APP_NAME = "sheets";
export const APP_VERSION = "1.0.0";

// Form validation rules
export const VALIDATION_RULES = {
  email: {
    required: "Email is required",
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Please enter a valid email address",
    },
  },
  required: {
    required: "This field is required",
  },
  minLength: (length) => ({
    minLength: {
      value: length,
      message: `Minimum length is ${length} characters`,
    },
  }),
  maxLength: (length) => ({
    maxLength: {
      value: length,
      message: `Maximum length is ${length} characters`,
    },
  }),
};

// Available validation types for forms
export const VALIDATION_TYPES = [
  { value: "required", label: "Required" },
  { value: "email", label: "Email" },
  { value: "number", label: "Number" },
  { value: "min_length", label: "Minimum Length" },
  { value: "max_length", label: "Maximum Length" },
  { value: "regex", label: "Custom Pattern" },
];
