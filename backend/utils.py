from datetime import datetime
import logging

def calculate_age(birthday):
    """
    🔹 Calcula la edad a partir de la fecha de nacimiento en formato 'YYYY-MM-DD'.
    """
    if not birthday:
        return "N/A"

    try:
        birth_date = datetime.strptime(birthday, "%Y-%m-%d")
        today = datetime.today()
        age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
        return age
    except ValueError:
        logging.error(f"❌ Error al calcular la edad con fecha: {birthday}")
        return "N/A"
