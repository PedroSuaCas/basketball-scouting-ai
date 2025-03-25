import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from scraping.player_scraper import scrape_team_players

# Prueba con un equipo real
url = "https://salarysport.com/football/premier-league/liverpool-f.c./"
scrape_team_players(url)
