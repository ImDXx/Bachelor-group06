export interface Position {
  latitude: number;
  longitude: number;
  timestamp: string;
}

export interface Vessel {
  id: string;
  name: string;
  positions: Position[];
  atService: boolean;
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