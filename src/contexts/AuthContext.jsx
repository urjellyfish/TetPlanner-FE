import { createContext, useCallback, useState } from "react";
import { sendOTP, signUpService, verifyOTP } from "./authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

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

  return (
    <AuthContext.Provider
      value={{ user, error, loading, signUp, verifyEmail, resendOtp, clearError }}
    >
      {children}
    </AuthContext.Provider>
  );
}
