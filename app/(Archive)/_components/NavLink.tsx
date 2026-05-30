"use client";
import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";

const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);

  const handleMouseEnter = () => {
    // Animate to gradient text clip
    gsap.to(textRef.current, {
      backgroundSize: "100% 100%",
      duration: 0.4,
      ease: "power2.inOut",
    });
    gsap.to(lineRef.current, {
      scaleX: 1,
      duration: 0.35,
      ease: "power2.inOut",
    });
  };

  const handleMouseLeave = () => {
    // Revert to white
    gsap.to(textRef.current, {
      backgroundSize: "0% 100%",
      duration: 0.4,
      ease: "power2.inOut",
    });
    gsap.to(lineRef.current, {
      scaleX: 0,
      duration: 0.35,
      ease: "power2.inOut",
    });
  };

  return (
    <Link
      href={href}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative inline-flex flex-col items-center px-1 py-1 text-sm font-medium"
    >
      {/* Text with clip transition */}
      <span
        ref={textRef}
        className="block pointer-events-none"
        style={{
          color: "white",
          backgroundImage: "linear-gradient(135deg, #38bdf8, #818cf8)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          backgroundSize: "0% 100%",
          backgroundRepeat: "no-repeat",
        }}
      >
        {children}
      </span>

      {/* Animated bottom border */}
      <span
        ref={lineRef}
        className="absolute bottom-0 left-0 h-[1.5px] w-full origin-left"
        style={{
          background: "linear-gradient(135deg, #38bdf8, #818cf8)",
          transform: "scaleX(0)",
        }}
      />
    </Link>
  );
};

export default NavLink;
