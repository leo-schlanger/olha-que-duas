import { memo, useEffect, useMemo, useState } from "react";
import {
  Calendar, Clock, Radio, ChevronRight,
  Apple, Target, Heart, Footprints, MessageSquare, Users,
} from "lucide-react";
import { Card } from "@/components/ui/card";

interface ScheduleItem {
  day: string;
  show: string;
  times: string[];
  iconUrl: string;
}

interface Props {
  schedule: ScheduleItem[];
  loading: boolean;
}

// Ícones fallback por nome de programa
const FALLBACK_ICONS: Record<string, React.ReactNode> = {
  'Nutrição': <Apple className="w-full h-full p-1.5" />,
  'Motivar': <Target className="w-full h-full p-1.5" />,
  'Prazer Feminino': <Heart className="w-full h-full p-1.5" />,
  'Companheiros de Caminhada': <Footprints className="w-full h-full p-1.5" />,
  'Dizem que...': <MessageSquare className="w-full h-full p-1.5" />,
  'Olha que Duas!': <Users className="w-full h-full p-1.5" />,
};

const DAYS_ORDER = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
const DAYS_SHORT: Record<string, string> = {
  'Segunda': 'Seg',
  'Terça': 'Ter',
  'Quarta': 'Qua',
  'Quinta': 'Qui',
  'Sexta': 'Sex',
  'Sábado': 'Sáb',
  'Domingo': 'Dom',
};

function renderIcon(show: string, iconUrl: string) {
  const fallback = FALLBACK_ICONS[show] || <Radio className="w-full h-full p-1.5" />;
  if (iconUrl && !iconUrl.includes('placehold.co')) {
    return (
      <img
        src={iconUrl}
        alt={show}
        className="w-full h-full object-cover rounded-md"
        loading="lazy"
        decoding="async"
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
      />
    );
  }
  return fallback;
}

/**
 * Painel da programação semanal. Memoizado e self-contained — gere o próprio
 * selectedDay para que o polling de now-playing no RadioPlayer pai não force
 * re-renders aqui (a UI da programação é praticamente estática durante uma
 * sessão).
 */
const WeeklySchedulePanel = memo(function WeeklySchedulePanel({
  schedule,
  loading,
}: Props) {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  // Agrupar programação por dia
  const scheduleByDay = useMemo(() => {
    const grouped: Record<string, ScheduleItem[]> = {};
    for (const item of schedule) {
      if (!grouped[item.day]) grouped[item.day] = [];
      grouped[item.day].push(item);
    }
    return grouped;
  }, [schedule]);

  // Dias disponíveis ordenados
  const availableDays = useMemo(
    () => DAYS_ORDER.filter((day) => scheduleByDay[day]?.length > 0),
    [scheduleByDay]
  );

  // Selecionar dia atual por padrão
  useEffect(() => {
    if (availableDays.length === 0 || selectedDay) return;
    const today = new Date().getDay();
    const todayName = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][today];
    setSelectedDay(availableDays.includes(todayName) ? todayName : availableDays[0]);
  }, [availableDays, selectedDay]);

  return (
    <Card className="bg-cream/5 backdrop-blur-sm border border-cream/10 text-cream overflow-hidden shadow-lg">
      {/* Header with day tabs */}
      <div className="border-b border-cream/10 bg-cream/5">
        <div className="p-4 pb-0 flex items-center gap-3">
          <Calendar className="w-4 h-4 text-amarelo" />
          <h3 className="text-lg font-display font-bold">Programação Semanal</h3>
        </div>

        {/* Day tabs */}
        <div className="flex gap-1 px-4 pt-4 pb-0 overflow-x-auto scrollbar-hide">
          {loading ? (
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-9 w-16 bg-cream/10 rounded-t-lg animate-pulse" />
              ))}
            </div>
          ) : (
            availableDays.map((day) => {
              const isActive = selectedDay === day;
              const programCount = scheduleByDay[day]?.length || 0;
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`relative px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-vermelho text-cream'
                      : 'text-cream/60 hover:text-cream hover:bg-cream/10'
                  }`}
                >
                  <span className="hidden sm:inline">{day}</span>
                  <span className="sm:hidden">{DAYS_SHORT[day]}</span>
                  {programCount > 1 && (
                    <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-cream/20' : 'bg-amarelo/20 text-amarelo'
                    }`}>
                      {programCount}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Programs list for selected day */}
      <div className="p-4 max-h-[420px] overflow-y-auto scrollbar-hide">
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-20 bg-cream/5 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : selectedDay && scheduleByDay[selectedDay] ? (
          <div className="space-y-3">
            {scheduleByDay[selectedDay].map((item, idx) => (
              <div
                key={`${item.day}-${item.show}-${idx}`}
                className="group relative bg-gradient-to-r from-cream/5 to-transparent rounded-xl p-4 hover:from-cream/10 transition-all border border-cream/5 hover:border-cream/10"
              >
                <div className="flex items-start gap-4">
                  {/* Program icon */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-vermelho/20 to-amarelo/10 border border-cream/10 flex items-center justify-center text-amarelo shrink-0 group-hover:scale-105 transition-transform overflow-hidden">
                    {renderIcon(item.show, item.iconUrl)}
                  </div>

                  {/* Program info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h4 className="font-display font-bold text-base text-cream group-hover:text-amarelo transition-colors truncate" title={item.show}>
                          {item.show}
                        </h4>
                        <p className="text-xs text-cream/50 mt-0.5">
                          {item.times.length} {item.times.length === 1 ? 'exibição' : 'exibições'} neste dia
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-cream/30 group-hover:text-amarelo group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                    </div>

                    {/* Times */}
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {item.times.map((time, timeIdx) => (
                        <span
                          key={`${time}-${timeIdx}`}
                          className="inline-flex items-center gap-1.5 text-xs font-mono text-cream bg-black/30 px-3 py-1.5 rounded-lg border border-cream/10 group-hover:border-amarelo/20 transition-colors"
                        >
                          <Clock className="w-3 h-3 text-amarelo" />
                          {time}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-cream/50">
            Selecione um dia para ver a programação
          </div>
        )}
      </div>
    </Card>
  );
});

export default WeeklySchedulePanel;
