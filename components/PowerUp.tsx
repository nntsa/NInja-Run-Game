import React from 'react';
import { PowerUpEffect } from '../types';
import { POWERUP_WIDTH, POWERUP_HEIGHT, GROUND_HEIGHT } from '../constants';

interface PowerUpProps {
    x: number;
    y: number;
    effect: PowerUpEffect;
}

const ShieldIcon: React.FC = () => (
    <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ animation: 'pulse-shield 2s ease-in-out infinite' }}
    >
        <path d="M12 2L4 5V11C4 16.5 7.5 21.5 12 23C16.5 21.5 20 16.5 20 11V5L12 2Z" stroke="#63b3ed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="#4299e1" />
    </svg>
);

const SpeedBoostIcon: React.FC = () => (
    <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ animation: 'crackle-boost 0.2s linear infinite' }}
    >
        <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="#f6e05e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="#f6ad55" />
    </svg>
);

const PowerUp: React.FC<PowerUpProps> = ({ x, y, effect }) => {
    const style: React.CSSProperties = {
        position: 'absolute',
        bottom: `${GROUND_HEIGHT + y}px`,
        left: `${x}px`,
        width: `${POWERUP_WIDTH}px`,
        height: `${POWERUP_HEIGHT}px`,
        animation: 'bobbing 1.5s ease-in-out infinite',
    };

    return (
        <div style={style}>
            {effect === PowerUpEffect.Shield ? <ShieldIcon /> : <SpeedBoostIcon />}
        </div>
    );
};

export default React.memo(PowerUp);