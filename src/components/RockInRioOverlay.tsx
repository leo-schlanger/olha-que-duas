import { siteConfig } from "@/config/site";

const NOTES = [
  { char: "\u266A", left: "5%",  delay: "0s",   duration: "18s", size: "text-lg" },
  { char: "\u266B", left: "15%", delay: "4s",   duration: "22s", size: "text-base" },
  { char: "\u266A", left: "85%", delay: "2s",   duration: "20s", size: "text-xl" },
  { char: "\u266B", left: "92%", delay: "8s",   duration: "24s", size: "text-sm" },
  { char: "\u266A", left: "40%", delay: "12s",  duration: "19s", size: "text-base" },
  { char: "\u266B", left: "70%", delay: "6s",   duration: "21s", size: "text-lg" },
  { char: "\u266A", left: "25%", delay: "15s",  duration: "23s", size: "text-sm" },
  { char: "\u266B", left: "55%", delay: "10s",  duration: "17s", size: "text-base" },
];

const RockInRioOverlay = () => {
  if (!siteConfig.rockInRio.enabled) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[5] overflow-hidden"
      aria-hidden="true"
    >
      {/* Floating musical notes */}
      {NOTES.map((note, i) => (
        <span
          key={i}
          className={`absolute bottom-0 animate-music-float ${note.size} select-none`}
          style={{
            left: note.left,
            animationDelay: note.delay,
            animationDuration: note.duration,
            color: i % 2 === 0
              ? "hsla(217, 85%, 55%, 0.12)"
              : "hsla(0, 80%, 50%, 0.10)",
          }}
        >
          {note.char}
        </span>
      ))}

      {/* Subtle blue orb — top right */}
      <div
        className="absolute -top-20 -right-20 w-72 h-72 md:w-96 md:h-96 rounded-full blur-3xl animate-rir-glow"
        style={{
          background: "radial-gradient(circle, hsla(217, 85%, 55%, 0.06) 0%, transparent 70%)",
        }}
      />

      {/* Subtle blue orb — bottom left */}
      <div
        className="absolute -bottom-20 -left-20 w-56 h-56 md:w-72 md:h-72 rounded-full blur-3xl animate-rir-glow"
        style={{
          background: "radial-gradient(circle, hsla(217, 85%, 55%, 0.04) 0%, transparent 70%)",
          animationDelay: "1.5s",
        }}
      />
    </div>
  );
};

export default RockInRioOverlay;
