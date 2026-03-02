import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import cover from "../../assets/cover.jpg";
import { toast } from "react-toastify";
import TetPlanner from "../../components/TetPlanner";
import { useAuth } from "../../hooks/useAuth";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login, error: contextError, loading } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const res = await login({ email, password });

      if (res && res.success) {
        toast.success("Login successful! Welcome back.");
        navigate("/");
      } else {
        // This handles { success: false }
        const errorMessage = res?.message || "Login fail (Please try again)";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
      setError(err.message || "Login fail (Please try again)");
      toast.error(err.message || "Login fail (Please try again)");
    }
  };

  const displayError = error || contextError;

  return (
    <div className="h-screen w-full flex bg-[#F8FAFC] overflow-hidden">
      {/* LEFT SIDE: HÌNH COVER */}
      <div className="hidden lg:flex lg:w-1/2 h-full relative">
        <img src={cover} alt="Cover" className="h-full w-full object-cover" />
      </div>

      {/* RIGHT SIDE: FORM ĐĂNG NHẬP */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 h-full">
        <div className="w-full max-w-md">
          {/* LOGO*/}
          <TetPlanner
            iconSize={"10xl"}
            textSize={"4xl"}
            textColor={"black"}
          ></TetPlanner>

          <div className="text-center my-8">
            <h2 className="text-3xl font-bold text-[#E11D48] mb-2">
              Welcome back
            </h2>
            <p className="text-[#E11D48] font-medium">Login to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-[#E11D48]">
                Email Address
              </label>
              <input
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
            </div>

            {/* PASSWORD*/}
            <div>
              <label className="block text-sm font-medium text-[#E11D48]">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  className={`w-full p-3 border rounded-lg outline-none transition-all pr-12 ${
                    displayError
                      ? "border-red-500 focus:ring-red-200"
                      : "border-slate-200 focus:ring-blue-500"
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/*Hiển thị dòng tin nhắn lỗi dưới ô Input */}
              {displayError && (
                <p className="text-red-500 text-xs mt-1.5 font-medium animate-shake">
                  {displayError}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-[#E11D48] hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            {/* BUTTON LOGIN*/}
            <button
              type="submit"
              disabled={loading}
              className="w-85.75 h-12.5 mx-auto rounded-[10px] bg-[#E11D48] text-white font-semibold transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
            >
              {loading ? "LOGGING IN..." : "LOGIN"}
            </button>
            <div className="text-center mt-6 text-sm text-slate-600">
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/signup")} // Link sẵn đến trang signup
                className="text-[#E11D48] hover:underline"
              >
                Sign up now
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
