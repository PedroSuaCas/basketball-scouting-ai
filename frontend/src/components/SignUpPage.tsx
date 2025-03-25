import React from 'react';
import { useNavigate } from 'react-router-dom';
import moodboard from './ui/images/Moodboard.png';
import { ShoppingBasket as Basketball} from 'lucide-react';

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    // Aquí podrías añadir validación
    navigate('/home');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center font-sans">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${moodboard})` }}
      />

      <div className="relative z-10 bg-white bg-opacity-95 p-10 rounded-2xl shadow-2xl max-w-md w-full text-center border border-gray-300 backdrop-blur-sm">
        <div className="flex flex-col items-center mb-6">
          <Basketball className="w-10 h-10 text-[#8B0000] mb-2" />
          <h1 className="text-3xl font-extrabold text-[#8B0000] tracking-tight drop-shadow-sm">
            Create your account
          </h1>
        </div>

        <input
          type="text"
          placeholder="Full Name"
          className="mb-4 w-full px-4 py-3 text-sm border-2 border-[#8B0000] rounded-full placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
        />
        <input
          type="email"
          placeholder="Email"
          className="mb-4 w-full px-4 py-3 text-sm border-2 border-[#8B0000] rounded-full placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
        />
        <input
          type="password"
          placeholder="Password"
          className="mb-6 w-full px-4 py-3 text-sm border-2 border-[#8B0000] rounded-full placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
        />

        <button
          onClick={handleSignUp}
          className="w-full bg-[#8B0000] text-white px-4 py-3 rounded-full font-semibold tracking-wide hover:bg-red-900 transition"
        >
          Sign Up
        </button>

        <p className="text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <span
            className="text-[#8B0000] font-semibold cursor-pointer hover:underline"
            onClick={() => navigate('/')}
          >
            Log In
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
