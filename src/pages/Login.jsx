import { useState } from "react";
import cover from "./asset/cover.jpg";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dữ liệu đăng nhập:", { email, password });

    // Tạm thời: Lưu vào localStorage để giả lập đã đăng nhập
    localStorage.setItem("user", JSON.stringify({ email, isLogin: true }));
    alert("Đăng nhập thành công!");
  };

  return (
    <div className="h-screen w-full flex bg-[#F8FAFC] overflow-hidden">
      {/* NỬA BÊN TRÁI: HÌNH COVER */}
      <div className="hidden lg:flex lg:w-1/2 h-full relative">
        <img src={cover} alt="Cover" className="h-full w-full object-cover" />
      </div>

      {/* NỬA BÊN PHẢI: FORM ĐĂNG NHẬP */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 h-full">
        <div className="w-full max-w-md">
          {" "}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#E11D48] mb-2">
              Welcome back
            </h2>

            <p className="text-[#E11D48] font-medium">Login to continue</p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email Address
              </label>

              <input
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>

              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <a href="#" className="text-[#E11D48] hover:underline">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="w-[343px] h-[50px] rounded-[10px] bg-[#E11D48] text-white font-semibold transition-all hover:opacity-90 active:scale-95"
            >
              LOGIN
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
