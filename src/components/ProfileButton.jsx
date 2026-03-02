import { assets } from "../assets/asset";
import { BiLogOut } from "react-icons/bi";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ProfileButton = ({ name }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    toast.success("Logged out successfully.");
    logout();
    navigate("/login");
  };

  return (
    <div className="w-full h-12 p-2 flex items-center justify-start gap-2 bg-(--color-bg-card) rounded-xl">
      {/* Profile image */}
      <img src={assets.user} alt="User Profile image" className="w-1/5" />

      {/* Profile name */}
      <div className="w-full h-full flex flex-col items-start justify-center">
        <span className="font-bold text-(--color-text-primary)">{name}</span>
        <span className="font-normal text-(--color-text-muted) text-sm">
          Star your day!
        </span>
      </div>

      {/* Logout button */}
      <BiLogOut
        className="text-4xl text-(--color-text-muted) hover:text-(--color-text-primary) transition-colors duration-200 cursor-pointer"
        onClick={handleLogout}
      />
    </div>
  );
};

export default ProfileButton;
