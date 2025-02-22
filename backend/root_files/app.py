from flask import Flask, request, jsonify
from modules.data_merger import merge_player_data
from modules.data_processor import clean_player_data
from modules.prediction_model import predict_player_performance
from modules.mistral_ai import generate_analysis

app = Flask(__name__)

@app.route('/api/query', methods=['POST'])
def query_player():
    """
    Endpoint principal para consultar un jugador y obtener todas sus estadísticas.
    """
    data = request.get_json()
    player_name = data.get("player_name")

    if not player_name:
        return jsonify({"error": "Debes proporcionar un nombre de jugador"}), 400

    try:
        # 🔹 Obtener y fusionar todos los datos en un solo JSON estructurado
        merged_data = merge_player_data(player_name)

        # 🔹 Limpiar los datos antes de usarlos en modelos predictivos
        cleaned_data = clean_player_data(merged_data)

        # 🔹 Generar predicciones basadas en `stats_history`
        historical_stats = merged_data.get("stats", {}).get("historical", [])
        if historical_stats:
            performance_predictions = predict_player_performance(historical_stats)
        else:
            performance_predictions = {"predicted_ppg": "No disponible", "predicted_rpg": "No disponible", "predicted_apg": "No disponible"}

        # 🔹 Generar análisis con IA basado en los datos limpios
        ai_analysis = generate_analysis(cleaned_data)

        return jsonify({
            "player": player_name,
            "data": cleaned_data,
            "predictions": performance_predictions,
            "ai_analysis": ai_analysis
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
