import { cn } from "@/lib/utils";

/**
 * Retrato circular do autor do programa. O anel dourado é desenhado aqui.
 * `focus` é um object-position CSS ("center" ou "center 64%").
 */
export function ProgramPortrait({
  src,
  alt,
  focus = "center",
  size = "lg",
  className,
}: {
  src: string;
  alt: string;
  focus?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const frame =
    size === "lg"
      ? "h-44 w-44 md:h-56 md:w-56"
      : size === "md"
        ? "h-20 w-20 md:h-24 md:w-24"
        : "h-14 w-14";
  const ring = size === "lg" ? "inset-[7px]" : size === "md" ? "inset-[4px]" : "inset-[3px]";
  const photo = size === "lg" ? "inset-[14px]" : size === "md" ? "inset-[8px]" : "inset-[6px]";
  return (
    <div className={cn("relative shrink-0", frame, className)}>
      <span className="absolute inset-0 rounded-full border border-[#e4c56a]/45" />
      <span className={cn("absolute rounded-full border border-[#e4c56a]", ring)} />
      <span
        className={cn(
          "absolute overflow-hidden rounded-full bg-[#2a0c14]",
          size === "lg" && "shadow-[0_0_28px_rgba(228,197,106,0.28)]",
          photo,
        )}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            width={size === "lg" ? 224 : size === "md" ? 96 : 56}
            height={size === "lg" ? 224 : size === "md" ? 96 : 56}
            className="h-full w-full scale-110 object-cover"
            style={{ objectPosition: focus }}
          />
        ) : null}
      </span>
    </div>
  );
}
