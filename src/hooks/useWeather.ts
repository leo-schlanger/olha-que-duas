import { useState, useEffect, useCallback } from "react";
import type {
  OpenMeteoResponse,
  CityWeather,
  WeatherState,
  CityConfig,
} from "@/types/weather";

// Coordenadas das cidades portuguesas
const CITIES: CityConfig[] = [
  { name: "Porto", latitude: 41.1579, longitude: -8.6291 },
  { name: "Cascais", latitude: 38.6979, longitude: -9.4215 },
  { name: "Lisboa", latitude: 38.7223, longitude: -9.1393 },
  { name: "Faro", latitude: 37.0194, longitude: -7.9322 },
];

// Intervalo de atualização: 10 minutos
const UPDATE_INTERVAL = 10 * 60 * 1000;

// Timeout por cidade — sem isto, uma cidade pendurada bloqueava a faixa
// inteira via Promise.all. Open-Meteo costuma responder em <500ms.
const FETCH_TIMEOUT_MS = 5000;

// Mapeamento de weathercode para condições em português
function getWeatherCondition(code: number): string {
  if (code === 0) return "Céu limpo";
  if (code >= 1 && code <= 3) return "Parcialmente nublado";
  if (code >= 45 && code <= 48) return "Nevoeiro";
  if (code >= 51 && code <= 57) return "Chuvisco";
  if (code >= 61 && code <= 67) return "Chuva";
  if (code >= 71 && code <= 77) return "Neve";
  if (code >= 80 && code <= 86) return "Aguaceiros";
  if (code >= 95 && code <= 99) return "Trovoada";
  return "Indeterminado";
}

// Fetch do tempo de uma cidade — com timeout próprio para não bloquear
// a faixa do tempo se uma cidade ficar pendurada.
async function fetchCityWeather(city: CityConfig): Promise<CityWeather> {
  const url = `/api/weather?latitude=${city.latitude}&longitude=${city.longitude}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`Erro ao buscar tempo para ${city.name}`);
    }

    const data: OpenMeteoResponse = await response.json();
    const { current_weather } = data;

    return {
      city: city.name,
      temperature: Math.round(current_weather.temperature),
      windspeed: Math.round(current_weather.windspeed),
      weathercode: current_weather.weathercode,
      condition: getWeatherCondition(current_weather.weathercode),
      time: current_weather.time,
    };
  } finally {
    clearTimeout(timeout);
  }
}

export function useWeather() {
  const [state, setState] = useState<WeatherState>({
    data: [],
    loading: true,
    error: null,
    lastUpdated: null,
  });

  const fetchWeather = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    // Promise.allSettled em vez de Promise.all — uma cidade que falhe (rede,
    // timeout) não deve esconder as outras. Erro só se TODAS falharem.
    const settled = await Promise.allSettled(CITIES.map(fetchCityWeather));
    const successes: CityWeather[] = [];
    const failures: string[] = [];
    settled.forEach((result, i) => {
      if (result.status === "fulfilled") {
        successes.push(result.value);
      } else {
        failures.push(CITIES[i].name);
      }
    });

    if (successes.length === 0) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: `Erro ao carregar tempo (${failures.join(", ")})`,
      }));
      return;
    }

    setState({
      data: successes,
      loading: false,
      // Sucesso parcial não é erro — o utilizador vê o que conseguimos
      error: null,
      lastUpdated: new Date(),
    });

    if (failures.length > 0) {
      console.warn(`[useWeather] partial failure: ${failures.join(", ")}`);
    }
  }, []);

  useEffect(() => {
    fetchWeather();

    const interval = setInterval(fetchWeather, UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchWeather]);

  return {
    ...state,
    refresh: fetchWeather,
  };
}
