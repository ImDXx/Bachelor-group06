import { ServiceEvent } from '../../src/types/data';

export const mockServiceEvents: ServiceEvent[] = [
  {
    vesselId: "V001",
    turbineId: "T001",
    startTime: "2024-04-03T10:05:00Z",
    endTime: "2024-04-03T10:15:00Z",
    duration: 10,
    weatherConditions: {
      position: {
        latitude: 57.7090,
        longitude: 11.9747,
        timestamp: "2024-04-03T10:05:00Z"
      },
      windSpeed: 8.5,
      waveHeight: 2.1,
      beaufortScale: 4,
      temperature: 12.5
    }
  },
  {
    vesselId: "V002",
    turbineId: "T002",
    startTime: "2024-04-03T10:05:00Z",
    endTime: "2024-04-03T10:20:00Z",
    duration: 15,
    weatherConditions: {
      position: {
        latitude: 57.7086,
        longitude: 11.9741,
        timestamp: "2024-04-03T10:05:00Z"
      },
      windSpeed: 7.8,
      waveHeight: 1.8,
      beaufortScale: 3,
      temperature: 12.2
    }
  }
]; 