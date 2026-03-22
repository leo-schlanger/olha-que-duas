// Resposta da API Open-Meteo
export interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  current_weather: {
    temperature: number;
    windspeed: number;
    winddirection: number;
    weathercode: number;
    time: string;
  };
}

// Dados processados de uma cidade
export interface CityWeather {
  city: string;
  temperature: number;
  windspeed: number;
  weathercode: number;
  condition: string;
  time: string;
}

// Estado do hook
export interface WeatherState {
  data: CityWeather[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

// Configuração de uma cidade
export interface CityConfig {
  name: string;
  latitude: number;
  longitude: number;
}
