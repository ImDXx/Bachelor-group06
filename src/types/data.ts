export interface Position {
  latitude: number;
  longitude: number;
  timestamp: string;
}

export interface Vessel {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  timestamp: number;
}

export interface WindTurbine {
  id: string;
  name: string;
  position: Position;
}

export interface WeatherData {
  position: {
    latitude: number;
    longitude: number;
    timestamp: string;
  };
  windSpeed: number;
  waveHeight: number;
  beaufortScale: number;
  temperature: number;
}

export interface ServiceEvent {
  vesselId: string;
  turbineId: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  weatherConditions: WeatherData;
}

export interface MarkerInfo {
  id: string;
  name?: string;
  latitude: number;
  longitude: number;
  type: 'ulstein' | 'competitor' | 'turbine';
  speed?: number;
  connectionStatus?: string;
  airTemperature?: number;
  currentSpeed?: number;
  gust?: number;
  swellHeight?: number;
  waterTemperature?: number;
  waveHeight?: number;
  windSpeed?: number;
}

export interface serVessel {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  speed?: number;
  connectionStatus?: string;
  timestamp: number;
  weatherConditions: {
    windSpeed: number;
    waveHeight: number;
    beaufortScale: number;
    airTemperature: number; // Updated to match the CSV field
    currentSpeed: number;
    gust: number;
    swellHeight: number;
    waterTemperature: number;
  };
  serviceTime?: string; // Add service time to each vessel
}