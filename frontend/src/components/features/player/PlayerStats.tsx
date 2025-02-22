import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';
import { PlayerData } from '../../../types';

interface PlayerStatsProps {
  player: PlayerData;
}

export const PlayerStats: React.FC<PlayerStatsProps> = ({ player }) => {
  const statsData = [
    { subject: 'Points', value: player.stats.points },
    { subject: 'Rebounds', value: player.stats.rebounds },
    { subject: 'Assists', value: player.stats.assists },
    { subject: 'Steals', value: player.stats.steals },
    { subject: 'Blocks', value: player.stats.blocks },
    { subject: 'Efficiency', value: player.stats.efficiency },
  ];

  return (
    <div className="glass-effect rounded-2xl shadow-lg p-8 stat-card animate-scale-in">
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text">
        Player Statistics
      </h2>
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="w-full md:w-1/2">
          <div className="mb-6 space-y-3">
            <p className="text-gray-600 text-lg">
              Team: <span className="font-semibold text-gray-900">{player.team}</span>
            </p>
            <p className="text-gray-600 text-lg">
              Position: <span className="font-semibold text-gray-900">{player.position}</span>
            </p>
            <p className="text-gray-600 text-lg">
              Age: <span className="font-semibold text-gray-900">{player.age}</span>
            </p>
          </div>
          <div className="space-y-3">
            {Object.entries(player.stats).map(([key, value], index) => (
              <div 
                key={key} 
                className="flex justify-between items-center p-3 rounded-lg hover:bg-blue-50 transition-colors duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="capitalize text-gray-600 text-lg">{key}:</span>
                <span className="font-semibold text-lg text-gray-900">{value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full md:w-1/2 h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={statsData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fill: '#64748b', fontSize: 14 }}
              />
              <Radar
                name="Stats"
                dataKey="value"
                stroke="#2563eb"
                fill="#3b82f6"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};