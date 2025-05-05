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
  TIMESTAMP_UTC: string;
  LAT: number;
  LON: number;
  AIR_TEMPERATURE: number;
  WIND_SPEED: number;
  WIND_DIRECTION: number;
  WAVE_HEIGHT: number;
  WAVE_DIRECTION: number;
  CURRENT_SPEED: number;
  CLOUD_COVER: number;
  HUMIDITY: number;
  PRESSURE: number;
  VISIBILITY: number;
  SOURCE: string;
}

export interface ServiceEvent {
  vesselId: string;
  turbineId: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  weatherConditions: WeatherData;
} 