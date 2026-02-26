import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import cover from "../assets/cover.jpg";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSendLink = (e) => {
    e.preventDefault();
    // Giả lập gửi mail thành công
    alert("We have shared a new password to your email!");
    navigate("/reset-password"); // Sau khi báo gửi mail xong thì mới qua trang nhập pass mới
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
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
            </div>

            <button
              type="submit"
              className="w-[343px] h-[50px] mx-auto rounded-[10px] bg-[#E11D48] text-white font-semibold transition-all hover:opacity-90 active:scale-95"
            >
              SEND
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
