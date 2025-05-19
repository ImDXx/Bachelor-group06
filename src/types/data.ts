/**
 * data.ts
 * 
 * Type definitions for the Ulstein Dashboard application
 * Contains interfaces for various data structures used throughout the application:
 * - Position: Basic geographical coordinates with timestamp
 * - Vessel: Vessel information including position and identification
 * - MarkerInfo: Map marker data for vessels and turbines
 * - serVessel: Detailed vessel information including weather conditions
 * - ServiceData: Service operation metrics and vessel performance data
 */


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
    airTemperature: number;
    currentSpeed: number;
    gust: number;
    swellHeight: number;
    waterTemperature: number;
  };
  serviceTime?: string;
}

export interface ServiceData {
  vesselId: string;
  vesselName: string;
  beaufortScale: number;
  serviceTime: string;
  waveHeight: number;
  windSpeed: number;
  connectionStatus: string;
  type: 'ulstein' | 'competitor';
  timeUsed: string;
  isCompetitor: boolean;
}