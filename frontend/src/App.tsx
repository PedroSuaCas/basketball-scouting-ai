import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation} from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Search, ChevronDown, Filter, ShoppingBasket as Basketball, Loader2, Send } from 'lucide-react';
//import { clsx } from 'clsx';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import PlayerProfile from './PlayerProfile';


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000";

/*const trendingSearches = [
  'Top scorers in the EuroLeague 2024',
  'Top rebounders in the AC',
  'Offensive efficiency rankings in the NCAA'
];*/

/*const categories = [
  'Discover',
  'Top Scorers',
  'Playmakers',
  'Defensive Anchors',
  'Rising Stars',
  'Clutch Performers',
  'Three-Point Specialists'
];*/

// List of all countries for the passport dropdown
const countries = [
  "USA", "Spain", "France", "Serbia", "Greece", "Lithuania", "Argentina", "Australia", 
  "Croatia", "Slovenia", "Italy", "Germany", "Brazil", "Canada", "Turkey", "Other"
].sort();

// Basketball positions
const positions = ["PG", "SG", "SF", "PF", "C"];


function HomePage() {
  //const [selectedCategory, setSelectedCategory] = useState('Popular');
  const [initialMessage, setInitialMessage] = useState("");
  const [followUpMessage, setFollowUpMessage] = useState("");
  const [hasInitialQuestion, setHasInitialQuestion] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resultsEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [players, setPlayers] = useState([]);

  //const location = useLocation();
  const [response, setResponse] = useState<{
    type: string;
    content?: string;
    player_info?: {
      image_url?: string;
      player?: { name: string };
    };
  } | null>(null);

  // Filters 
  const [heightUnit, setHeightUnit] = useState<'m'|'in'>('m');

  const [filters, setFilters] = useState({
    name: '',
    passport: '',
    height: '',
    position: '',
    year: '',
    pts: '',
    rbd: '',
    ast: ''
  });

  const [playerStats, setPlayerStats] = useState<{
    team: string;
    games_played: string;
    points_per_game: string;
    rebounds_per_game: string;
    assists_per_game: string;
  } | null>(null);


  //scroll for every search
  const scrollToBottom = () => {
    resultsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    if (response || error) {
      scrollToBottom();
    }
  }, [response, error]);
  // fin scroll

  // var proballers
  //const [players, setPlayers] = useState([]);

  // Function to calculate age as of the date
  const calculateAge = (birthday: string) => {
    if (!birthday) return 'N/A';
    const birthDate = new Date(birthday);
    const today = new Date();
    return today.getFullYear() - birthDate.getFullYear();
  };
  // fin var
 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };


  // **1. Search with lens to call Mistral ai

  const handleSendMessage = async (message: string, isFollowUp: boolean = false) => {
    if (!message.trim()) return;

    setIsLoading(true);
    setError(null);
    setPlayerStats(null);
    setPlayers([]);

    try {
      const res = await fetch(`${BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      if (data.response) {
        setResponse(data.response);
        if (!isFollowUp) {
          setHasInitialQuestion(true);
        }
        setFollowUpMessage("");

        if (data.response.player_name) {
          console.log(`🎯 Player detected: ${data.response.player_name}`);
        }
      } else {
        setError("Error in Mistral AI response");
      }
    } catch (error) {
      setError("Error connecting to server.");
      console.error("Error connecting to server: ", error);
    }

    setIsLoading(false);
  };
// fin mistral ai

// **2. search with form to query Proballers api )**
  const handleSearchProballers = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!filters.name.trim()) {
      alert("Please enter a player's name."); // in the future modify to show popup
      return;
    }

    setIsLoading(true);
    setError(null);
    setPlayerStats(null);
    setPlayers([]);
  
    try {
      const res = await fetch(`${BACKEND_URL}/api/search_player`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",  // ✅ Enviar JSON correctamente
        },
        body: JSON.stringify({ query: filters.name }),  // ✅ Enviar el query correctamente
      });
  
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
  
      const data = await res.json();
      setPlayers(data.players || []);
    } catch (error) {
      console.error("Error fetching players:", error);
      setError("Error fetching player data.");
    } finally {
      setIsLoading(false);
    }
  };  


  // Call to /api/stats basketball reference
  const fetchPlayerStats = async () => {
    if (!response?.player_name) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BACKEND_URL}/api/stats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ player_name: response.player_name }),
      });

      const data = await res.json();

      if (data.stats) {
        setPlayerStats(data.stats);
      } else {
        setError("No statistics found.");
      }
    } catch (error) {
      setError("Error fetching statistics.");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Basketball className="w-8 h-8 text-[#8B0000]" />
              <h1 className="text-2xl font-bold text-[#8B0000]">Hoops data AI</h1>
            </div>
            <div className="flex items-center gap-6">
              <button className="flex items-center gap-1">
                Explore players
                <ChevronDown className="w-4 h-4" />
              </button>
              <button className="flex items- center gap-1">
                Pricing
                <ChevronDown className="w-4 h-4" />
              </button>
              <button>Post your profile</button>
              <button>Blog</button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-gray-700">Sign up</button>
            <button className="px-4 py-2 bg-[#8B0000] text-white rounded-full">
              Log in
            </button>
          </div>
        </div>
      </nav>

      {/* Title Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-6xl font-bold text-[#8B0000] mb-6">
          Unlock the game<br />behind the numbers
        </h2>
        <p className="text-xl text-gray-700 mb-12">
          Analyze and compare player performance with real-time data. Advanced tools for coaches, analysts, and scouts.
        </p>

        {/* Initial Search Bar */}
        {!hasInitialQuestion && (
          <div className="max-w-3xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={initialMessage}
                onChange={(e) => setInitialMessage(e.target.value)}
                placeholder="What player or metric are you looking for? - Write here or select criteria below"
                className="w-full py-4 pl-12 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(initialMessage)}
              />
              <button
                onClick={() => handleSendMessage(initialMessage)}
                disabled={isLoading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-[#8B0000] text-white rounded-full disabled:bg-gray-400"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
              </button>

            </div>
          </div>
        )}

       {/* Formulario de búsqueda avanzado */}
        
        <form onSubmit={handleSearchProballers} className="space-y-6 p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Name */}
            <div className='flex items-center gap-3'>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input 
                type="text" 
                name="name" 
                value={filters.name} 
                onChange={handleChange} 
                className="w-full rounded-md border-gray-300 shadow-sm"
                placeholder="Enter player's name"
              />
            </div>

            {/* Nationality */}
            <div className='flex items-center gap-3'>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
              <select 
                name="passport" 
                value={filters.passport} 
                onChange={handleChange} 
                className="w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="">Select nationality</option>
                {countries.map((country, index) => (
                  <option key={index} value={country}>{country}</option>
                ))}
              </select>
            </div>

            {/* Height */}
            <div className='flex items-center gap-3'>
              <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  name="height" 
                  value={filters.height} 
                  onChange={handleChange} 
                  step="0.01" 
                  className="flex-1 rounded-md border-gray-300 shadow-sm"
                  placeholder="Enter height: m or in"
                />
                <select 
                  value={heightUnit} 
                  onChange={(e) => setHeightUnit(e.target.value as 'm' | 'in')} 
                  className="w-20 rounded-md border-gray-300 shadow-sm"
                >
                  <option value="m">m</option>
                  <option value="in">in</option>
                </select>
              </div>
            </div>

            {/* Position */}
            <div className='flex items-center gap-3'>
              <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
              <select 
                name="position" 
                value={filters.position} 
                onChange={handleChange} 
                className="w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="">Select position</option>
                {positions.map((pos, index) => (
                  <option key={index} value={pos}>{pos}</option>
                ))}
              </select>
            </div>

            {/* Year */}
            <div className='flex items-center gap-3'>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input 
                type="number" 
                name="year" 
                value={filters.year} 
                onChange={handleChange} 
                min="1980" 
                max={new Date().getFullYear()} 
                className="w-full rounded-md border-gray-300 shadow-sm"
                placeholder="Select year"
              />
            </div>

            {/* PTS, RBT, AST con botones de incremento y decremento */}
            {['pts', 'rbd', 'ast'].map((stat) => (
              <div className='flex items-center gap-3' key={stat}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{stat.toUpperCase()}</label>
                <div className="">
                  <button 
                    type="button" 
                    onClick={() => setFilters(prev => ({ ...prev, [stat]: Math.max(0, (Number(prev[stat]) || 0) - 1) }))}
                    className="px-2 py-1 bg-gray-300 rounded-md"
                  >
                    -
                  </button>
                  <input 
                    type="text" 
                    name={stat} 
                    value={filters[stat]} 
                    onChange={handleChange} 
                    className="w-16 text-center rounded-md border-gray-300 shadow-sm"
                  />
                  <button 
                    type="button" 
                    onClick={() => setFilters(prev => ({ ...prev, [stat]: (Number(prev[stat]) || 0) + 1 }))}
                    className="px-2 py-1 bg-gray-300 rounded-md"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button 
            type="submit" 
            className="bg-[#8B0000] text-white px-4 py-2 rounded-md shadow-md hover:bg-red-800"
          >
            Search Players
          </button>
        </form>


        {/* Trending Searches */}
        {/*!hasInitialQuestion && (
          <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
            <span>Trending searches</span>
            {trendingSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => {
                  setInitialMessage(search);
                  handleSendMessage(search);
                }}
                className="px-4 py-1 rounded-full border border-gray-200 hover:border-gray-300"
              >
                {search}
              </button>
            ))}
          </div>
        )*/} 
      </div>

      {/* Results Section */}
      <div className="container mx-auto px-4 py-8">
        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl text-center mb-8">
            {error}
          </div>
        )}

        {/* AI Response */}
        {response && response.type === "text" && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg mb-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {response.player_info?.image_url && (
                <img
                  src={response.player_info.image_url}
                  alt={response.player_info.player?.name || "Player"}
                  className="w-40 h-40 rounded-full border-2 border-gray-300"
                />
              )}
              <div className="flex-1">
                <ReactMarkdown>{response.content || ''}</ReactMarkdown>
              </div>
            </div>

         {/* Tabla de jugadores encontrados */}
         {players.length > 0 && (
          <div className="container mx-auto px-4 py-6">
            <h3 className="text-2xl font-semibold text-center mb-4">Player Results</h3>
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Height</th>
                  <th className="px-4 py-2">Sex</th>
                  <th className="px-4 py-2">Profile</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player: any, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2">{player.name}</td>
                    <td className="px-4 py-2">{player.height || 'N/A'}</td>
                    <td className="px-4 py-2">{player.sex}</td>
                    <td className="px-4 py-2">
                      <a href={player.player_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                        View
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}








        {/* Player Stats */}
        {playerStats && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg mb-8">
            <h3 className="text-xl font-bold mb-4">Player Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Team</div>
                <div className="font-semibold">{playerStats.team}</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Games</div>
                <div className="font-semibold">{playerStats.games_played}</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">PPG</div>
                <div className="font-semibold">{playerStats.points_per_game}</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">RPG</div>
                <div className="font-semibold">{playerStats.rebounds_per_game}</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">APG</div>
                <div className="font-semibold">{playerStats.assists_per_game}</div>
              </div>
            </div>
          </div>
        )}
         {/* Stats & Profile Button */}
         {response.player_info?.player?.name && (
              <div className="mt-6 text-center">
               <button
               onClick={() => navigate(`/player/${response?.player_info?.player?.name}`, { state: { response } })}
                className="px-6 py-3 bg-[#8B0000] text-white font-bold rounded-lg hover:bg-red-900 transition"
                >
                  View Player Profile
                </button>
              </div>
            )}
          </div>
           )}

        {/* Follow-up Question Input */}
        {hasInitialQuestion && (
          <div className="max-w-3xl mx-auto mt-8">
            <div className="relative">
              <input
                type="text"
                value={followUpMessage}
                onChange={(e) => setFollowUpMessage(e.target.value)}
                placeholder="Ask a follow-up question..."
                className="w-full py-4 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:border-transparent pr-12"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(followUpMessage, true)}
              />
              <button
                onClick={() => handleSendMessage(followUpMessage, true)}
                disabled={isLoading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-[#8B0000] text-white rounded-full disabled:bg-gray-400"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </div>
          </div>
        )}

        {/* Categories and Filters */}
        {/*!hasInitialQuestion && (
          <>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-300"
                >
                  <option>Popular</option>
                  <option>Recent</option>
                  <option>Trending</option>
                </select>
                <div className="flex gap-2 overflow-x-auto">
                  {categories.map((category, index) => (
                    <button
                      key={index}
                      className={clsx(
                        'px-4 py-2 rounded-full whitespace-nowrap',
                        index === 0
                          ? 'border-2 border-[#8B0000] text-[#8B0000]'
                          : 'hover:bg-gray-100'
                      )}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300">
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>
          </>
        */}

        {/* Scroll anchor */}
        <div ref={resultsEndRef} />
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/player/:playerName" element={<PlayerProfile />} />
      </Routes>
    </Router>
  );
}

export default App;