// Player related types
export interface PlayerStats {
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  efficiency: number;
}

export interface PlayerContract {
  salary: number;
  years: number;
  totalValue: number;
}

export interface PlayerPrediction {
  nextSeasonPoints: number;
  improvementChance: number;
  marketValue: number;
  potential: string;
}

export interface PlayerData {
  name: string;
  team: string;
  position: string;
  age: number;
  stats: PlayerStats;
  contract: PlayerContract;
  prediction: PlayerPrediction;
}

// API related types
export interface ApiResponse {
  success: boolean;
  data?: PlayerData;
  error?: string;
}

export interface Player {
  name: string;
  age: string;
  height: string;
  sex: string;
  player_url: string;
}