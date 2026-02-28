import CoverImage from "../../assets/Cover.jpg";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { HiOutlineMail } from "react-icons/hi";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { BiLoaderAlt } from "react-icons/bi";
import FlowerLogo from "../../components/FlowerLogo.jsx";

const labelCls =
  "text-[14px] font-medium text-[#e11d48]";

const inputCls =
  "w-full h-11 bg-white rounded-[5px] border border-[#e11d48] " +
  "text-[14px] font-medium text-[#111] placeholder-[#111] " +
  "outline-none focus:ring-1 focus:ring-[#e11d48] " +
  /* Fix Chrome autofill nền xanh */
  "[&:-webkit-autofill]:shadow-[0_0_0px_1000px_white_inset] " +
  "[&:-webkit-autofill]:[transition:background-color_9999s]";

function SignUp() {
  const navigate = useNavigate();
  const { signUp, error: authError, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const password = watch("password");

  const onSubmit = async (data) => {
    clearError();
    setIsSubmitting(true);
    try {
      await signUp({ name: data.name, email: data.email, password: data.password });
      navigate("/verify-email", { state: { email: data.email } });
    } catch {
      // authError đã set trong context → hiển thị bên dưới
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-screen h-screen flex overflow-hidden bg-white">

      {/* ── Left cover ── */}
      <div
        className="hidden lg:block flex-shrink-0 w-[40%] h-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${CoverImage})` }}
      />

      {/* ── Right panel ── */}
      <div className="flex-1 flex items-center justify-center px-8 bg-white overflow-y-auto">
        <div className="w-full max-w-[343px] py-10">

          {/* Logo + brand */}
          <div className="flex items-center justify-center gap-[6px] mb-2">
            <div className="flex-shrink-0 mt-0.5">
              <FlowerLogo />
            </div>
            <p className="font-extrabold text-[22px] leading-none tracking-tight">
              <span className="text-[#1e293b]">Tet Planner </span>
              <span className="text-[#e11d48]">Pro</span>
            </p>
          </div>

          {/* Title */}
          <h1 className="text-[15px] font-bold text-[#e11d48] text-center mb-[30px]">
            Create An Account
          </h1>

          {/* Server error banner */}
          {authError && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600">
              {authError}
            </div>
          )}

          {/* ── Form ── */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

            {/* Name */}
            <div className="flex flex-col gap-1">
              <label className={labelCls}>Name</label>
              <input
                type="text"
                className={`${inputCls} px-5`}
                placeholder="Happy New Year"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-[11px] text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className={labelCls}>Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <HiOutlineMail className="w-[18px] h-[18px] text-[#e11d48]" />
                </span>
                <input
                  type="email"
                  className={`${inputCls} pl-11 pr-5`}
                  placeholder="happynewyear@gmail.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" },
                  })}
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label className={labelCls}>Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`${inputCls} pl-5 pr-12`}
                  placeholder="Happynewyear12345"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 8, message: "Min 8 characters" },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-4 flex items-center text-[#111] hover:text-gray-600"
                  aria-label="Toggle password visibility"
                >
                  {showPassword
                    ? <IoEyeOffOutline className="w-[18px] h-[18px]" />
                    : <IoEyeOutline    className="w-[18px] h-[18px]" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1">
              <label className={labelCls}>Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  className={`${inputCls} pl-5 pr-12`}
                  placeholder="Happynewyear12345"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (v) => v === password || "Passwords do not match",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute inset-y-0 right-4 flex items-center text-[#111] hover:text-gray-600"
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirm
                    ? <IoEyeOffOutline className="w-[18px] h-[18px]" />
                    : <IoEyeOutline    className="w-[18px] h-[18px]" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-[11px] text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit */}
            <div className="flex flex-col items-center gap-[18px] mt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 flex items-center justify-center gap-2 rounded-[6px] bg-[#e11d48] hover:bg-[#be123c] disabled:opacity-60 transition-colors text-white text-[15px] font-medium tracking-wide"
              >
                {isSubmitting && <BiLoaderAlt className="animate-spin text-xl" />}
                {isSubmitting ? "Signing up..." : "SIGN UP"}
              </button>

              <p className="text-[13px] text-[#111]">
                Have an account already?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-[#e11d48] font-medium hover:underline"
                >
                  Log in
                </button>
              </p>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;