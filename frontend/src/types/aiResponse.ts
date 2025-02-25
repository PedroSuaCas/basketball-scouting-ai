// src/types/aiResponse.ts
export interface PlayerInfo {
    name: string;
    team: string;
    nationality: string;
    age: number;
    height: string;
    position: string;
    image_url?: string;
  }
  
  export interface AIResponse {
    type: "text" | "player";
    content?: string;
    player?: PlayerInfo;
  }
  