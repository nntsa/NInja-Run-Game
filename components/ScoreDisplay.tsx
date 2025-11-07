
import React from 'react';

interface ScoreDisplayProps {
    score: number;
    highScore: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score, highScore }) => {
    return (
        <div className="absolute top-4 right-4 text-right text-white text-lg md:text-xl font-bold tracking-widest">
            <div>HI {String(highScore).padStart(5, '0')}</div>
            <div>{String(score).padStart(5, '0')}</div>
        </div>
    );
};

export default React.memo(ScoreDisplay);
