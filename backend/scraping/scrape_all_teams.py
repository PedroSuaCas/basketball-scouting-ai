import json
from scraping.player_scraper import scrape_team_players
from scraping.team_scraper import get_team_links

def scrape_all_teams():
    team_urls = get_team_links()
    print(f"🔎 Total de equipos encontrados: {len(team_urls)}")

    for i, url in enumerate(team_urls, 1):
        print(f"\n📦 ({i}/{len(team_urls)}) Procesando: {url}")
        try:
            scrape_team_players(url, re_scrape_if_older_than_days=7) # 7 DIAS DE REFRESCO CACHE
        except Exception as e:
            print(f"💥 Error inesperado en {url}: {e}")

if __name__ == "__main__":
    scrape_all_teams()

