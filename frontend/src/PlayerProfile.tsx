import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000";

function PlayerProfile() {
  const { playerName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const playerData = location.state?.response || null;

  const [playerStats, setPlayerStats] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        if (data.per_game_stats) {
          setPlayerStats(data.per_game_stats);
        } else {
          setError("No statistics found.");
        }
      } catch (error) {
        setError("Error fetching statistics.");
      }

      setIsLoading(false);
    };

    fetchPlayerStats();
  }, [playerName]);

  return (
    <div className="container mx-auto px-8 py-12 flex flex-col md:flex-row items-center md:items-start gap-10">
      {/* Imagen del jugador */}
      {playerData?.player_info?.image_url && (
        <img
          src={playerData.player_info.image_url}
          alt={playerName}
          className="w-96 h-auto rounded-lg shadow-lg border-4 border-gray-300"
        />
      )}

      {/* Datos del jugador */}
      <div className="flex-1">
        <h2 className="text-4xl font-bold mb-4">{playerName}</h2>

        {/* 📌 Estado de carga o error */}
        {isLoading && <p className="text-gray-500">Loading statistics...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* 📌 Estadísticas */}
        {playerStats && (
          <div className="space-y-4 bg-gray-100 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">📊 2024-2025 Season Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <StatCard label="Team" value={playerStats.team} />
              <StatCard label="Games Played" value={playerStats.games_played} />
              <StatCard label="PPG" value={playerStats.points_per_game} />
              <StatCard label="RPG" value={playerStats.total_rebounds_per_game} />
              <StatCard label="APG" value={playerStats.assists_per_game} />
              <StatCard label="FG%" value={playerStats.field_goal_percentage} />
              <StatCard label="3P%" value={playerStats.three_point_percentage} />
              <StatCard label="FT%" value={playerStats.free_throw_percentage} />
            </div>
          </div>
        )}
      </div>

      {/* Radar Chart */}
      {playerStats && <PlayerRadarChart stats={playerStats} />}
    </div>
  );
}

function PlayerRadarChart({ stats }: { stats: any }) {
  const normalizedStats = [
    { stat: "PPG", value: parseFloat(stats.points_per_game) || 0 },
    { stat: "RPG", value: parseFloat(stats.total_rebounds_per_game) || 0 },
    { stat: "APG", value: parseFloat(stats.assists_per_game) || 0 },
    { stat: "SPG", value: parseFloat(stats.steals_per_game) || 0 },
    { stat: "BPG", value: parseFloat(stats.blocks_per_game) || 0 },
    { stat: "FG%", value: parseFloat(stats.field_goal_percentage) * 100 || 0 },
    { stat: "3P%", value: parseFloat(stats.three_point_percentage) * 100 || 0 },
    { stat: "FT%", value: parseFloat(stats.free_throw_percentage) * 100 || 0 },
  ];

  return (
    <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-center mb-4">🎯 Player Performance</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={normalizedStats}>
          <PolarGrid />
          <PolarAngleAxis dataKey="stat" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Radar name="Stats" dataKey="value" stroke="#d32f2f" fill="#d32f2f" fillOpacity={0.6} />
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
