import { memo, useEffect, useState } from "react";
import {
  Music, Sun, Sunset, Moon, CloudMoon, Radio,
  Apple, Target, Heart, Footprints, MessageSquare, Users,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import type { DailyPeriod, DailySlot } from "@/hooks/useDailySchedule";

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

// Fallback icons for known special programs (quando o icon_url ainda não existe)
const FALLBACK_ICONS: Record<string, React.ReactNode> = {
  'Nutrição': <Apple className="w-full h-full p-2.5" />,
  'Motivar': <Target className="w-full h-full p-2.5" />,
  'Prazer Feminino': <Heart className="w-full h-full p-2.5" />,
  'Companheiros de Caminhada': <Footprints className="w-full h-full p-2.5" />,
  'Dizem que...': <MessageSquare className="w-full h-full p-2.5" />,
  'Olha que Duas!': <Users className="w-full h-full p-2.5" />,
};

/** Mostra "19h–21h" para intervalos, ou só "19h" para horas únicas. */
function timeLabel(slot: DailySlot): string {
  return slot.endTime ? `${slot.time}–${slot.endTime}` : slot.time;
}

/**
 * Renderiza a imagem do programa OU um placeholder seguro. Se o `iconUrl`
 * estiver em falta, for um placeholder do placehold.co, ou a imagem falhar
 * a carregar (`onError`), cai para o `placeholder` — nunca mostra imagem
 * partida nem altera o layout. Isto deixa adicionar os ícones um a um sem
 * quebrar a página.
 */
function ProgramIcon({
  name,
  iconUrl,
  placeholder,
}: {
  name: string;
  iconUrl?: string;
  placeholder: React.ReactNode;
}) {
  const [errored, setErrored] = useState(false);

  // Reset do estado de erro quando a foto muda (ex.: depois de a adicionares)
  useEffect(() => { setErrored(false); }, [iconUrl]);

  const hasUrl = !!iconUrl && !iconUrl.includes('placehold.co');
  if (!hasUrl || errored) return <>{placeholder}</>;

  return (
    <img
      src={iconUrl}
      alt={name}
      className="w-full h-full object-cover"
      loading="lazy"
      decoding="async"
      onError={() => setErrored(true)}
    />
  );
}

/**
 * Miniatura de um slot. Espaço sempre reservado (com placeholder quando não
 * há foto) → adicionar/remover fotos não desalinha a lista. Os especiais
 * (eventos) ganham moldura amarela; a rotina fica subtil.
 */
function SlotThumb({
  slot,
  isCurrent,
  size = "sm",
}: {
  slot: DailySlot;
  isCurrent: boolean;
  size?: "sm" | "md";
}) {
  const dim = size === "md" ? "w-12 h-12" : "w-11 h-11";
  const placeholder = slot.isSpecial
    ? (FALLBACK_ICONS[slot.name] ?? <Radio className="w-full h-full p-2.5" />)
    : <Music className="w-full h-full p-3" />;

  const tone = slot.isSpecial
    ? "text-amarelo border-amarelo/30 bg-amarelo/10 shadow-sm shadow-amarelo/20"
    : isCurrent
      ? "text-amarelo/70 border-amarelo/20 bg-amarelo/5"
      : "text-cream/35 border-cream/10 bg-cream/5";

  return (
    <div className={`${dim} rounded-lg shrink-0 overflow-hidden border flex items-center justify-center ${tone}`}>
      <ProgramIcon name={slot.name} iconUrl={slot.iconUrl} placeholder={placeholder} />
    </div>
  );
}

/**
 * Coluna da esquerda: hora (intervalo) + duração empilhadas, ou o badge
 * "Dia inteiro". Largura fixa para alinhar todas as miniaturas, libertando
 * a direita inteira para o nome + descrição (sem cortes).
 */
function SlotTimeCol({ slot, isCurrent }: { slot: DailySlot; isCurrent: boolean }) {
  if (slot.isAllDay) {
    return (
      <span className={`mt-0.5 shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
        isCurrent ? 'bg-purple-500/20 text-purple-300 border border-purple-400/30' : 'bg-cream/10 text-cream/50'
      }`}>
        Dia inteiro
      </span>
    );
  }
  return (
    <div className="shrink-0 w-[3.4rem] mt-0.5 leading-tight font-mono">
      <div className={`text-[11px] whitespace-nowrap ${isCurrent ? 'text-amarelo/85' : 'text-cream/55'}`}>
        {timeLabel(slot)}
      </div>
      {slot.duration && (
        <div className={`text-[10px] ${isCurrent ? 'text-amarelo/45' : 'text-cream/25'}`}>
          {slot.duration}
        </div>
      )}
    </div>
  );
}

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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
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
                <div className="space-y-1.5">
                  {block.slots.map((slot, slotIdx) => {
                    const isAllDay = !!slot.isAllDay;
                    const highlight = !!slot.isSpecial || isAllDay;
                    return (
                      <div
                        key={isAllDay ? `allday-${slotIdx}` : `${slot.time}-${slotIdx}`}
                        className={`min-w-0 ${highlight ? 'rounded-lg px-2.5 py-2 -mx-1.5 bg-amarelo/5 border border-amarelo/10' : 'px-0 py-1'}`}
                      >
                        <div className="flex items-start gap-2.5">
                          <SlotTimeCol slot={slot} isCurrent={isCurrent} />
                          <SlotThumb slot={slot} isCurrent={isCurrent} size={highlight ? "md" : "sm"} />

                          {/* Nome + descrição — largura total, sem cortes (quebram para várias linhas) */}
                          <div className="flex-1 min-w-0">
                            <span className={`block break-words leading-snug ${
                              highlight ? 'text-[15px] text-amarelo font-bold' : 'text-sm text-cream/85 font-medium'
                            }`}>
                              {slot.name}
                            </span>
                            {slot.genres && (
                              <span className={`block break-words text-[11px] leading-snug mt-0.5 ${
                                isCurrent ? 'text-amarelo/55' : 'text-cream/35'
                              }`}>
                                {slot.genres}
                              </span>
                            )}
                          </div>
                        </div>

                        {slot.subPrograms && slot.subPrograms.length > 0 && (
                          <div className="mt-1.5 ml-3 space-y-1.5 border-l-2 border-amarelo/20 pl-2.5">
                            {slot.subPrograms.map((sub, subIdx) => (
                              <div key={`sub-${subIdx}`} className="flex items-start gap-2">
                                <SlotTimeCol slot={sub} isCurrent={isCurrent} />
                                <SlotThumb slot={sub} isCurrent={isCurrent} size="sm" />
                                <span className="flex-1 min-w-0 block break-words leading-snug text-sm text-amarelo/90 font-semibold">
                                  {sub.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
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
