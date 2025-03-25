import requests
from bs4 import BeautifulSoup

BASE_URL = "https://salarysport.com"
START_URL = "https://salarysport.com/es/football/"
HEADERS = {"User-Agent": "Mozilla/5.0"}

def get_team_links():
    response = requests.get(START_URL, headers=HEADERS)
    soup = BeautifulSoup(response.content, "html.parser")

    links = soup.select("a[href^='/es/football/']")

    team_links = []
    for link in links:
        href = link.get("href")
        if "highest-paid" not in href and href.count("/") >= 4:
            full_link = BASE_URL + href
            team_links.append(full_link)

    return list(set(team_links))  # sin duplicados
