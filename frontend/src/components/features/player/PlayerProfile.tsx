import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from 'recharts';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000";

function PlayerProfile() {
  const { playerName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const playerData = location.state?.response || null;
  const [playerStats, setPlayerStats] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allSeasons, setAllSeasons] = useState<any[]>([]);

  useEffect(() => {
    const fetchPlayerStats = async () => {
      if (!playerName) return;
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(`${BACKEND_URL}/api/stats`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ player_name: playerName }),
        });

        const data = await res.json();
        if (data.all_seasons_stats) {
          setAllSeasons(data.all_seasons_stats);
        }
        if (data.per_game_stats) {
          setPlayerStats(data.per_game_stats);
        } else {
          setError("No statistics found.");
        }
      } catch (error) {
        setError("Error fetching statistics.");
        console.log("Error:", error);
      }

      setIsLoading(false);
    };

    fetchPlayerStats();
  }, [playerName]);

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 bg-[#8B0000] text-white px-4 py-2 rounded hover:bg-red-900"
      >
        ⬅ Back to Search
      </button>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Imagen */}
        {playerData?.player_info?.image_url && (
          <img
            src={playerData.player_info.image_url}
            alt={playerName}
            className="w-32 h-32 rounded-full border-4 border-gray-300 shadow-md"
          />
        )}

        {/* Última temporada + radar */}
        <div className="flex-1 space-y-6">
          <h2 className="text-3xl font-bold">{playerName}</h2>

          {isLoading && <p className="text-gray-500">Loading statistics...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {playerStats && (
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">📊 Last Season Stats</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <StatCard label="Team" value={playerStats.team} />
                <StatCard label="Games Played" value={playerStats.games_played} />
                <StatCard label="PPG" value={playerStats.points_per_game} />
                <StatCard label="RPG" value={playerStats.total_rebounds_per_game} />
                <StatCard label="APG" value={playerStats.assists_per_game} />
                <StatCard label="FG%" value={playerStats.field_goal_percentage} />
              </div>
            </div>
          )}

          {playerStats && <PlayerRadarChart stats={playerStats} />}
        </div>
      </div>

      {/* Tabla de estadísticas por temporada */}
      {allSeasons.length > 0 && (
        <div className="mt-10 w-full overflow-x-auto">
          <h3 className="text-xl font-semibold mb-4">📆 Stats by Season</h3>
          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                {Object.keys(allSeasons[0]).map((key) => (
                  <th key={key} className="px-3 py-2 border border-gray-200 text-left">{key.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allSeasons.map((season, index) => (
                <tr key={index} className="even:bg-gray-50 hover:bg-gray-100">
                  {Object.values(season).map((value, idx) => (
                    <td key={idx} className="px-3 py-1 border border-gray-100 text-center">{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function PlayerRadarChart({ stats }: { stats: any }) {
  const radarData = [
    { stat: "PPG", value: parseFloat(stats.points_per_game) || 0 },
    { stat: "RPG", value: parseFloat(stats.total_rebounds_per_game) || 0 },
    { stat: "APG", value: parseFloat(stats.assists_per_game) || 0 },
    { stat: "SPG", value: parseFloat(stats.steals_per_game) || 0 },
    { stat: "BPG", value: parseFloat(stats.blocks_per_game) || 0 },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-md font-semibold text-center mb-2">🎯 Core Performance Metrics</h3>
      <ResponsiveContainer width="100%" height={250}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="stat" />
          <PolarRadiusAxis angle={30} domain={[0, 30]} />
          <Radar name="Stats" dataKey="value" stroke="#8B0000" fill="#8B0000" fillOpacity={0.6} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-center">
      <div className="text-sm text-gray-500 font-semibold">{label}</div>
      <div className="text-lg font-bold">{value || "N/A"}</div>
    </div>
  );
}

export default PlayerProfile;
