import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-500"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 border-4 border-transparent rounded-full animate-ping border-t-blue-500"></div>
      </div>
      <p className="text-blue-600 font-medium animate-pulse">Loading player data...</p>
    </div>
  );
};