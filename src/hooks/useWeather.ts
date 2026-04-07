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

// Fetch do tempo de uma cidade
async function fetchCityWeather(city: CityConfig): Promise<CityWeather> {
  const url = `/api/weather?latitude=${city.latitude}&longitude=${city.longitude}`;

  const response = await fetch(url);
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

    try {
      // Fetch paralelo de todas as cidades
      const results = await Promise.all(CITIES.map(fetchCityWeather));

      setState({
        data: results,
        loading: false,
        error: null,
        lastUpdated: new Date(),
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : "Erro ao carregar tempo",
      }));
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
