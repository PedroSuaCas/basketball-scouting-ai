import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)

#Objetivo: Limpiar y estructurar los datos antes de combinarlos.

def clean_player_data(player_data):
    """
    Limpia y formatea los datos de los jugadores antes de su procesamiento.
    """
    try:
        # Validar si hay datos disponibles
        if not player_data:
            logging.warning("⚠️ No hay datos para limpiar.")
            return {}

        cleaned_data = {
            "name": player_data.get("name", "Desconocido").title(),
            "team": player_data.get("team", "Sin equipo").title(),
            "position": player_data.get("position", "Desconocida"),
            "height": player_data.get("height", "N/A"),
            "weight": player_data.get("weight", "N/A"),
            "stats": {
                "ppg": player_data.get("stats", {}).get("basic", {}).get("ppg", "N/A"),
                "rpg": player_data.get("stats", {}).get("basic", {}).get("rpg", "N/A"),
                "apg": player_data.get("stats", {}).get("basic", {}).get("apg", "N/A"),
                "per": player_data.get("stats", {}).get("advanced", {}).get("per", "N/A"),
            },
            "contract": player_data.get("contract", "No disponible")
        }

        logging.info("✅ Datos limpios y estructurados.")
        return cleaned_data

    except Exception as e:
        logging.error(f"❌ Error en clean_player_data: {str(e)}")
        return {}
