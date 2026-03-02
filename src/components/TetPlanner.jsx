import React from "react";
import { IoMdFlower } from "react-icons/io";
import { Link } from "react-router-dom";
const TetPlanner = ({ iconSize, textSize, textColor }) => {
  return (
    <Link
      to="/"
      className={`w-full h-12 flex caret-transparent items-center justify-center text-${textSize || "2xl"} font-bold`}
    >
      <IoMdFlower
        className={`text-${iconSize || "4xl"} text-(--color-primary-500)`}
      />
      <p className={`text-${textColor} || ""`}>TetPlanner</p>
      <p className="text-(--color-primary-500)">Pro</p>
    </Link>
  );
};

export default TetPlanner;
