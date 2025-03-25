from scraping.team_scraper import get_team_links
from scraping.player_scraper import scrape_team_players

def test_subset_scrape(limit=10):
    urls = get_team_links()[:limit]
    for url in urls:
        print(f"🔎 Scrapeando: {url}")
        scrape_team_players(url, re_scrape_if_older_than_days=0)

if __name__ == "__main__":
    test_subset_scrape()
