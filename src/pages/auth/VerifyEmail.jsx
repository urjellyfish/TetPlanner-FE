import CoverImage from "../../assets/Cover.jpg";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import FlowerLogo from "../../components/FlowerLogo.jsx";
import { BiLoaderAlt } from "react-icons/bi";


function VerifyEmail() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { verifyEmail, resendOtp, error: authError, clearError } = useAuth();

  const email = location.state?.email || "your email";

  const [code, setCode]             = useState(["", "", "", ""]);
  const inputsRef                   = useRef([]);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [formError, setFormError]   = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending]   = useState(false);

  // Auto-focus ô đầu tiên
  useEffect(() => { inputsRef.current[0]?.focus(); }, []);

  // Đếm ngược
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft((p) => Math.max(p - 1, 0)), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  // ── OTP input handlers ──────────────────────────────────────────────────
  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...code];
    next[index] = value;
    setCode(next);
    setFormError("");
    clearError();
    if (value && index < 3) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (!pasted) return;
    const next = ["", "", "", ""];
    pasted.split("").forEach((ch, i) => { next[i] = ch; });
    setCode(next);
    inputsRef.current[Math.min(pasted.length, 3)]?.focus();
  };

  // ── Submit ──────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    const otp = code.join("");
    if (otp.length < 4) {
      setFormError("Vui lòng nhập đủ 4 chữ số.");
      return;
    }
    setIsSubmitting(true);
    clearError();
    try {
      await verifyEmail({ email, otp });
      navigate("/");           // → về trang chủ sau khi xác thực thành công
    } catch {
      // authError đã set trong context
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Resend ──────────────────────────────────────────────────────────────
  const handleResend = async () => {
    setIsResending(true);
    clearError();
    try {
      await resendOtp({ email });
      setSecondsLeft(60);
      setCode(["", "", "", ""]);
      setFormError("");
      setTimeout(() => inputsRef.current[0]?.focus(), 50);
    } catch {
      // authError hiển thị bên dưới
    } finally {
      setIsResending(false);
    }
  };

  // ── Format timer ────────────────────────────────────────────────────────
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const formattedTime = `0${mins}:${secs.toString().padStart(2, "0")}`;

  const displayError = formError || authError;

  return (
    <div className="w-screen h-screen bg-[#f8fafc] flex overflow-hidden">
      {/* Left cover */}
      <div
        className="hidden lg:block flex-shrink-0 w-[53%] h-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${CoverImage})` }}
      />

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-8 overflow-y-auto">
        <div className="w-full max-w-[400px] py-10">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <FlowerLogo />

            <div className="font-extrabold text-[22px] leading-tight tracking-tight">
              <span className="text-[#1e293b]">Tet Planner </span>
              <span className="text-[#e11d48]">Pro</span>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-[18px] font-bold text-[#1e293b] font-['Plus_Jakarta_Sans']">
              Verify your email address
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col items-center gap-8">
            {/* Description */}
            <p className="text-[13px] leading-[20px] text-center text-[#6b7280] max-w-[320px] font-['Plus_Jakarta_Sans']">
              We sent you a 4 digit code to verify your email address{" "}
              <span className="font-semibold text-[#111827]">({email})</span>. Enter it in the
              field below.
            </p>

            {/* OTP boxes */}
            <div className="flex gap-4" onPaste={handlePaste}>
              {code.map((value, index) => (
                <input
                  key={index}
                  ref={(el) => { inputsRef.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={value}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`w-[56px] h-[56px] rounded-[8px] border-2 text-center text-[24px] font-bold text-[#111827] outline-none transition-all font-['Plus_Jakarta_Sans']
                    ${value
                      ? "border-[#e11d48] bg-[#fff5f7]"
                      : "border-[#e5e7eb] bg-white"
                    }
                    focus:border-[#e11d48] focus:ring-2 focus:ring-[#e11d48]/20`}
                />
              ))}
            </div>

            {/* Error */}
            {displayError && (
              <p className="text-[12px] text-red-500 -mt-4 text-center font-['Plus_Jakarta_Sans']">
                {displayError}
              </p>
            )}

            {/* Resend + timer */}
            <div className="text-[12px] text-center text-[#6b7280] font-['Plus_Jakarta_Sans'] flex flex-col gap-1">
              <p>
                Didn&apos;t get the code?{" "}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={secondsLeft > 0 || isResending}
                  className="text-[#e11d48] font-semibold disabled:opacity-40 hover:underline disabled:no-underline"
                >
                  {isResending ? "Sending..." : "Resend"}
                </button>
              </p>
              <p>
                Expires in{" "}
                <span className="text-[#e11d48] font-semibold">{formattedTime}</span>
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-[240px] h-[50px] flex items-center justify-center gap-2 rounded-[10px] bg-[#e11d48] hover:bg-[#be123c] disabled:opacity-60 transition-colors text-white text-[16px] font-bold font-['Plus_Jakarta_Sans']"
            >
              {isSubmitting && <BiLoaderAlt className="animate-spin text-xl" />}
              {isSubmitting ? "Verifying..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;