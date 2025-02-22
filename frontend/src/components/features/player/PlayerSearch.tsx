import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface PlayerSearchProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export const PlayerSearch: React.FC<PlayerSearchProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className={`relative flex items-center transition-all duration-300 ${isFocused ? 'scale-105' : ''}`}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Enter player name..."
          className="w-full px-6 py-4 rounded-xl border-2 border-transparent bg-white/80 backdrop-blur-lg
                   shadow-lg focus:shadow-blue-500/20 focus:border-blue-500 outline-none
                   transition-all duration-300 text-lg"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="absolute right-3 p-3 text-gray-600 hover:text-blue-500 
                   disabled:opacity-50 transition-colors duration-300
                   hover:bg-blue-50 rounded-lg"
        >
          <Search size={24} />
        </button>
      </div>
    </form>
  );
};