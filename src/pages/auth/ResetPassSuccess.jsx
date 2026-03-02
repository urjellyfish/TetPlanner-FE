import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import cover from "../../assets/cover.jpg";

function ResetPassSuccess() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full flex bg-[#F8FAFC] overflow-hidden font-sans">
      {/* LEFT SIDE: HÌNH COVER */}
      <div className="hidden lg:flex lg:w-1/2 h-full relative">
        <img src={cover} alt="Cover" className="h-full w-full object-cover" />
      </div>

      {/* RIGHT SIDE: SUCCESS MESSAGE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 h-full">
        <div className="w-full max-w-md text-center">
          {/* LOGO */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold tracking-tight">
              <span className="text-black">TetPlanner</span>
              <span className="text-[#E11D48]">Pro</span>
            </h1>
          </div>

          {/* ICON & TEXT SUCCESS */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 size={48} className="text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-[#E11D48] mb-2">
              Password reset successfully
            </h2>
            <p className="text-slate-500 font-medium">
              You can now login with your new password.
            </p>
          </div>

          {/* BUTTON LOGIN */}
          <button
            onClick={() => navigate("/")}
            className="w-85.75 h-12.5 mx-auto rounded-[10px] bg-[#E11D48] text-white font-semibold transition-all hover:opacity-90 active:scale-95 shadow-lg shadow-red-100"
          >
            LOGIN
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResetPassSuccess;
