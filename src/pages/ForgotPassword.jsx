import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import cover from "../assets/cover.jpg";
import { AuthContext } from "../contexts/AuthContext";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { forgotPassword, loading } = useContext(AuthContext);

  const handleSendLink = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await forgotPassword({ email });
      if (res && res.success) {
        setSuccess("We have shared a new password reset link to your email!");
        // Optionally wait for a bit, then tell the user to check their email
        // navigate("/reset-password"); // usually you don't navigate directly, they have to click the link in email first, but for this flow let's just show success
      }
    } catch (err) {
      setError(err.message || "Failed to send reset link.");
    }
  };

  return (
    <div className="h-screen w-full flex bg-[#F8FAFC] overflow-hidden">
      {/* LEFT SIDE: HÌNH COVER */}
      <div className="hidden lg:flex lg:w-1/2 h-full relative">
        <img src={cover} alt="Cover" className="h-full w-full object-cover" />
      </div>

      {/* RIGHT SIDE: FORM FORGOT PASSWORD */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 h-full">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold tracking-tight">
              <span className="text-black">TetPlanner</span>
              <span className="text-[#E11D48]">Pro</span>
            </h1>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#E11D48] mb-2">
              Forgot your Password?
            </h2>
            <p className="text-slate-500 font-medium">
              Enter your email address and we will share a link to create a new
              password.
            </p>
          </div>

          <form onSubmit={handleSendLink} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter Email Address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                  if (success) setSuccess("");
                }}
                className={`w-full p-3 border rounded-lg outline-none transition-all ${
                  error
                    ? "border-red-500 focus:ring-red-200"
                    : "border-slate-200 focus:ring-blue-500"
                }`}
                required
              />
              {error && (
                <p className="text-red-500 text-xs mt-1.5 font-medium animate-shake">
                  {error}
                </p>
              )}
              {success && (
                <p className="text-green-500 text-xs mt-1.5 font-medium animate-pulse">
                  {success}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-85.75 h-12.5 mx-auto rounded-[10px] bg-[#E11D48] text-white font-semibold transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
            >
              {loading ? "SENDING..." : "SEND"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-[#E11D48] transition-colors"
            >
              <ArrowLeft size={16} /> Back to Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
