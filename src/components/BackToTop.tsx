import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface BackToTopProps {
  showAfter?: number;
  className?: string;
}

export default function BackToTop({ showAfter = 400, className }: BackToTopProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > showAfter);
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, [showAfter]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "fixed bottom-6 right-6 z-40 mb-[env(safe-area-inset-bottom)]",
        "w-12 h-12 rounded-full",
        "bg-vermelho text-cream shadow-lg shadow-vermelho/30",
        "flex items-center justify-center",
        "transition-all duration-500 ease-out",
        "hover:bg-vermelho-soft hover:scale-110 hover:shadow-xl hover:shadow-vermelho/40",
        "focus:outline-none focus:ring-2 focus:ring-amarelo focus:ring-offset-2 focus:ring-offset-background",
        "btn-magnetic",
        isVisible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none",
        className
      )}
      aria-label="Voltar ao topo"
    >
      {/* Pulse ring when hovered */}
      <span
        className={cn(
          "absolute inset-0 rounded-full border-2 border-amarelo/50 transition-all duration-500",
          isHovered ? "scale-125 opacity-0" : "scale-100 opacity-0"
        )}
      />

      <ArrowUp
        className={cn(
          "w-5 h-5 transition-transform duration-300",
          isHovered ? "-translate-y-0.5" : ""
        )}
      />

      {/* Progress indicator (optional - shows scroll position) */}
      <svg
        className="absolute inset-0 w-full h-full -rotate-90"
        viewBox="0 0 48 48"
      >
        <circle
          cx="24"
          cy="24"
          r="22"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-amarelo/30"
          strokeDasharray={`${2 * Math.PI * 22}`}
          strokeDashoffset={0}
        />
      </svg>
    </button>
  );
}
