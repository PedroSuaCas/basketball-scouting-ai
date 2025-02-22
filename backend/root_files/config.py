import os
from dotenv import load_dotenv

# 🔄 Cargar variables desde el archivo .env
load_dotenv()

class Config:
    """
    Configuración centralizada de URLs y API Keys usando .env
    """

    # 📡 API de balldontlie.io (Datos Básicos)
    BALLDONTLIE_API_URL = os.getenv("BALLDONTLIE_API_URL")
    BALLDONTLIE_API_KEY = os.getenv("BALLDONTLIE_API_KEY")

    # 📊 API de NBA Stats (Datos Avanzados)
    NBA_STATS_API_URL = os.getenv("NBA_STATS_API_URL")
    NBA_STATS_API_KEY = os.getenv("NBA_STATS_API_KEY")

    # 🏀 Scraping de Basketball Reference (Estadísticas Históricas)
    BASKETBALL_REFERENCE_URL = os.getenv("BASKETBALL_REFERENCE_URL")

    # 💰 Scraping de Spotrac (Contratos y Agentes)
    SPOTRAC_URL = os.getenv("SPOTRAC_URL")

    # 🧠 Mistral AI (Análisis de Texto)
    MISTRAL_API_URL = os.getenv("MISTRAL_API_URL")
    MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")

    # ⏳ Configuración General
    REQUEST_TIMEOUT = int(os.getenv("REQUEST_TIMEOUT", 10))  # Por defecto, 10 segundos
