import json
from modules.mistral_ai import generate_analysis

# Datos de prueba simulados
fake_player_data = {
    "name": "Kevin Durant",
    "team": "Phoenix Suns",
    "points_per_game": 27.1,
    "rebounds_per_game": 6.6,
    "assists_per_game": 5.0,
    "position": "PF",
    "contract": {"team": "PHO", "salary": "46M", "years_left": 2},
    "stats_history": [{"season": "2022-23", "team": "PHO", "ppg": 29.1, "rpg": 6.7, "apg": 5.0}]
}

print("🔍 Probando análisis con Mistral AI...\n")
response = generate_analysis(json.dumps(fake_player_data, indent=2))
print(response)
