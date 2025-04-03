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
  position: Position;
  windSpeed: number;  // in m/s
  waveHeight: number; // in meters
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