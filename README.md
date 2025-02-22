# Basketball Scouting AI

## 📌 Project Overview
Basketball Scouting AI is an application designed to retrieve and analyze basketball player data from various sources, including APIs and web scraping. It provides statistics, contract details, and AI-powered performance predictions.

## 🏗️ Project Structure

```
backend/
│   ├── modules/
│   │   ├── balldontlie_api.py
│   │   ├── nba_stats_api.py
│   │   ├── basketball_reference.py
│   │   ├── spotrac_scraper.py
│   │   ├── data_processor.py
│   │   ├── data_merger.py
│   │   ├── mistral_ai.py
│   │   ├── prediction_model.py
│   ├── tests/
│   │   ├── test_api.py
│   │   ├── test_scrapers.py
│   ├── app.py
│   ├── config.py
│   ├── requirements.txt
│
frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── LoadingSpinner.tsx
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── Table.tsx
│   │   ├── features/
│   │   │   ├── player/
│   │   │   │   ├── PlayerSearch.tsx
│   │   │   │   ├── PlayerStats.tsx
│   │   │   │   ├── ContractInfo.tsx
│   │   │   │   ├── Prediction.tsx
│   ├── services/
│   │   ├── api.ts
│   ├── utils/
│   │   ├── formatters.ts
│   ├── main.tsx
│   ├── App.tsx
│
root_files/
│   ├── README.md
│   ├── .gitignore
```

## 🚀 Installation & Setup

### Backend Setup
1. Navigate to the backend directory:
   ```sh
   cd backend
   ```
2. Create and activate a virtual environment:
   ```sh
   python -m venv venv
   source venv/bin/activate  # macOS/Linux
   venv\Scripts\activate     # Windows
   ```
3. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
4. Run the backend API:
   ```sh
   python app.py
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```

## 📡 API Endpoints
| Method | Endpoint           | Description |
|--------|-------------------|-------------|
| POST   | /api/query        | Fetches and processes player data |

## 🎯 Best Practices
- Follow modular programming principles.
- Ensure error handling in API calls.
- Maintain clear documentation in code comments.

## 🔄 Next Steps
- Implement advanced player comparison analytics.
- Optimize AI predictions for player performance.
- Improve frontend UI/UX for better interaction.

---

## 📌 Descripción del Proyecto
Basketball Scouting AI es una aplicación diseñada para recuperar y analizar datos de jugadores de baloncesto desde diversas fuentes, incluyendo APIs y web scraping. Proporciona estadísticas, detalles de contrato y predicciones de rendimiento impulsadas por IA.

## 🏗️ Estructura del Proyecto
(Same structure as above, translated where necessary)

## 🚀 Instalación y Configuración

### Configuración del Backend
(Same installation steps as above, translated where necessary)

### Configuración del Frontend
(Same installation steps as above, translated where necessary)

## 📡 Endpoints de la API
| Método | Endpoint           | Descripción |
|--------|-------------------|-------------|
| POST   | /api/query        | Obtiene y procesa los datos del jugador |

## 🎯 Buenas Prácticas
- Seguir principios de programación modular.
- Garantizar el manejo de errores en las llamadas a la API.
- Mantener documentación clara en los comentarios del código.

## 🔄 Próximos Pasos
- Implementar análisis avanzado de comparación de jugadores.
- Optimizar las predicciones de rendimiento con IA.
- Mejorar la UI/UX del frontend para una mejor interacción.

