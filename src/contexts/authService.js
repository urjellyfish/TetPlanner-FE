// ─── Constants ───────────────────────────────────────────────────────────────
const OTP_KEY        = "auth_otp";
const OTP_EXPIRY_KEY = "auth_otp_expiry";
const OTP_TTL_MS     = 5 * 60 * 1000; // 5 minutes

// ─── Helpers ─────────────────────────────────────────────────────────────────
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Generate a cryptographically-random 4-digit OTP string */
export function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// ─── OTP Storage ─────────────────────────────────────────────────────────────
export function clearOTP() {
  localStorage.removeItem(OTP_KEY);
  localStorage.removeItem(OTP_EXPIRY_KEY);
}

function storeOTP(email, otp) {
  localStorage.setItem(OTP_KEY, JSON.stringify({ email, otp }));
  localStorage.setItem(OTP_EXPIRY_KEY, (Date.now() + OTP_TTL_MS).toString());
}

// ─── Service Functions (async – easy to swap with axios later) ───────────────

/**
 * Simulates POST /auth/signup
 * In production: replace body with real API call.
 */
export async function signUpService({ name, email, password }) { // eslint-disable-line no-unused-vars
  await delay(600);
  const otp = generateOTP();
  storeOTP(email, otp);
  // TODO: replace with: await axios.post("/auth/signup", { name, email, password })
  console.info(`[DEV] OTP for ${email}: ${otp}`);
  return { success: true };
}

/**
 * Simulates POST /auth/resend-otp
 * In production: replace body with real API call.
 */
export async function sendOTP(email) {
  await delay(600);
  const otp = generateOTP();
  storeOTP(email, otp);
  // TODO: replace with: await axios.post("/auth/resend-otp", { email })
  console.info(`[DEV] New OTP for ${email}: ${otp}`);
  return { success: true };
}

/**
 * Simulates POST /auth/verify-email
 * In production: replace body with real API call.
 */
export async function verifyOTP(email, otp) {
  await delay(600);
  // TODO: replace with: await axios.post("/auth/verify-email", { email, otp })

  const raw    = localStorage.getItem(OTP_KEY);
  const expiry = parseInt(localStorage.getItem(OTP_EXPIRY_KEY) || "0", 10);
  const stored = raw ? JSON.parse(raw) : null;

  if (!stored) {
    throw new Error("No OTP found. Please request a new one.");
  }
  if (Date.now() > expiry) {
    clearOTP();
    throw new Error("OTP has expired. Please request a new one.");
  }
  if (stored.email !== email || stored.otp !== otp) {
    throw new Error("Invalid OTP. Please try again.");
  }

  clearOTP();
  return { success: true };
}
