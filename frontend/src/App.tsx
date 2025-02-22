import React, { useState } from 'react';
import { ShoppingBasket as Basketball } from 'lucide-react';
import { PlayerSearch } from './components/features/player/PlayerSearch';
import { PlayerStats } from './components/features/player/PlayerStats';
import { ContractInfo } from './components/features/player/ContractInfo';
import { Prediction } from './components/features/player/Prediction';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { PlayerService } from './services/api';
import { PlayerData } from './types';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError(null);
    
    const response = await PlayerService.searchPlayer(query);
    
    if (response.success && response.data) {
      setPlayerData(response.data);
      setError(null);
    } else {
      setError(response.error || 'Failed to fetch player data');
      setPlayerData(null);
    }
    
    setIsLoading(false);
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-8 px-4"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=2400&blur=100')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center animate-fade-in">
          <div className="inline-flex items-center justify-center gap-3 mb-4 px-6 py-2 rounded-full glass-effect">
            <Basketball size={40} className="text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text">
              Basketball Scout AI
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto mt-4 glass-effect rounded-lg px-6 py-3 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Enter a player's name to get detailed statistics, contract information, and AI-powered performance predictions.
          </p>
        </div>

        <div className="flex justify-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <PlayerSearch onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {isLoading && (
          <div className="flex justify-center py-12 animate-fade-in">
            <LoadingSpinner />
          </div>
        )}

        {error && (
          <div className="animate-fade-in max-w-2xl mx-auto">
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl text-center glass-effect">
              {error}
            </div>
          </div>
        )}

        {playerData && !isLoading && (
          <div className="space-y-6 animate-fade-in">
            <PlayerStats player={playerData} />
            <ContractInfo contract={playerData.contract} />
            <Prediction prediction={playerData.prediction} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;