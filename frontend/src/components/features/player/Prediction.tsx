import React from 'react';
import { TrendingUp, Star, DollarSign } from 'lucide-react';
import { PlayerPrediction } from '../../../types/index';
import { formatCurrency } from '../../../utils/formatters';

interface PredictionProps {
  prediction: PlayerPrediction;
}

export const Prediction: React.FC<PredictionProps> = ({ prediction }) => {
  return (
    <div className="glass-effect rounded-2xl shadow-lg p-8 stat-card animate-scale-in" style={{ animationDelay: '0.3s' }}>
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text">
        Future Predictions
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="flex items-center space-x-4 p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50
                        transform transition-transform duration-300 hover:scale-105">
            <div className="p-3 bg-blue-500 rounded-lg">
              <TrendingUp className="text-white" size={28} />
            </div>
            <div>
              <p className="text-sm text-blue-600 font-medium">Next Season Points</p>
              <p className="text-xl font-bold text-gray-900">{prediction.nextSeasonPoints.toFixed(1)} PPG</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-6 rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100/50
                        transform transition-transform duration-300 hover:scale-105">
            <div className="p-3 bg-yellow-500 rounded-lg">
              <Star className="text-white" size={28} />
            </div>
            <div>
              <p className="text-sm text-yellow-600 font-medium">Improvement Chance</p>
              <p className="text-xl font-bold text-gray-900">{(prediction.improvementChance * 100).toFixed(1)}%</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-center space-x-4 p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-100/50
                        transform transition-transform duration-300 hover:scale-105">
            <div className="p-3 bg-green-500 rounded-lg">
              <DollarSign className="text-white" size={28} />
            </div>
            <div>
              <p className="text-sm text-green-600 font-medium">Market Value</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(prediction.marketValue)}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100/50
                        transform transition-transform duration-300 hover:scale-105">
            <div className="p-3 bg-purple-500 rounded-lg">
              <Star className="text-white" size={28} />
            </div>
            <div>
              <p className="text-sm text-purple-600 font-medium">Potential</p>
              <p className="text-xl font-bold text-gray-900">{prediction.potential}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};