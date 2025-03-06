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
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-4">{playerName}</h2>

      {playerData?.player_info?.image_url && (
        <img
          src={playerData.player_info.image_url}
          alt={playerName}
          className="w-64 h-64 mx-auto rounded-full border-4 border-gray-300 shadow-lg"
        />
      )}

      {/* 📌 Estado de carga */}
      {isLoading && <p className="text-center text-gray-500">Loading statistics...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* 📌 Mostrar estadísticas si están disponibles */}
      {playerStats &&  (
        <div className="mt-6 p-6 bg-gray-100 border rounded-lg shadow-xl">
          <h3 className="text-2xl font-semibold text-center mb-4">📊 Statistics - 2024-2025 Season</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard label="Team" value={playerStats.team} />
            <StatCard label="Position" value={playerStats.position} />
            <StatCard label="Age" value={playerStats.age} />
            <StatCard label="Games Played" value={playerStats.games_played} />
            <StatCard label="Minutes per Game" value={playerStats.minutes_per_game} />
            <StatCard label="Points per Game" value={playerStats.points_per_game} />
            <StatCard label="Rebounds per Game" value={playerStats.total_rebounds_per_game} />
            <StatCard label="Assists per Game" value={playerStats.assists_per_game} />
            <StatCard label="Steals per Game" value={playerStats.steals_per_game} />
            <StatCard label="Blocks per Game" value={playerStats.blocks_per_game} />
            <StatCard label="Turnovers per Game" value={playerStats.turnovers_per_game} />
            <StatCard label="Personal Fouls" value={playerStats.personal_fouls_per_game} />
            <StatCard label="Field Goal %" value={playerStats.field_goal_percentage} />
            <StatCard label="3-Point %" value={playerStats.three_point_percentage} />
            <StatCard label="Free Throw %" value={playerStats.free_throw_percentage} />
            <StatCard label="Effective FG %" value={playerStats.effective_field_goal_percentage} />
          </div>
        </div>
      )}

      {/* 📌 Mostrar Radar Chart si hay estadísticas */}
      {playerStats && <PlayerRadarChart stats={playerStats} />}

      {/* 🔥 Botón para regresar sin perder la búsqueda */}
      <button
        onClick={() => navigate("/", { state: { response: playerData } })}
        className="mt-6 px-6 py-3 bg-gray-700 text-white font-bold rounded-lg shadow-md hover:bg-gray-800"
      >
        Back to Search
      </button>
    </div>
  );
}

function PlayerRadarChart({ stats }: { stats: any }) {
    // 📊 Normalización de datos para que estén en una escala común
    const normalizedStats = [
      { stat: "PPG", value: parseFloat(stats.points_per_game) || 0 },
      { stat: "RPG", value: parseFloat(stats.total_rebounds_per_game) || 0 },
      { stat: "APG", value: parseFloat(stats.assists_per_game) || 0 },
      { stat: "SPG", value: parseFloat(stats.steals_per_game) || 0 },
      { stat: "BPG", value: parseFloat(stats.blocks_per_game) || 0 },
      { stat: "TOV", value: 10 - parseFloat(stats.turnovers_per_game) || 0 }, // Invertimos escala
      { stat: "FG%", value: parseFloat(stats.field_goal_percentage) * 100 || 0 },
      { stat: "3P%", value: parseFloat(stats.three_point_percentage) * 100 || 0 },
      { stat: "FT%", value: parseFloat(stats.free_throw_percentage) * 100 || 0 },
    ];
  
    return (
      <div className="mt-6 p-6 bg-white border rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-center mb-4">🎯 Performance Radar - 2024-2025</h3>
        <ResponsiveContainer width="100%" height={350}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={normalizedStats}>
            <PolarGrid />
            <PolarAngleAxis dataKey="stat" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Radar name="Player Stats" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    );
  }

// 📌 Componente reutilizable para cada estadística
function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-center">
      <div className="text-sm text-gray-500 font-semibold">{label}</div>
      <div className="text-lg font-bold">{value || "N/A"}</div>
    </div>
  );
}

export default PlayerProfile;
