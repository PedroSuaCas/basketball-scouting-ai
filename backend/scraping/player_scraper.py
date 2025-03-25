import requests
from bs4 import BeautifulSoup
from datetime import datetime, timedelta
import time
from db.mongo import get_db
from urllib.parse import unquote

# Conectar a la base de datos
db = get_db()
players = db["players"]
teams = db["teams"]  # colección para cachear equipos ya scrapeados


#def already_scraped(team_url: str) -> bool:
#   return teams.find_one({"url": team_url}) is not None

def already_scraped_recently(team_url: str, max_days_old = 7) -> bool:
    team = teams.find_one({"url": team_url})
    if not team:
        return False
    scraped_at = team.get("scraped_at")
    if not scraped_at:
        return False

    # Comparar con la fecha actual
    return datetime.utcnow() - scraped_at < timedelta(days=max_days_old)


def save_team_scraped(team_url: str):
    teams.update_one(
    {"url": team_url},
    {"$set": {"scraped_at": datetime.utcnow()}},
    upsert=True
    )   


def parse_salary(salary_str: str) -> int:
    salary_str = salary_str.replace("€", "").replace(",", "").strip()
    try:
        return int(salary_str)
    except:
        return 0

def scrape_team_players(team_url: str, re_scrape_if_older_than_days = 7):
    if already_scraped_recently(team_url, max_days_old = re_scrape_if_older_than_days):
        print(f"✅ Ya scrapeado recientemente: {team_url}")
        return
    team_name = team_url.split("/")[-2].replace("-", " ").title()
    team_name = unquote(team_name)  # para nombres con tildes o caracteres especiales

    print(f"🔍 Scrapeando: {team_url}")

    try:
        response = requests.get(
            team_url,
            headers={"User-Agent": "Mozilla/5.0"},
            timeout=10,
            allow_redirects=False
        )
        if response.status_code in [301, 302]:
            print(f"🚫 Redirección detectada: {team_url}")
            save_team_scraped(team_url)
            return
        response.raise_for_status()

        soup = BeautifulSoup(response.content, 'html.parser')
        table = soup.find('table')

        if not table:
            print(f"⚠️ No se encontró tabla de jugadores en: {team_url}")
            save_team_scraped(team_url)
            return

        rows = table.find_all('tr')[1:]
        for row in rows:
            cols = row.find_all('td')
            if len(cols) < 6:
                continue

            player_data = {
                "nombre": cols[0].text.strip(),
                "salario_semanal": parse_salary(cols[1].text),
                "salario_anual": parse_salary(cols[2].text),
                "edad": int(cols[3].text.strip()),
                "posicion": cols[4].text.strip(),
                "nacionalidad": cols[5].text.strip(),
                "equipo_url": team_url,
                "equipo": team_name,
            }

            players.update_one(
                {"nombre": player_data["nombre"], "equipo_url": team_url},
                {"$set": player_data},
                upsert=True
            )

        # Solo se llega aquí si hubo tabla válida
        print(f" Scraping finalizado: {team_url}")
        save_team_scraped(team_url)

    except Exception as e:
        print(f" Error inesperado en {team_url}: {e}")
    finally:
        time.sleep(0.1)
