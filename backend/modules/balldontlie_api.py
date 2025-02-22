import requests
import logging
from config import Config

# Configurar logging
logging.basicConfig(level=logging.INFO)

def get_nba_player_data(player_name):
    """
    Obtiene información de un jugador desde la API de balldontlie.io.
    """
    try:
        headers = {"Authorization": f"Bearer {Config.BALLDONTLIE_API_KEY}"}
        url = f"{Config.BALLDONTLIE_API_URL}players?search={player_name.replace(' ', '%20')}"
        
        logging.info(f"🔎 Llamando a balldontlie.io: {url}")
        
        response = requests.get(url, headers=headers, timeout=Config.REQUEST_TIMEOUT)
        
        if response.status_code != 200:
            logging.warning(f"⚠️ Error en la API de balldontlie.io: {response.status_code}")
            return None
        
        data = response.json()
        
        if 'data' in data and len(data['data']) > 0:
            player = data['data'][0]
            return {
                "id": player.get("id"),
                "name": f"{player.get('first_name', '')} {player.get('last_name', '')}",
                "position": player.get("position", "Desconocida"),
                "height": f"{player.get('height_feet', 'N/A')} ft {player.get('height_inches', 'N/A')} in",
                "weight": f"{player.get('weight_pounds', 'N/A')} lbs",
                "team": {
                    "name": player["team"]["full_name"],
                    "abbreviation": player["team"]["abbreviation"],
                    "conference": player["team"]["conference"],
                    "division": player["team"]["division"]
                }
            }

        logging.warning(f"⚠️ No se encontró información para {player_name}")
        return None

    except Exception as e:
        logging.error(f"❌ Error en get_nba_player_data: {str(e)}")
        return None
