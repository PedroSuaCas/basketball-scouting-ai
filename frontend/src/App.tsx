import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation} from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Search, ChevronDown, Filter, ShoppingBasket as Basketball, Loader2, Send } from 'lucide-react';
//import { clsx } from 'clsx';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import PlayerProfile from './components/features/player/PlayerProfile.tsx';
import {Player} from './types/index.ts'
import ErrorModal from './components/errors/ErrorModal.tsx'; // Importamos el modal



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
  const [message, setMessage] = useState("");
  const [hasInitialQuestion, setHasInitialQuestion] = useState(false);
  //const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resultsEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);

  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [isLoadingProballers, setIsLoadingProballers] = useState(false);


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

  /*const [playerStats, setPlayerStats] = useState<{
    team: string;
    games_played: string;
    points_per_game: string;
    rebounds_per_game: string;
    assists_per_game: string;
  } | null>(null);*/


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

  const [messages, setMessages] = useState<{ id: number; question: string; response?: string; isDisabled: boolean }[]>([]);
  const [searchHistory, setSearchHistory] = useState<{ query: string; response: any }[]>([]);



  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };


  // **1. Search with lens to call Mistral ai
  const handleSendMessage = async (message: string, isFollowUp: boolean = false) => {
    if (!message.trim()) return;

    setIsLoadingAI(true);
    setError(null);
    //setPlayerStats(null);
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
        setSearchHistory((prevHistory) => [...prevHistory, { query: message, response: data.response }]);
        //setFollowUpMessage(""); // Limpiar caja de seguimiento
  
        if (!isFollowUp) {
          setHasInitialQuestion(true);
        }
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

    setIsLoadingAI(false);
  };
// fin mistral ai

// **2. search with form to query Proballers api )**
  const handleSearchProballers = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!filters.name.trim()) {
      //alert("Please enter a player's name."); // in the future modify to show popup
      setShowErrorModal(true);
      return;
    }

    setIsLoadingProballers(true);
    setError(null);
   //setPlayerStats(null);
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
      console.info("Data received:", data);
      console.info("Players received:", data.players);
      console.info("Type of players:", typeof data.players);
      console.info("Is players an array?", Array.isArray(data.players));

      if (!data.players || data.players.length === 0) {
        setError("No players found.");
        setShowErrorModal(true);
      }

      setPlayers(data.players || []);
      
    } catch (error) {
      console.error("Error fetching players:", error);
      setError("Error fetching player data.");
    } finally {
      setIsLoadingProballers(false);
    }
  };  


  // Call to /api/stats basketball reference
  /*const fetchPlayerStats = async () => {
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
      console.error("Error in api stats", error)
    }

    setIsLoading(false);
  };*/

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
          <div className="max-w-3xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What player or metric are you looking for?"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(message)}
                className="w-full py-4 pl-12 pr-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:border-transparent"
              />

              <button
                onClick={() => handleSendMessage(message)}
                disabled={isLoadingAI}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-[#8B0000] text-white rounded-full disabled:bg-gray-400"
              >
                {isLoadingAI ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
              </button>
            </div>
          </div>


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
                  //setInitialMessage(search);
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
        {isLoadingAI && (
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
        {/* AI Response - Historial de Búsqueda */}
          <div className="flex flex-col space-y-6">
            {searchHistory.map((search, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  {search.response.player_info?.image_url && (
                    <img
                      src={search.response.player_info.image_url}
                      alt={search.response.player_info.player?.name || "Player"}
                      className="w-40 h-40 rounded-full border-2 border-gray-300"
                    />
                  )}
                  <div className="flex-1">
                    <ReactMarkdown>{search.response.content || ''}</ReactMarkdown>
                  </div>
                </div>

                {/* Stats & Profile Button */}
                {search.response.player_info?.player?.name && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={() => navigate(`/player/${search.response.player_info.player.name}`, { state: { response: search.response } })}
                      className="px-6 py-3 bg-[#8B0000] text-white font-bold rounded-lg hover:bg-red-900 transition"
                    >
                      View Player Profile
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Tabla de jugadores encontrados */}
          {isLoadingProballers ? (
            <div className="flex justify-center py-6">
              <Loader2 className="w-8 h-8 text-gray-600 animate-spin" />
            </div>
          ) : players.length > 0 && (
            <div className="container mx-auto px-4 py-6">
              <h3 className="text-2xl font-semibold text-center mb-4">Player Results</h3>
              <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-center">Name</th>
                    <th className="px-4 py-2 text-center">Age</th>
                    <th className="px-4 py-2 text-center">Height</th>
                    <th className="px-4 py-2 text-center">Sex</th>
                    <th className="px-4 py-2 text-center">Profile</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player: Player, index: number) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2 text-center">{player.name}</td>
                      <td className="px-4 py-2 text-center">{player.age}</td>
                      <td className="px-4 py-2 text-center">{player.height || 'N/A'}</td>
                      <td className="px-4 py-2 text-center">{player.sex}</td>
                      <td className="px-4 py-2 text-center">
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
          {/*fin Tabla de jugadores Encontrados*/} 

        {/* Error Modal - Debe ir aquí, antes de cerrar el div */}
        {showErrorModal && error && (
        <ErrorModal message={error} onClose={() => setShowErrorModal(false)} />
        )}


        {/* Scroll anchor */}
        <div ref={resultsEndRef} />
      </div>
    </div>

  );
}// end Homepage

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