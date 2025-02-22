import axios from 'axios';
import { ApiResponse } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const PlayerService = {
  async searchPlayer(playerName: string): Promise<ApiResponse> {
    try {
      const response = await apiClient.post<ApiResponse>('/query', {
        player_name: playerName
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.message || 'Error connecting to the server'
        };
      }
      return {
        success: false,
        error: 'An unexpected error occurred'
      };
    }
  }
};