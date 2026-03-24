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
  Droplets,
} from "lucide-react";
import { useWeather } from "@/hooks/useWeather";
import { Animated, AnimatedGrid } from "@/components/ui/animated";

// Mapeamento de weathercode para ícone e cor
function getWeatherIcon(code: number, size: string = "w-10 h-10") {
  if (code === 0) return <Sun className={`${size} text-amarelo drop-shadow-lg`} />;
  if (code >= 1 && code <= 3) return <Cloud className={`${size} text-slate-300`} />;
  if (code >= 45 && code <= 48) return <CloudFog className={`${size} text-slate-400`} />;
  if (code >= 51 && code <= 67) return <CloudRain className={`${size} text-blue-400`} />;
  if (code >= 71 && code <= 77) return <CloudSnow className={`${size} text-white`} />;
  if (code >= 80 && code <= 86) return <CloudRain className={`${size} text-blue-400`} />;
  if (code >= 95 && code <= 99) return <CloudLightning className={`${size} text-amarelo`} />;
  return <Cloud className={`${size} text-slate-400`} />;
}

// Background gradient based on weather
function getWeatherGradient(code: number) {
  if (code === 0) return "from-amber-500/20 to-orange-500/10"; // Sunny
  if (code >= 1 && code <= 3) return "from-slate-400/20 to-slate-500/10"; // Cloudy
  if (code >= 45 && code <= 48) return "from-slate-500/20 to-slate-600/10"; // Fog
  if (code >= 51 && code <= 67) return "from-blue-500/20 to-blue-600/10"; // Rain
  if (code >= 71 && code <= 77) return "from-slate-200/20 to-white/10"; // Snow
  if (code >= 80 && code <= 86) return "from-blue-400/20 to-blue-500/10"; // Showers
  if (code >= 95 && code <= 99) return "from-purple-500/20 to-amber-500/10"; // Thunderstorm
  return "from-slate-400/20 to-slate-500/10";
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
      className="py-20 md:py-28 bg-gradient-to-b from-charcoal via-charcoal/95 to-charcoal text-cream relative overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amarelo/5 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-float" />

        {/* Weather pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='30' cy='30' r='4' fill='%23ffffff'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <Animated animation="fade-up" className="max-w-2xl mx-auto text-center mb-14 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amarelo/10 border border-amarelo/20 mb-6">
            <Thermometer className="w-4 h-4 text-amarelo" />
            <span className="text-[11px] font-semibold uppercase tracking-widest text-amarelo">
              Meteorologia
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-semibold mb-6 leading-tight">
            Tempo em <span className="text-gradient-brand">Portugal</span>
          </h2>
          <p className="text-base md:text-lg text-cream/60 max-w-xl mx-auto leading-relaxed">
            Previsão meteorológica atual para as principais cidades portuguesas.
          </p>
        </Animated>

        {/* Weather Grid */}
        <div className="max-w-5xl mx-auto">
          {error ? (
            <Animated animation="fade-up" className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-500/10 flex items-center justify-center">
                <CloudRain className="w-8 h-8 text-red-400" />
              </div>
              <p className="text-cream/60 mb-6">{error}</p>
              <button
                onClick={refresh}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cream/10 hover:bg-cream/20 transition-all text-sm font-medium btn-magnetic"
              >
                <RefreshCw className="w-4 h-4" />
                Tentar novamente
              </button>
            </Animated>
          ) : (
            <>
              <AnimatedGrid
                className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
                staggerDelay={100}
                animation="fade-up"
              >
                {loading && data.length === 0
                  ? // Skeleton loading
                    Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="relative p-6 rounded-2xl bg-white/5 border border-white/10 animate-pulse"
                      >
                        <div className="h-4 w-20 bg-white/10 rounded-lg mb-6 mx-auto" />
                        <div className="h-12 w-12 bg-white/10 rounded-full mx-auto mb-4" />
                        <div className="h-10 w-16 bg-white/10 rounded-lg mx-auto mb-3" />
                        <div className="h-4 w-24 bg-white/10 rounded-lg mx-auto mb-4" />
                        <div className="h-3 w-20 bg-white/10 rounded-lg mx-auto" />
                      </div>
                    ))
                  : data.map((city) => (
                      <div
                        key={city.city}
                        className={`relative p-6 rounded-2xl bg-gradient-to-br ${getWeatherGradient(city.weathercode)} backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-500 group card-3d overflow-hidden`}
                      >
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* City name badge */}
                        <div className="relative flex items-center justify-center gap-1.5 mb-5">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/10">
                            <MapPin className="w-3 h-3 text-amarelo" />
                            <span className="text-xs font-bold uppercase tracking-wider text-cream">
                              {city.city}
                            </span>
                          </div>
                        </div>

                        {/* Weather icon with animation */}
                        <div className="relative flex justify-center mb-4">
                          <div className="group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                            {getWeatherIcon(city.weathercode, "w-14 h-14")}
                          </div>
                        </div>

                        {/* Temperature */}
                        <p className="relative text-4xl md:text-5xl font-display font-bold text-cream text-center mb-2">
                          {city.temperature}
                          <span className="text-2xl text-cream/60">°C</span>
                        </p>

                        {/* Condition */}
                        <p className="relative text-sm text-cream/70 text-center mb-4 font-medium">
                          {city.condition}
                        </p>

                        {/* Wind & Humidity */}
                        <div className="relative flex items-center justify-center gap-4 pt-4 border-t border-white/10">
                          <div className="flex items-center gap-1.5 text-cream/50">
                            <Wind className="w-4 h-4" />
                            <span className="text-xs font-medium">
                              {city.windspeed} km/h
                            </span>
                          </div>
                          {city.humidity && (
                            <div className="flex items-center gap-1.5 text-cream/50">
                              <Droplets className="w-4 h-4" />
                              <span className="text-xs font-medium">
                                {city.humidity}%
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
              </AnimatedGrid>

              {/* Footer with last update */}
              <Animated animation="fade-up" delay={500}>
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                  {lastUpdated && (
                    <span className="text-xs text-cream/40 flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      Atualizado às {formatTime(lastUpdated)}
                    </span>
                  )}
                  <button
                    onClick={refresh}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-xs font-medium text-cream/70 hover:text-cream disabled:opacity-50 btn-magnetic"
                  >
                    <RefreshCw
                      className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
                    />
                    Atualizar dados
                  </button>
                </div>
              </Animated>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Weather;
