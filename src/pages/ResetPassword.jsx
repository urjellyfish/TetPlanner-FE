import { useState, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import cover from "../assets/cover.jpg";
import { toast } from "react-toastify";
import { AuthContext } from "../contexts/AuthContext";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const { resetPassword, loading } = useContext(AuthContext);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");

    // Logic kiểm tra mật khẩu khớp nhau
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const token = searchParams.get("token");
    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }

    try {
      const res = await resetPassword({ token, newPassword });
      if (res && res.success) {
        navigate("/reset-success"); // Quay về trang đăng nhập hoặc báo thành công
        toast.success(
          "Password reset successful! Please log in with your new password.",
        ); // Hiển thị thông báo thành công
      }
    } catch (err) {
      setError(err.message || "Failed to reset password.");
      toast.error(err.message || "Failed to reset password."); // Hiển thị thông báo lỗi
    }
  };

  return (
    <div className="h-screen w-full flex bg-[#F8FAFC] overflow-hidden font-sans">
      {/* LEFT SIDE: HÌNH COVER */}
      <div className="hidden lg:flex lg:w-1/2 h-full relative">
        <img src={cover} alt="Cover" className="h-full w-full object-cover" />
      </div>

      {/* RIGHT SIDE: FORM RESET */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 h-full">
        <div className="w-full max-w-md">
          {/* LOGO */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold tracking-tight">
              <span className="text-black">TetPlanner</span>
              <span className="text-[#E11D48]">Pro</span>
            </h1>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#E11D48] mb-2">
              Create New Password
            </h2>
            <p className="text-slate-500 font-medium">
              Please enter your new password to access the system.
            </p>
          </div>

          <form
            onSubmit={handleUpdate}
            className="flex flex-col gap-5 items-center"
          >
            {/* NEW PASSWORD */}
            <div className="w-full">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  //Dùng state showNewPassword
                  type={showNewPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all pr-12"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  //Toggle state showNewPassword
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="w-full">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full p-3 border rounded-lg outline-none transition-all pr-12 ${
                    error
                      ? "border-red-500 focus:ring-red-200"
                      : "border-slate-200 focus:ring-blue-500"
                  }`}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (error) setError(""); // Xóa lỗi khi người dùng gõ lại
                  }}
                  required
                />

                <button
                  type="button"
                  //Toggle state showConfirmPassword
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {error && (
                <p className="text-red-500 text-xs mt-2 font-medium">{error}</p>
              )}
            </div>

            {/* BUTTON UPDATE */}
            <button
              type="submit"
              disabled={loading}
              className="w-[343px] h-[50px] mt-2 rounded-[10px] bg-[#E11D48] text-white font-semibold transition-all hover:opacity-90 active:scale-95 shadow-lg shadow-red-100 disabled:opacity-50"
            >
              {loading ? "UPDATING..." : "UPDATE PASSWORD"}
            </button>

            {/* BACK TO LOGIN */}
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-[#E11D48] transition-colors mt-2"
            >
              <ArrowLeft size={16} /> Back to Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
