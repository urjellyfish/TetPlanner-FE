import { useCallback, useState, useEffect } from "react";
import {
  sendOTP,
  signUpService,
  verifyOTP,
  loginService,
  forgotPasswordService,
  resetPasswordService,
} from "../api/authAPI";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    () => localStorage.getItem("accessToken") || null,
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem("accessToken", token);
    } else {
      localStorage.removeItem("accessToken");
    }
  }, [token]);

  const clearError = useCallback(() => setError(""), []);

  /** Simulate sign-up: stores user info then sends OTP */
  const signUp = useCallback(async ({ name, email, password }) => {
    setLoading(true);
    setError("");
    try {
      await signUpService({ name, email, password });
    } catch (err) {
      setError(err.message || "Sign up failed. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /** Verify the 4-digit OTP; sets user on success */
  const verifyEmail = useCallback(async ({ email, otp }) => {
    setLoading(true);
    setError("");
    try {
      await verifyOTP(email, otp);
      setUser({ email });
    } catch (err) {
      setError(err.message || "Verification failed. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /** Re-generate and re-send OTP */
  const resendOtp = useCallback(async ({ email }) => {
    setLoading(true);
    setError("");
    try {
      await sendOTP(email);
    } catch (err) {
      setError(err.message || "Failed to resend OTP. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async ({ email, password }) => {
    setLoading(true);
    setError("");
    try {
      const response = await loginService({ email, password });
      if (response.success && response.data?.accessToken) {
        setToken(response.data.accessToken);
        setUser({ email });
      }
      return response;
    } catch (err) {
      setError(err.message || "Login failed.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  }, []);

  const forgotPassword = useCallback(async ({ email }) => {
    setLoading(true);
    setError("");
    try {
      const response = await forgotPasswordService({ email });
      return response;
    } catch (err) {
      setError(err.message || "Failed to send reset link.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetPassword = useCallback(
    async ({ token: resetToken, newPassword }) => {
      setLoading(true);
      setError("");
      try {
        const response = await resetPasswordService({
          token: resetToken,
          newPassword,
        });
        return response;
      } catch (err) {
        setError(err.message || "Failed to reset password.");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        error,
        loading,
        signUp,
        verifyEmail,
        resendOtp,
        login,
        logout,
        forgotPassword,
        resetPassword,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
