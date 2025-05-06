import { Vessel } from '@/types/data';

export const mockVessels: Vessel[] = [
  {
    id: "UV001",
    name: "Ulstein Blue Star",
    atService: true,
    positions: [
      {
        latitude: 55.5000,
        longitude: 2.5000,
        timestamp: "2024-04-03T10:00:00Z"
      },
      {
        latitude: 55.4800,
        longitude: 2.4800,
        timestamp: "2024-04-03T10:05:00Z"
      },
      {
        latitude: 55.4600,
        longitude: 2.4600,
        timestamp: "2024-04-03T10:10:00Z"
      }
    ]
  },
  {
    id: "UV002",
    name: "Ulstein Blue Nova",
    atService: true,
    positions: [
      {
        latitude: 54.2000,
        longitude: 1.8000,
        timestamp: "2024-04-03T10:00:00Z"
      },
      {
        latitude: 54.1800,
        longitude: 1.7800,
        timestamp: "2024-04-03T10:05:00Z"
      },
      {
        latitude: 54.1600,
        longitude: 1.7600,
        timestamp: "2024-04-03T10:10:00Z"
      }
    ]
  },
  {
    id: "UV003",
    name: "Ulstein Blue Power",
    atService: false,
    positions: [
      {
        latitude: 54.400,
        longitude: 1.9000,
        timestamp: "2024-04-03T10:00:00Z"
      },
      {
        latitude: 54.2000,
        longitude: 1.8000,
        timestamp: "2024-04-03T10:05:00Z"
      },
      {
        latitude: 54.1800,
        longitude: 1.7000,
        timestamp: "2024-04-03T10:10:00Z"
      }
    ]
  },
  {
    id: "CV001",
    name: "Competitor Wind Master", 
    atService: false,
    positions: [
      {
        latitude: 55.0000,
        longitude: 3.0000,
        timestamp: "2024-04-03T10:00:00Z"
      },
      {
        latitude: 54.9800,
        longitude: 2.9800,
        timestamp: "2024-04-03T10:05:00Z"
      },
      {
        latitude: 54.9600,
        longitude: 2.9600,
        timestamp: "2024-04-03T10:10:00Z"
      }
    ]
  },
  {
    id: "CV002",
    name: "Competitor Sea Service",
    atService: true,
    positions: [
      {
        latitude: 53.8000,
        longitude: 2.2000,
        timestamp: "2024-04-03T10:00:00Z"
      },
      {
        latitude: 53.7800,
        longitude: 2.1800,
        timestamp: "2024-04-03T10:05:00Z"
      },
      {
        latitude: 53.7600,
        longitude: 2.1600,
        timestamp: "2024-04-03T10:10:00Z"
      }
    ]
  }
]; 