from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import requests
from bs4 import BeautifulSoup
from modules.mistral_ai import generate_response

app = Flask(__name__)
logging.basicConfig(level=logging.INFO)

# ✅ Configurar CORS correctamente
CORS(app, resources={r"/api/*": {"origins": "http://127.0.0.1:5173"}}, supports_credentials=True)

@app.after_request
def add_cors_headers(response):
    """
    🔹 Agrega manualmente las cabeceras CORS a todas las respuestas.
    """
    response.headers["Access-Control-Allow-Origin"] = "http://127.0.0.1:5173"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return response

@app.route('/api/chat', methods=['POST'])
def chat():
    """
    🔹 Maneja la interacción con Mistral AI.
    """
    try:
        data = request.get_json()
        user_message = data.get("message")

        if not user_message:
            return jsonify({"error": "Debes proporcionar un mensaje"}), 400

        response = generate_response(user_message)
        return jsonify({"response": response})

    except Exception as e:
        logging.error(f"❌ Error en el chat: {e}")
        return jsonify({"error": "Error interno del servidor"}), 500

def get_basketball_reference_stats(player_name):
    """
    🔹 Realiza web scraping en Basketball Reference para obtener estadísticas de un jugador.
    """

    # 🔹 Headers para evitar bloqueos
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
    }

    try:
        # 🔎 Buscar al jugador en Basketball Reference
        search_url = f"https://www.basketball-reference.com/search/search.fcgi?search={player_name.replace(' ', '+')}"
        logging.info(f"📊 Buscando en Basketball Reference: {search_url}")

        response = requests.get(search_url, headers=headers)
        soup = BeautifulSoup(response.text, "html.parser")

        # 📌 Obtener la URL real del perfil del jugador
        player_link_tag = soup.find("div", class_="search-item-name")
        if not player_link_tag or not player_link_tag.a:
            return {"error": "Jugador no encontrado en Basketball Reference"}

        player_url = "https://www.basketball-reference.com" + player_link_tag.a["href"]
        logging.info(f"🔗 URL del jugador: {player_url}")

        # 📌 Extraer estadísticas desde la página del jugador
        response = requests.get(player_url, headers=headers)
        soup = BeautifulSoup(response.text, "html.parser")

        # 🔹 Obtener estadísticas del bloque "stats_pullout" (resumen temporada y carrera)
        summary_stats = {}
        stats_pullout = soup.find("div", class_="stats_pullout")
        if stats_pullout:
            stat_blocks = stats_pullout.find_all("div", class_=["p1", "p2", "p3"])
            for block in stat_blocks:
                for stat in block.find_all("div"):
                    label = stat.find("strong").text.strip()
                    values = [p.text for p in stat.find_all("p")]
                    if len(values) == 2:
                        summary_stats[label] = {"2024-25": values[0], "Career": values[1]}

        # 🔹 Extraer estadísticas "Per Game" desde la tabla
        stats_table = soup.find("table", id="per_game_stats")
        if not stats_table:
            logging.error("❌ No se encontró la tabla de estadísticas.")
            return {"error": "No se encontraron estadísticas"}

        rows = stats_table.find("tbody").find_all("tr")
        if not rows:
            return {"error": "No hay temporadas disponibles"}

        logging.info(f"Tablas:  {rows}")
        latest_season = rows[-1].find_all("td")
        logging.info(f"latest_season: {latest_season}")

        # 📊 Extraer estadísticas clave
     
        # 📊 Extraer estadísticas clave
        per_game_stats = {
            "age": latest_season[0].text if len(latest_season) > 0 else "N/A",
            "team": latest_season[1].text if len(latest_season) > 1 else "N/A",
            "competition": latest_season[2].text if len(latest_season) > 2 else "N/A",
            "position": latest_season[3].text if len(latest_season) > 3 else "N/A",
            "games_played": latest_season[4].text if len(latest_season) > 4 else "N/A",
            "games_started": latest_season[5].text if len(latest_season) > 5 else "N/A",
            "minutes_per_game": latest_season[6].text if len(latest_season) > 6 else "N/A",
            "field_goals_per_game": latest_season[7].text if len(latest_season) > 7 else "N/A",
            "field_goal_attempts_per_game": latest_season[8].text if len(latest_season) > 8 else "N/A",
            "field_goal_percentage": latest_season[9].text if len(latest_season) > 9 else "N/A",
            "three_point_per_game": latest_season[10].text if len(latest_season) > 10 else "N/A",
            "three_point_attempts_per_game": latest_season[11].text if len(latest_season) > 11 else "N/A",
            "three_point_percentage": latest_season[12].text if len(latest_season) > 12 else "N/A",
            "two_point_per_game": latest_season[13].text if len(latest_season) > 13 else "N/A",
            "two_point_attempts_per_game": latest_season[14].text if len(latest_season) > 14 else "N/A",
            "two_point_percentage": latest_season[15].text if len(latest_season) > 15 else "N/A",
            "effective_field_goal_percentage": latest_season[16].text if len(latest_season) > 16 else "N/A",
            "free_throws_per_game": latest_season[17].text if len(latest_season) > 17 else "N/A",
            "free_throw_attempts_per_game": latest_season[18].text if len(latest_season) > 18 else "N/A",
            "free_throw_percentage": latest_season[19].text if len(latest_season) > 19 else "N/A",
            "offensive_rebounds_per_game": latest_season[20].text if len(latest_season) > 20 else "N/A",
            "defensive_rebounds_per_game": latest_season[21].text if len(latest_season) > 21 else "N/A",
            "total_rebounds_per_game": latest_season[22].text if len(latest_season) > 22 else "N/A",
            "assists_per_game": latest_season[23].text if len(latest_season) > 23 else "N/A",
            "steals_per_game": latest_season[24].text if len(latest_season) > 24 else "N/A",
            "blocks_per_game": latest_season[25].text if len(latest_season) > 25 else "N/A",
            "turnovers_per_game": latest_season[26].text if len(latest_season) > 26 else "N/A",
            "personal_fouls_per_game": latest_season[27].text if len(latest_season) > 27 else "N/A",
            "points_per_game": latest_season[28].text if len(latest_season) > 28 else "N/A",
        }


        logging.info(f"📊 Estadísticas extraídas para {player_name}: {per_game_stats}")

        return {
            "player": player_name,
            "summary_stats": summary_stats,
            "per_game_stats": per_game_stats,
        }

    except Exception as e:
        logging.error(f"❌ Error en get_basketball_reference_stats: {e}")
        return {"error": "Error interno al obtener estadísticas"}

@app.route('/api/stats', methods=['POST'])
def get_player_stats():
    """
    🔹 Endpoint para obtener estadísticas de un jugador desde Basketball Reference.
    """
    try:
        data = request.get_json()
        logging.info(f" api/stats - Data response: {data} ")
        player_name = data.get("player_name")
        logging.info(f" api/stats - player name response: {player_name} ")
        if not player_name:
            return jsonify({"error": "Debes proporcionar un nombre de jugador"}), 400

        stats = get_basketball_reference_stats(player_name)
        logging.info(f" api/stats - player name response: {stats} ")
        return jsonify(stats)

    except Exception as e:
        logging.error(f"❌ Error en get_player_stats: {e}")
        return jsonify({"error": "Error interno del servidor"}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)
