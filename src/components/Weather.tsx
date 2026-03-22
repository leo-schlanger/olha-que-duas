import {
  Sun,
  Cloud,
  CloudFog,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
  RefreshCw,
  MapPin,
  Thermometer,
} from "lucide-react";
import { useWeather } from "@/hooks/useWeather";

// Mapeamento de weathercode para ícone Lucide
function getWeatherIcon(code: number) {
  if (code === 0) return <Sun className="w-8 h-8 text-amarelo" />;
  if (code >= 1 && code <= 3) return <Cloud className="w-8 h-8 text-cream/80" />;
  if (code >= 45 && code <= 48) return <CloudFog className="w-8 h-8 text-cream/60" />;
  if (code >= 51 && code <= 67) return <CloudRain className="w-8 h-8 text-blue-400" />;
  if (code >= 71 && code <= 77) return <CloudSnow className="w-8 h-8 text-white" />;
  if (code >= 80 && code <= 86) return <CloudRain className="w-8 h-8 text-blue-400" />;
  if (code >= 95 && code <= 99) return <CloudLightning className="w-8 h-8 text-amarelo" />;
  return <Cloud className="w-8 h-8 text-cream/50" />;
}

const Weather = () => {
  const { data, loading, error, lastUpdated, refresh } = useWeather();

  const formatTime = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleTimeString("pt-PT", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <section
      id="tempo"
      className="py-12 md:py-20 bg-beige-dark text-cream selection:bg-amarelo selection:text-charcoal"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-10 text-left md:text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amarelo/10 border border-amarelo/20 mb-4">
            <Thermometer className="w-3.5 h-3.5 text-amarelo" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-amarelo">
              Tempo
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-semibold mb-4">
            Tempo em <span className="text-amarelo">Portugal</span>
          </h2>
          <p className="text-cream/60 text-sm md:text-base">
            Previsão atual para as principais cidades.
          </p>
        </div>

        {/* Grid de cidades */}
        <div className="max-w-4xl mx-auto">
          {error ? (
            <div className="text-center py-8">
              <p className="text-cream/60 mb-4">{error}</p>
              <button
                onClick={refresh}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cream/10 hover:bg-cream/20 transition-colors text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Tentar novamente
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {loading && data.length === 0
                  ? // Skeleton loading
                    Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="p-5 rounded-xl bg-cream/5 border border-cream/10 animate-pulse"
                      >
                        <div className="h-4 w-16 bg-cream/10 rounded mb-4" />
                        <div className="h-8 w-8 bg-cream/10 rounded-full mx-auto mb-3" />
                        <div className="h-8 w-12 bg-cream/10 rounded mx-auto mb-2" />
                        <div className="h-3 w-20 bg-cream/10 rounded mx-auto mb-3" />
                        <div className="h-3 w-16 bg-cream/10 rounded mx-auto" />
                      </div>
                    ))
                  : data.map((city) => (
                      <div
                        key={city.city}
                        className="p-5 rounded-xl bg-cream/5 border border-cream/10 hover:bg-cream/10 transition-all group text-center"
                      >
                        {/* Nome da cidade */}
                        <div className="flex items-center justify-center gap-1.5 mb-4">
                          <MapPin className="w-3.5 h-3.5 text-amarelo" />
                          <span className="text-xs font-bold uppercase tracking-wider text-cream/80">
                            {city.city}
                          </span>
                        </div>

                        {/* Ícone do tempo */}
                        <div className="flex justify-center mb-3 group-hover:scale-110 transition-transform">
                          {getWeatherIcon(city.weathercode)}
                        </div>

                        {/* Temperatura */}
                        <p className="text-3xl md:text-4xl font-display font-bold text-cream mb-1">
                          {city.temperature}°
                        </p>

                        {/* Condição */}
                        <p className="text-xs text-cream/60 mb-3">
                          {city.condition}
                        </p>

                        {/* Vento */}
                        <div className="flex items-center justify-center gap-1.5 text-cream/40">
                          <Wind className="w-3.5 h-3.5" />
                          <span className="text-[11px]">
                            {city.windspeed} km/h
                          </span>
                        </div>
                      </div>
                    ))}
              </div>

              {/* Footer com última atualização */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-cream/40">
                {lastUpdated && (
                  <span className="text-xs">
                    Atualizado às {formatTime(lastUpdated)}
                  </span>
                )}
                <button
                  onClick={refresh}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cream/5 hover:bg-cream/10 border border-cream/10 transition-colors text-xs disabled:opacity-50"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
                  />
                  Atualizar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Weather;
