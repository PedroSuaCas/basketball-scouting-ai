import requests
from bs4 import BeautifulSoup
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)

BASKETBALL_REFERENCE_URL = "https://www.basketball-reference.com"

def get_historical_stats(player_name):
    """
    Obtiene estadísticas avanzadas de un jugador desde Basketball Reference.
    """
    try:
        # 🔎 1️⃣ Buscar la URL del jugador
        search_url = f"{BASKETBALL_REFERENCE_URL}/search/search.fcgi?search={player_name.replace(' ', '+')}"
        logging.info(f"📊 Buscando en Basketball Reference: {search_url}")
        
        response = requests.get(search_url)
        soup = BeautifulSoup(response.text, "html.parser")

        # Extraer la URL del jugador
        player_link = soup.select_one(".search-item-url")
        if not player_link:
            logging.warning(f"⚠️ No se encontró perfil para {player_name}")
            return None
        
        player_url = BASKETBALL_REFERENCE_URL + player_link.text.strip()
        logging.info(f"🔗 URL del jugador: {player_url}")

        # 🔎 2️⃣ Extraer estadísticas del jugador
        player_response = requests.get(player_url)
        player_soup = BeautifulSoup(player_response.text, "html.parser")

        # Posibles IDs de las tablas
        possible_ids = ["per_game", "per_game_stats", "per_game_stats_post"]

        per_game_table = None
        for table_id in possible_ids:
            per_game_table = player_soup.find("table", {"id": table_id})
            if per_game_table:
                logging.info(f"✅ Tabla encontrada con ID: {table_id}")
                break

        if not per_game_table:
            logging.warning(f"⚠️ No se encontraron estadísticas en la tabla per_game para {player_name}")
            return None

        stats = []
        rows = per_game_table.find("tbody").find_all("tr")

        for row in rows:
            try:
                season = row.find("th").text.strip()
                team = row.find("td", {"data-stat": "team_name_abbr"}).text.strip() if row.find("td", {"data-stat": "team_name_abbr"}) else "N/A"
                points_per_game = row.find("td", {"data-stat": "pts_per_g"}).text.strip() if row.find("td", {"data-stat": "pts_per_g"}) else "0"
                rebounds_per_game = row.find("td", {"data-stat": "trb_per_g"}).text.strip() if row.find("td", {"data-stat": "trb_per_g"}) else "0"
                assists_per_game = row.find("td", {"data-stat": "ast_per_g"}).text.strip() if row.find("td", {"data-stat": "ast_per_g"}) else "0"

                stats.append({
                    "season": season,
                    "team": team,
                    "points_per_game": points_per_game,
                    "rebounds_per_game": rebounds_per_game,
                    "assists_per_game": assists_per_game
                })
            except AttributeError:
                logging.warning(f"⚠️ Se saltó una fila en la tabla debido a datos faltantes.")

        if not stats:
            logging.warning(f"⚠️ No se encontraron estadísticas para {player_name}")
            return None

        return stats

    except Exception as e:
        logging.error(f"❌ Error en get_historical_stats: {str(e)}")
        return None

# 🚀 Prueba con Kevin Durant
if __name__ == "__main__":
    player_stats = get_historical_stats("Kevin Durant")
    print(player_stats)
