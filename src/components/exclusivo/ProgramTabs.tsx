import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { exclusivoProgramPath } from "@/lib/exclusivoPaths";
import { programTheme } from "@/lib/exclusivoTheme";
import { useExclusivePrograms } from "@/hooks/useExclusivePrograms";
import { EXCLUSIVO_HUB } from "@/types/exclusivo";

/** Abas dos programas: salta-se de um para outro sem voltar à lista. */
export function ProgramTabs({ active }: { active?: string }) {
  const { data: programs } = useExclusivePrograms();
  const activeRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [active, programs]);

  const tab = (isActive: boolean) =>
    cn(
      "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
      isActive
        ? "border-[#1c0a10] bg-[#1c0a10] text-[#f6efe4]"
        : "border-[#1c0a10]/15 bg-white/60 text-[#1c0a10]/80 hover:border-[#1c0a10]/40 hover:text-[#1c0a10]",
    );

  return (
    <nav aria-label="Programas do Exclusivo" className="-mx-4 sm:-mx-6">
      <div className="flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:px-6 [&::-webkit-scrollbar]:hidden">
        <Link
          to={EXCLUSIVO_HUB.path}
          ref={!active ? activeRef : undefined}
          aria-current={!active ? "page" : undefined}
          className={tab(!active)}
        >
          Tudo
        </Link>
        {(programs ?? []).map((program) => {
          const isActive = program.slug === active;
          return (
            <Link
              key={program.id}
              to={exclusivoProgramPath(program.slug)}
              ref={isActive ? activeRef : undefined}
              aria-current={isActive ? "page" : undefined}
              className={tab(isActive)}
            >
              <span
                aria-hidden
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: programTheme(program.slug).accent }}
              />
              {program.title}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
