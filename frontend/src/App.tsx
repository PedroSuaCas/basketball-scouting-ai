import React, { useState } from "react";
import ReactMarkdown from "react-markdown"; // 📌 Agregamos react-markdown
import { ShoppingBasket as Basketball } from "lucide-react";
import { LoadingSpinner } from "./components/ui/LoadingSpinner";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000";

function App() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`${BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",  // 🔥 Cabecera para permitir CORS
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",

        },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      if (data.response) {
        setResponse(data.response);
        setMessage("");
      } else {
        setError("Error en la respuesta de Mistral AI");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setError("Error al conectar con el servidor.");
    }

    setIsLoading(false);
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-8 px-4"    style={{
      backgroundImage: "url('https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=2400&blur=100')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center animate-fade-in">
          <div className="inline-flex items-center justify-center gap-3 mb-4 px-6 py-2 rounded-full glass-effect">
            <Basketball size={40} className="text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text">
              Basketball Scout AI
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto mt-4 glass-effect rounded-lg px-6 py-3 animate-fade-in">
            Type any question about basketball and receive an AI-generated answer.
          </p>
        </div>

        {/* Caja de entrada y botón */}
        <div className="flex flex-col items-center space-y-4">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message here..."
            className="border border-gray-300 rounded-lg p-3 w-full max-w-2xl"
          />
          <button
            onClick={handleSendMessage}
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </div>

        {/* Mensaje de carga */}
        {isLoading && (
          <div className="flex justify-center py-12 animate-fade-in">
            <LoadingSpinner />
          </div>
        )}

        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl text-center glass-effect">
            {error}
          </div>
        )}

     
        {/* 📌 Mostrar información del jugador si la respuesta es sobre un jugador */}
        {response && response.type === "player_info" && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 text-center space-y-4 shadow-lg">
            {response.image_url && (
              <img src={response.image_url} alt={response.player.name} className="w-40 h-40 mx-auto rounded-full border-2 border-gray-300" />
            )}
            <h2 className="text-2xl font-bold">{response.player.name}</h2>
            <div className="text-left space-y-2">
              <p><strong>Team:</strong> {response.player.team}</p>
              <p><strong>Nationality:</strong> {response.player.nationality}</p>
              <p><strong>Age:</strong> {response.player.age}</p>
              <p><strong>Height:</strong> {response.player.height}</p>
              <p><strong>Position:</strong> {response.player.position}</p>
            </div>
          </div>
        )}

        {/* 📌 Mostrar respuesta en texto normal si no es un jugador */}
        {response && response.type === "text" && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl text-center glass-effect">
            <ReactMarkdown>{response.content}</ReactMarkdown>
          </div>
        )}

        {/* Nueva caja de texto para preguntar más */}
        {response && !isLoading && (
          <div className="flex flex-col items-center space-y-4 mt-6">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write another question..."
              className="border border-gray-300 rounded-lg p-3 w-full max-w-2xl"
            />
            <button
              onClick={handleSendMessage}
              className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send"}
              </button>
      </div>
      )}
      </div>
    </div>
  );
}

export default App;
