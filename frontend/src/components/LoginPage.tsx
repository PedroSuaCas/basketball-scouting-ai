import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [selectedSport, setSelectedSport] = useState<'basketball' | 'football' | null>(null);
  const navigate = useNavigate();

  const handleSelectSport = (sport: 'basketball' | 'football') => {
    setSelectedSport(sport);
  };

  const handleLogin = () => {
    if (selectedSport === 'basketball') {
      navigate('/basketball'); // HomePage actual de baloncesto
    } else if (selectedSport === 'football') {
      navigate('/football'); // Página de fútbol
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-6">Login</h1>

        {/* Botones de selección de deporte */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            className={`px-6 py-2 rounded-full border-2 font-semibold transition ${
              selectedSport === 'basketball'
                ? 'bg-[#8B0000] text-white border-[#8B0000]'
                : 'bg-white text-[#8B0000] border-[#8B0000]'
            }`}
            onClick={() => handleSelectSport('basketball')}
          >
            Basketball
          </button>
          <button
            className={`px-6 py-2 rounded-full border-2 font-semibold transition ${
              selectedSport === 'football'
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white text-green-600 border-green-600'
            }`}
            onClick={() => handleSelectSport('football')}
          >
            Football / Soccer
          </button>
        </div>

        {/* Formulario de login simulado */}
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-[#8B0000] text-white py-2 rounded-lg font-semibold hover:bg-red-900 transition"
          disabled={!selectedSport}
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
