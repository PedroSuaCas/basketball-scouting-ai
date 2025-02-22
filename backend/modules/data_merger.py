import logging
from modules.balldontlie_api import get_player_info
from modules.nba_stats_api import get_advanced_stats
from modules.basketball_reference import get_historical_stats
from modules.spotrac_scraper import get_contract_info
from modules.mistral_ai import generate_player_analysis

# Configurar logging
logging.basicConfig(level=logging.INFO)

def merge_player_data(player_name):
    """
    Combina los datos de todas las fuentes para un jugador en una sola estructura JSON.
    """
    logging.info(f"📊 Fusionando datos para: {player_name}")

    # Obtener datos de cada fuente
    player_info = get_player_info(player_name) or {}
    advanced_stats = get_advanced_stats(player_name) or {}
    historical_stats = get_historical_stats(player_name) or []
    contract_info = get_contract_info(player_name) or {}
    ai_analysis = generate_player_analysis(player_name, historical_stats) or {}

    # Estructura de salida
    merged_data = {
        "player": {
            "name": player_info.get("full_name", player_name),
            "team": player_info.get("team", "Desconocido"),
            "position": player_info.get("position", "N/A"),
            "height": player_info.get("height", "N/A"),
            "weight": player_info.get("weight", "N/A"),
            "birthdate": player_info.get("birthdate", "N/A"),
        },
        "stats": {
            "current_season": advanced_stats.get("current_season", {}),
            "historical": historical_stats
        },
        "contract": contract_info.get("contract_details", "No disponible"),
        "agent": contract_info.get("agent", "No disponible"),
        "ai_analysis": ai_analysis.get("summary", "No disponible"),
    }

    logging.info("✅ Datos fusionados correctamente")
    return merged_data
