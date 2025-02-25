from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
from modules.mistral_ai import generate_response

app = Flask(__name__)

# ✅ Configurar CORS de manera explícita
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

@app.after_request
def add_cors_headers(response):
    """
    🔹 Agrega manualmente las cabeceras CORS a todas las respuestas.
    """
    response.headers["Access-Control-Allow-Origin"] = "http://localhost:5173"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return response

@app.route('/api/chat', methods=['POST', 'OPTIONS'])
def chat():
    """
    🔹 Maneja la interacción con Mistral AI y responde correctamente a preflight requests.
    """
    if request.method == "OPTIONS":
        return jsonify({"message": "OK"}), 200  # ✅ Responde a preflight con éxito

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

if __name__ == '__main__':
    app.run(debug=True, port=5000)
