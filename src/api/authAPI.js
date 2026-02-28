import { api } from "../config/api";

// POST /api/auth/register
export async function signUpService({ name, email, password }) {
  try {
    const response = await api.post("/auth/register", {
      fullName: name,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Sign up failed. Please try again.",
    );
  }
}

//POST /api/auth/verify-email

export async function verifyOTP(email, otp) {
  try {
    const response = await api.post("/auth/verify-email", {
      email,
      code: otp,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Invalid or expired OTP. Please try again.",
    );
  }
}

// POST /api/auth/resend-otp
export async function sendOTP(email) {
  try {
    const response = await api.post("/auth/resend-otp", { email });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Failed to resend OTP. Please try again.",
    );
  }
}

// POST /api/auth/login
export async function loginService({ email, password }) {
  try {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Login failed. Please try again.",
    );
  }
}

// POST /api/auth/forgot-password
export async function forgotPasswordService({ email }) {
  try {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Failed to send reset link. Please try again.",
    );
  }
}

// POST /api/auth/reset-password
export async function resetPasswordService({ token, newPassword }) {
  try {
    const response = await api.post(`/auth/reset-password?token=${token}`, {
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Failed to reset password. Please try again.",
    );
  }
}
