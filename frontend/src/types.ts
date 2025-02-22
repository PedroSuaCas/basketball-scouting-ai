export interface PlayerData {
  name: string;
  team: string;
  position: string;
  age: number;
  stats: {
    points: number;
    rebounds: number;
    assists: number;
    steals: number;
    blocks: number;
    efficiency: number;
  };
  contract: {
    salary: number;
    years: number;
    totalValue: number;
  };
  prediction: {
    nextSeasonPoints: number;
    improvementChance: number;
    marketValue: number;
    potential: string;
  };
}

export interface ApiResponse {
  success: boolean;
  data?: PlayerData;
  error?: string;
}