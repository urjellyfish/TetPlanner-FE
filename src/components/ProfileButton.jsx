import React from "react";
import { assets } from "../assets/asset";
import { BiLogOut } from "react-icons/bi";

const ProfileButton = ({ name }) => {
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
      <BiLogOut className="text-4xl text-(--color-text-muted) hover:text-(--color-text-primary) transition-colors duration-200" />
    </div>
  );
};

export default ProfileButton;
