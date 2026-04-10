import {
  Sun,
  Cloud,
  CloudFog,
  CloudRain,
  CloudSnow,
  CloudLightning,
} from "lucide-react";
import { useWeather } from "@/hooks/useWeather";

// Mapeia weathercode → ícone (mesma lógica do Weather original, simplificada)
function getWeatherIcon(code: number) {
  const cls = "w-3.5 h-3.5";
  if (code === 0) return <Sun className={`${cls} text-amarelo`} />;
  if (code >= 1 && code <= 3) return <Cloud className={`${cls} text-slate-300`} />;
  if (code >= 45 && code <= 48) return <CloudFog className={`${cls} text-slate-400`} />;
  if (code >= 51 && code <= 67) return <CloudRain className={`${cls} text-blue-400`} />;
  if (code >= 71 && code <= 77) return <CloudSnow className={`${cls} text-white`} />;
  if (code >= 80 && code <= 86) return <CloudRain className={`${cls} text-blue-400`} />;
  if (code >= 95 && code <= 99) return <CloudLightning className={`${cls} text-amarelo`} />;
  return <Cloud className={`${cls} text-slate-400`} />;
}

/**
 * Faixa horizontal compacta com o tempo nas principais cidades portuguesas.
 * Pensada para ser embutida no topo da secção da rádio, não como secção própria.
 * Reusa o hook useWeather (mesmo cache, mesmo intervalo de polling).
 */
const WeatherStrip = () => {
  const { data, loading, error } = useWeather();

  // Em erro, esconde a faixa por completo — utilitário, não vale poluir a UI
  if (error) return null;

  return (
    <div className="mb-8 md:mb-10">
      <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:justify-center snap-x snap-mandatory">
        {loading && data.length === 0
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="shrink-0 snap-start flex items-center gap-2 px-3 py-1.5 rounded-full bg-cream/5 border border-cream/10 animate-pulse"
              >
                <div className="w-3.5 h-3.5 rounded-full bg-cream/10" />
                <div className="h-3 w-16 bg-cream/10 rounded" />
              </div>
            ))
          : data.map((city) => (
              <div
                key={city.city}
                className="shrink-0 snap-start inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cream/5 border border-cream/10 hover:border-amarelo/30 hover:bg-cream/10 transition-colors"
                title={`${city.city}: ${city.condition}`}
              >
                {getWeatherIcon(city.weathercode)}
                <span className="text-[11px] font-semibold uppercase tracking-wider text-cream/80">
                  {city.city}
                </span>
                <span className="text-xs font-mono font-bold text-cream">
                  {city.temperature}°
                </span>
              </div>
            ))}
      </div>
    </div>
  );
};

export default WeatherStrip;
