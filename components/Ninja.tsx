import React from 'react';
import { NINJA_WIDTH, NINJA_HEIGHT, GROUND_HEIGHT } from '../constants';

interface NinjaProps {
    y: number;
    isJumping: boolean;
    isInvincible: boolean;
    isShielded: boolean;
}

const Ninja: React.FC<NinjaProps> = ({ y, isJumping, isInvincible, isShielded }) => {
    const style: React.CSSProperties = {
        position: 'absolute',
        bottom: `${GROUND_HEIGHT + y}px`,
        left: `${NINJA_WIDTH * 2}px`,
        width: `${NINJA_WIDTH}px`,
        height: `${NINJA_HEIGHT}px`,
        transition: 'transform 0.1s ease-out, filter 0.3s ease-out',
        transform: isJumping ? 'rotate(-20deg) scale(1.05)' : 'none',
        transformOrigin: 'bottom center',
        animation: isInvincible ? 'flash 0.2s linear infinite' : 'none',
        filter: isShielded ? 'drop-shadow(0 0 6px #63b3ed) drop-shadow(0 0 10px #63b3ed)' : 'none',
    };

    return (
      <div style={style}>
        <svg width="100%" height="100%" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g style={{ transition: 'transform 0.2s ease-out', transform: isJumping ? 'translateY(-3px)' : 'none' }}>
            {/* Scarf/Tail - rendered behind body */}
            <path 
              d="M3 35 C -10 40, 5 55, -2 58" 
              stroke="#718096" 
              strokeWidth="6" 
              strokeLinecap="round" 
              style={{ transition: 'transform 0.2s ease-out', transform: isJumping ? 'rotate(-15deg) scaleY(1.1) translateX(-5px)' : 'none', transformOrigin: '5px 35px' }} 
            />
            
            {/* Main body shape - dark grey */}
            <path 
              d="M20 2 C31.0457 2 40 10.9543 40 22V50 C40 55.5228 35.5228 60 30 60 H10 C4.47715 60 0 55.5228 0 50 V22 C0 10.9543 8.95431 2 20 2 Z" 
              fill="#2D3748"
              stroke="#1A202C"
              strokeWidth="2"
            />
            
            {/* Mask/Headband area - medium grey */}
            <path d="M0 20 H40 V38 H0 V20 Z" fill="#4A5568"/>
            
            {/* Eyes - bright white to stand out */}
            <ellipse cx="13" cy="29" rx="5" ry="4" fill="white"/>
            <ellipse cx="27" cy="29"rx="5" ry="4" fill="white"/>
          </g>
        </svg>
      </div>
    );
};

export default React.memo(Ninja);