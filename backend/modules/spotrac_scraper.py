import requests
from bs4 import BeautifulSoup
import logging
from config import Config

# Configurar logging
logging.basicConfig(level=logging.INFO)

def get_contract_info(player_name):
    """
    Obtiene información contractual de un jugador desde Spotrac.
    """
    try:
        # 🔎 1️⃣ Buscar al jugador en Spotrac
        search_url = f"{Config.SPOTRAC_URL}search/{player_name.replace(' ', '-')}/"
        logging.info(f"📑 Buscando en Spotrac: {search_url}")
        
        response = requests.get(search_url)
        soup = BeautifulSoup(response.text, "html.parser")

        # Extraer la URL del perfil del jugador
        player_profile = soup.select_one(".search-result a")
        if not player_profile:
            logging.warning(f"⚠️ No se encontró información de contrato para {player_name}")
            return None
        
        player_url = Config.SPOTRAC_URL + player_profile["href"]
        logging.info(f"🔗 URL del contrato del jugador: {player_url}")

        # 🔎 2️⃣ Extraer información del contrato
        player_response = requests.get(player_url)
        player_soup = BeautifulSoup(player_response.text, "html.parser")

        contract_section = player_soup.find("div", class_="player_contracts")
        if contract_section:
            contract_info = contract_section.text.strip()
            return contract_info
        
        logging.warning(f"⚠️ No se encontró información de contrato para {player_name}")
        return None

    except Exception as e:
        logging.error(f"❌ Error en get_contract_info: {str(e)}")
        return None
