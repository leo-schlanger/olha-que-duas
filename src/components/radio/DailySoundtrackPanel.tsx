import { memo } from "react";
import { Music, Sun, Sunset, Moon, CloudMoon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface DailySlot {
  time: string;
  name: string;
  genres?: string;
  duration?: string;
}

interface DailyPeriod {
  period: string;
  label: string;
  range: string;
  slots: DailySlot[];
}

interface Props {
  dailySchedule: DailyPeriod[] | undefined;
  currentPeriod: string;
}

// Mapping period key → icon
const PERIOD_ICONS: Record<string, typeof Sun> = {
  manha: Sun,
  tarde: Sunset,
  noite: Moon,
  madrugada: CloudMoon,
};

/**
 * Painel "A Tua Soundtrack do Dia". Memoizado porque só depende do
 * dailySchedule (cacheado por React Query) e do período actual — re-renders
 * do RadioPlayer disparados por polling do now-playing não devem propagar
 * para aqui.
 */
const DailySoundtrackPanel = memo(function DailySoundtrackPanel({
  dailySchedule,
  currentPeriod,
}: Props) {
  return (
    <Card className="bg-cream/5 backdrop-blur-sm border border-cream/10 text-cream overflow-hidden shadow-lg">
      <div className="p-4 pb-3 border-b border-cream/10 bg-cream/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Music className="w-4 h-4 text-amarelo" />
            <h3 className="text-lg font-display font-bold">A Tua Soundtrack do Dia</h3>
          </div>
          <span className="text-[10px] font-semibold text-amarelo uppercase tracking-widest">24H Non-Stop</span>
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(dailySchedule || []).map((block) => {
            const isCurrent = currentPeriod === block.period;
            const Icon = PERIOD_ICONS[block.period] || Music;
            return (
              <div
                key={block.period}
                className={`relative rounded-xl p-3.5 transition-all duration-300 border ${
                  isCurrent
                    ? 'bg-gradient-to-br from-vermelho/20 to-amarelo/10 border-amarelo/30 shadow-lg shadow-amarelo/5'
                    : 'bg-cream/5 border-cream/5 hover:border-cream/10 hover:bg-cream/8'
                }`}
              >
                {isCurrent && (
                  <span className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-amarelo/20 border border-amarelo/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-amarelo animate-pulse" />
                    <span className="text-[9px] font-bold text-amarelo uppercase">Agora</span>
                  </span>
                )}
                <div className="flex items-center gap-2 mb-3 min-w-0">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    isCurrent ? 'bg-amarelo/20 text-amarelo' : 'bg-cream/10 text-cream/50'
                  }`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className={`text-sm font-display font-bold ${isCurrent ? 'text-amarelo' : 'text-cream'}`}>
                      {block.label}
                    </span>
                    <span className="text-[10px] text-cream/40 ml-1.5">{block.range}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {block.slots.map((slot) => (
                    <div key={slot.time} className="min-w-0">
                      <div className="flex items-center gap-2.5">
                        <span className={`text-xs font-mono w-10 shrink-0 ${isCurrent ? 'text-amarelo/80' : 'text-cream/40'}`}>
                          {slot.time}
                        </span>
                        <span className="text-sm text-cream/80 truncate" title={slot.name}>{slot.name}</span>
                        {slot.duration && (
                          <span className={`ml-auto text-[10px] font-mono shrink-0 px-1.5 py-0.5 rounded ${
                            isCurrent ? 'bg-amarelo/15 text-amarelo/70' : 'bg-cream/5 text-cream/30'
                          }`}>
                            {slot.duration}
                          </span>
                        )}
                      </div>
                      {slot.genres && (
                        <div className="flex items-center gap-2.5 mt-0.5">
                          <span className="w-10 shrink-0" />
                          <span className={`text-[10px] leading-tight truncate ${
                            isCurrent ? 'text-amarelo/50' : 'text-cream/25'
                          }`} title={slot.genres}>
                            {slot.genres}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
});

export default DailySoundtrackPanel;
