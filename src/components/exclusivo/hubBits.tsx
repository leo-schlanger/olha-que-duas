import { Link } from "react-router-dom";
import type { HubProgram } from "@/hooks/useExclusivePrograms";
import { exclusivoProgramPath } from "@/lib/exclusivoPaths";
import { lisbonNow, nextBroadcast, weeklyPattern } from "@/lib/radioSchedule";


export type HubFilter = "todos" | "ler" | "radio";

export const isRadio = (p: HubProgram) => Boolean(p.radio?.is_active && ((p.radio.schedule ?? []).length || (p.radio.schedule_dates ?? []).length));

export function filterPrograms(programs: HubProgram[], f: HubFilter): HubProgram[] {
  if (f === "ler") return programs.filter((p) => p.livePieces > 0);
  if (f === "radio") return programs.filter(isRadio);
  return programs;
}

/** Card badges: «12 peças» and «Ter 11h e 17h» / «Próx.: 16 dez». */
export function ProgramBadges({ program }: { program: HubProgram }) {
  const radio = isRadio(program) ? program.radio! : null;
  let radioText = radio ? weeklyPattern(radio.schedule ?? [], true) : "";
  // Only dated broadcasts (Céu de Cada Mês): a monthly program (qa r8).
  if (radio && !radioText) radioText = "Mensal";
  if (!program.livePieces && !radioText) return null;
  return (
    <p className="mt-2 flex flex-wrap gap-2">
      {program.livePieces > 0 && (
        <span className="rounded-full bg-[#1c0a10]/[0.06] px-2.5 py-1 text-xs font-semibold text-[#1c0a10]">
          Ler · {program.livePieces} {program.livePieces === 1 ? "peça" : "peças"}
        </span>
      )}
      {radioText && (
        <span className="rounded-full bg-[#7a5b16]/10 px-2.5 py-1 text-xs font-semibold text-[#5c4310]">Rádio · {radioText}</span>
      )}
    </p>
  );
}

const CHIPS: [HubFilter, string][] = [
  ["todos", "Todos"],
  ["ler", "Para ler"],
  ["radio", "Na rádio"],
];

export function HubChips({ value, onChange }: { value: HubFilter; onChange: (f: HubFilter) => void }) {
  return (
    <div role="group" aria-label="Filtrar programas" className="mt-6 flex flex-wrap gap-2">
      {CHIPS.map(([v, label]) => (
        <button
          key={v}
          type="button"
          aria-pressed={value === v}
          onClick={() => onChange(v)}
          className={`h-11 rounded-full border px-5 text-base font-semibold transition-colors ${
            value === v ? "border-[#1c0a10] bg-[#1c0a10] text-white" : "border-[#1c0a10]/20 bg-white text-[#1c0a10] hover:border-[#1c0a10]/50"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

/** «Hoje na rádio»: today's broadcasts of the hub programs (not the music blocks). */
export function TodayOnRadio({ programs, now = new Date() }: { programs: HubProgram[]; now?: Date }) {
  const today = lisbonNow(now).date;
  const items = programs
    .filter(isRadio)
    .map((p) => ({ p, next: nextBroadcast(p.radio!.schedule ?? [], p.radio!.schedule_dates ?? [], now) }))
    .filter((x) => x.next && x.next.date === today)
    .sort((a, b) => a.next!.time.localeCompare(b.next!.time));
  if (!items.length) return null;
  return (
    <section aria-labelledby="hoje-na-radio" className="mt-6 rounded-2xl bg-[#1c0a10] p-4 text-white sm:p-5">
      <h2 id="hoje-na-radio" className="text-sm font-bold uppercase tracking-[0.16em] text-amarelo">Hoje na rádio</h2>
      <ul className="mt-2 flex gap-3 overflow-x-auto pb-1">
        {items.map(({ p, next }) => (
          <li key={p.id} className="shrink-0">
            <Link to={exclusivoProgramPath(p.slug)} className="block rounded-xl bg-white/10 px-4 py-2 text-base hover:bg-white/15">
              <strong className="font-semibold">{next!.time}</strong> · {p.title}
            </Link>
          </li>
        ))}
        <li className="shrink-0">
          <Link
            to="/#radio"
            onClick={() => {
              window.__oqdPlayPending = Date.now();
            }}
            className="block rounded-xl bg-amarelo px-4 py-2 text-base font-bold text-[#1c0a10]"
          >
            Ouvir em direto
          </Link>
        </li>
      </ul>
    </section>
  );
}
