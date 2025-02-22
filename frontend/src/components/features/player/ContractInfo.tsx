import React from 'react';
import { DollarSign, Calendar } from 'lucide-react';
import { PlayerContract } from '../../../types/index';
import { formatCurrency } from '../../../utils/formatters';

interface ContractInfoProps {
  contract: PlayerContract;
}

export const ContractInfo: React.FC<ContractInfoProps> = ({ contract }) => {
  return (
    <div className="glass-effect rounded-2xl shadow-lg p-8 stat-card animate-scale-in" style={{ animationDelay: '0.2s' }}>
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text">
        Contract Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-center space-x-4 p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 backdrop-blur-lg
                      transform transition-transform duration-300 hover:scale-105">
          <div className="p-3 bg-blue-500 rounded-lg">
            <DollarSign className="text-white" size={28} />
          </div>
          <div>
            <p className="text-sm text-blue-600 font-medium">Annual Salary</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(contract.salary)}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-100/50 backdrop-blur-lg
                      transform transition-transform duration-300 hover:scale-105">
          <div className="p-3 bg-green-500 rounded-lg">
            <Calendar className="text-white" size={28} />
          </div>
          <div>
            <p className="text-sm text-green-600 font-medium">Contract Length</p>
            <p className="text-xl font-bold text-gray-900">{contract.years} years</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100/50 backdrop-blur-lg
                      transform transition-transform duration-300 hover:scale-105">
          <div className="p-3 bg-purple-500 rounded-lg">
            <DollarSign className="text-white" size={28} />
          </div>
          <div>
            <p className="text-sm text-purple-600 font-medium">Total Value</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(contract.totalValue)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};