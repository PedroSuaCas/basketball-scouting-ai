import requests
import logging
from config import Config

# Configurar logging
logging.basicConfig(level=logging.INFO)

def get_advanced_stats(player_name):
    """
    Obtiene estadísticas avanzadas de un jugador desde la API de NBA Stats.
    """
    try:
        # URL de consulta
        url = f"{Config.NBA_STATS_API_URL}players?search={player_name.replace(' ', '+')}"
        headers = {"Authorization": f"Bearer {Config.NBA_STATS_API_KEY}"}

        logging.info(f"📊 Consultando NBA Stats API: {url}")
        response = requests.get(url, headers=headers, timeout=Config.REQUEST_TIMEOUT)
        
        if response.status_code != 200:
            logging.warning(f"⚠️ Error en la API de NBA Stats: {response.status_code}")
            return None
        
        data = response.json()
        
        if 'data' in data and len(data['data']) > 0:
            player = data['data'][0]
            return {
                "player_id": player.get("id"),
                "name": f"{player.get('first_name', '')} {player.get('last_name', '')}",
                "team": player.get("team", {}).get("full_name", "Sin equipo"),
                "position": player.get("position", "Desconocida"),
                "ppg": player.get("points_per_game", "N/A"),
                "rpg": player.get("rebounds_per_game", "N/A"),
                "apg": player.get("assists_per_game", "N/A"),
                "per": player.get("player_efficiency_rating", "N/A")
            }

        logging.warning(f"⚠️ No se encontraron estadísticas avanzadas para {player_name}")
        return None

    except Exception as e:
        logging.error(f"❌ Error en get_advanced_stats: {str(e)}")
        return None
