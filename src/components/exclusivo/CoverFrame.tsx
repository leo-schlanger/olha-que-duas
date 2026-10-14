import { cn } from "@/lib/utils";

/**
 * One frame for every exclusive cover. 3:4 matches the posters.
 * object-contain keeps square art and burned-in headlines whole.
 */
export function CoverFrame({
  src,
  alt = "",
  className,
}: {
  src: string;
  alt?: string;
  className?: string;
}) {
  return (
    <div className={cn("aspect-[3/4] overflow-hidden rounded-2xl bg-[#1c0a10]", className)}>
      {src ? (
        <img src={src} alt={alt} className="h-full w-full object-contain" />
      ) : (
        <div className="h-full w-full bg-[#2a1018]" />
      )}
    </div>
  );
}
