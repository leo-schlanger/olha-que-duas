import { siteConfig } from "@/config/site";

const NOTES = [
  { char: "\u266A", left: "4%",  delay: "0s",   duration: "16s", size: "text-2xl" },
  { char: "\u266B", left: "14%", delay: "3s",   duration: "20s", size: "text-xl" },
  { char: "\u266A", left: "82%", delay: "1s",   duration: "18s", size: "text-3xl" },
  { char: "\u266B", left: "93%", delay: "7s",   duration: "22s", size: "text-lg" },
  { char: "\u266A", left: "38%", delay: "10s",  duration: "17s", size: "text-xl" },
  { char: "\u266B", left: "68%", delay: "5s",   duration: "19s", size: "text-2xl" },
  { char: "\u266A", left: "24%", delay: "13s",  duration: "21s", size: "text-lg" },
  { char: "\u266B", left: "52%", delay: "8s",   duration: "15s", size: "text-xl" },
  { char: "\u266A", left: "76%", delay: "16s",  duration: "20s", size: "text-lg" },
  { char: "\u266B", left: "46%", delay: "2s",   duration: "18s", size: "text-2xl" },
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
              ? "hsla(217, 85%, 60%, 0.35)"
              : "hsla(0, 75%, 55%, 0.30)",
          }}
        >
          {note.char}
        </span>
      ))}

      {/* Subtle blue orb — top right */}
      <div
        className="absolute -top-20 -right-20 w-72 h-72 md:w-[500px] md:h-[500px] rounded-full blur-3xl animate-rir-glow"
        style={{
          background: "radial-gradient(circle, hsla(217, 85%, 55%, 0.08) 0%, transparent 70%)",
        }}
      />

      {/* Subtle blue orb — bottom left */}
      <div
        className="absolute -bottom-20 -left-20 w-56 h-56 md:w-80 md:h-80 rounded-full blur-3xl animate-rir-glow"
        style={{
          background: "radial-gradient(circle, hsla(217, 85%, 55%, 0.06) 0%, transparent 70%)",
          animationDelay: "1.5s",
        }}
      />
    </div>
  );
};

export default RockInRioOverlay;
