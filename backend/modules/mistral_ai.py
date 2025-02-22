from mistralai.models.chat_completion import ChatMessage
from mistralai.client import MistralClient
from config import Config

# Inicializar cliente de Mistral AI
client = MistralClient(api_key=Config.MISTRAL_API_KEY)

def generate_analysis(player_data):
    """
    Genera un análisis en lenguaje natural basado en los datos del jugador.
    """
    player_name = player_data.get("name", "Jugador Desconocido")

    # Crear mensaje con la información estructurada
    messages = [ChatMessage(
        role="user",
        content=f"""Genera un análisis detallado de {player_name} basándote en estos datos:

🏀 **Información Básica**
- Equipo: {player_data.get('team', 'No disponible')}
- Posición: {player_data.get('position', 'No disponible')}
- Altura: {player_data.get('height', 'No disponible')}
- Peso: {player_data.get('weight', 'No disponible')}

📊 **Estadísticas Avanzadas**
- Puntos por partido: {player_data.get('advanced_stats', {}).get('points_per_game', 'No disponible')}
- Rebotes por partido: {player_data.get('advanced_stats', {}).get('rebounds_per_game', 'No disponible')}
- Asistencias por partido: {player_data.get('advanced_stats', {}).get('assists_per_game', 'No disponible')}

💰 **Contrato**
- {player_data.get('contract', 'No disponible')}

🔎 **Analiza la evolución del jugador y su impacto en el equipo.""" 
    )]

    # Enviar consulta a Mistral AI
    response = client.chat(model="mistral-medium", messages=messages)

    return response.choices[0].message.content if response.choices else "No se pudo generar análisis."
