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
    try:
        search_url = f"https://www.basketball-reference.com/search/search.fcgi?search={player_name.replace(' ', '+')}"
        logging.info(f"📊 Buscando en Basketball Reference: {search_url}")

        response = requests.get(search_url)
        soup = BeautifulSoup(response.text, "html.parser")

        # 📌 Obtener la URL real del perfil del jugador
        player_link_tag = soup.find("div", class_="search-item-name")
        if not player_link_tag or not player_link_tag.a:
            return {"error": "Jugador no encontrado en Basketball Reference"}

        player_url = "https://www.basketball-reference.com" + player_link_tag.a["href"]
        logging.info(f"🔗 URL del jugador: {player_url}")

        # 📌 Extraer estadísticas desde la página del jugador
        response = requests.get(player_url)
        soup = BeautifulSoup(response.text, "html.parser")

        # 📊 Obtener estadísticas de la tabla "per_game"
        stats_table = soup.find("table", {"id": "per_game"})
        if not stats_table:
            return {"error": "No se encontraron estadísticas"}

        rows = stats_table.find("tbody").find_all("tr")
        latest_season = rows[-1].find_all("td") if rows else []

        # Manejo de errores en la extracción de datos
        try:
            stats = {
                "team": latest_season[1].text if len(latest_season) > 1 else "N/A",
                "games_played": latest_season[2].text if len(latest_season) > 2 else "N/A",
                "points_per_game": latest_season[26].text if len(latest_season) > 26 else "N/A",
                "rebounds_per_game": latest_season[20].text if len(latest_season) > 20 else "N/A",
                "assists_per_game": latest_season[21].text if len(latest_season) > 21 else "N/A"
            }
        except Exception as e:
            logging.error(f"❌ Error al extraer estadísticas: {e}")
            return {"error": "Error al procesar estadísticas"}

        return {"player": player_name, "stats": stats}

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
        logging.info(f"data response: {data} ")
        player_name = data.get("player_name")

        if not player_name:
            return jsonify({"error": "Debes proporcionar un nombre de jugador"}), 400

        stats = get_basketball_reference_stats(player_name)
        return jsonify(stats)

    except Exception as e:
        logging.error(f"❌ Error en get_player_stats: {e}")
        return jsonify({"error": "Error interno del servidor"}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)
