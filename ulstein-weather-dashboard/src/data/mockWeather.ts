import { WeatherData } from '../types/data';

export const mockWeather: WeatherData[] = [
  {
    position: {
      latitude: 57.7089,
      longitude: 11.9746,
      timestamp: "2024-04-03T10:00:00Z"
    },
    windSpeed: 8.5,
    waveHeight: 2.1,
    beaufortScale: 4,
    temperature: 12.5
  },
  {
    position: {
      latitude: 57.7085,
      longitude: 11.9740,
      timestamp: "2024-04-03T10:00:00Z"
    },
    windSpeed: 7.8,
    waveHeight: 1.8,
    beaufortScale: 3,
    temperature: 12.2
  },
  {
    position: {
      latitude: 57.7088,
      longitude: 11.9744,
      timestamp: "2024-04-03T10:00:00Z"
    },
    windSpeed: 8.1,
    waveHeight: 1.9,
    beaufortScale: 4,
    temperature: 12.4
  }
]; 