
import React from 'react';

interface GameOverScreenProps {
    score: number;
    onRestart: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, onRestart }) => {
    return (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-white z-10">
            <h2 className="text-5xl font-bold text-red-500 mb-4">GAME OVER</h2>
            <p className="text-2xl mb-2">Your Score: {score}</p>
            <button 
                onClick={onRestart}
                className="mt-6 px-8 py-3 bg-indigo-600 text-white font-bold text-xl rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 transition-transform transform hover:scale-105"
            >
                RESTART
            </button>
        </div>
    );
};

export default GameOverScreen;
