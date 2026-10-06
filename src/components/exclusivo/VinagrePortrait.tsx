import { cn } from "@/lib/utils";

/**
 * Retrato do Eduardo Vinagre, recortado da capa do programa.
 * O anel dourado é desenhado aqui. A foto original do cartaz não entra.
 */
export function VinagrePortrait({
  size = "lg",
  className,
}: {
  size?: "sm" | "lg";
  className?: string;
}) {
  const large = size === "lg";
  return (
    <div
      className={cn(
        "relative shrink-0",
        large ? "h-44 w-44 md:h-56 md:w-56" : "h-14 w-14",
        className,
      )}
    >
      <span className="absolute inset-0 rounded-full border border-[#e4c56a]/45" />
      <span
        className={cn(
          "absolute rounded-full border border-[#e4c56a]",
          large ? "inset-[7px]" : "inset-[3px]",
        )}
      />
      <span
        className={cn(
          "absolute overflow-hidden rounded-full bg-[#2a0c14] shadow-[0_0_28px_rgba(228,197,106,0.28)]",
          large ? "inset-[14px]" : "inset-[6px]",
        )}
      >
        <img
          src="/exclusivo/eduardo-vinagre.jpg"
          alt="Eduardo Vinagre"
          width={large ? 224 : 56}
          height={large ? 224 : 56}
          className="h-full w-full scale-110 object-cover object-[center_64%]"
        />
      </span>
    </div>
  );
}
