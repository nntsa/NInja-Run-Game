
import React from 'react';

interface StartScreenProps {
    onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
    return (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-white z-10">
            <h1 className="text-6xl font-black text-indigo-400 mb-2 drop-shadow-lg">NINJA RUN</h1>
            <p className="text-xl mb-8 text-gray-300">Press Space or Tap to Jump</p>
            <button 
                onClick={onStart}
                className="px-10 py-4 bg-green-600 text-white font-bold text-2xl rounded-lg hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition-transform transform hover:scale-105 animate-pulse"
            >
                START GAME
            </button>
        </div>
    );
};

export default StartScreen;
