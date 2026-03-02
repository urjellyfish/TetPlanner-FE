import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import useTheme from "../hooks/useTheme";

export default function FallingTheme() {
  const { flowerIcon } = useTheme();
  const containerRef = useRef();
  const flowers = [...Array(5)].map((_, i) => i);

  useGSAP(
    () => {
      if (flowerIcon === "default") return;

      const blossomElements = gsap.utils.toArray(
        ".blossom",
        containerRef.current,
      );

      blossomElements.forEach((blossom) => {
        gsap.fromTo(
          blossom,
          {
            x: "random(50, 800)",
            y: -50,
            rotation: "random(0, 360)",
            opacity: "random(0.7, 1)",
          },
          {
            x: "+=random(50, 1500)",
            y: "100vh",
            rotation: "+=random(180, 360)",
            duration: "random(8, 10)",
            repeat: -1,
            delay: "random(0, 5)",
            ease: "none",
          },
        );
      });
    },
    { scope: containerRef, dependencies: [flowerIcon] },
  );

  if (flowerIcon === "default") return null;

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 w-full h-screen overflow-hidden pointer-events-none z-0"
    >
      {flowers.map((index) => (
        <div
          key={index}
          className="blossom absolute text-2xl"
          style={{ willChange: "transform" }}
        >
          {flowerIcon}
        </div>
      ))}
    </div>
  );
}
