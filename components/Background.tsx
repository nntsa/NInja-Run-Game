import React from 'react';
import { GAME_HEIGHT, GAME_WIDTH } from '../constants';

interface BackgroundProps {
    isBoosted: boolean;
}

const Background: React.FC<BackgroundProps> = ({ isBoosted }) => {
    const layerStyle: React.CSSProperties = {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '200%', // Two copies of the background image
        height: '100%',
        backgroundRepeat: 'repeat-x',
        transition: 'animation-duration 0.5s ease-out',
    };

    return (
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
            {/* Far layer: Mountains */}
            <div 
                style={{
                    ...layerStyle,
                    animation: `scroll-far ${isBoosted ? 20 : 40}s linear infinite`,
                    opacity: 0.3,
                }}
            >
                <svg width="100%" height="100%" viewBox={`0 0 ${GAME_WIDTH * 2} ${GAME_HEIGHT}`} preserveAspectRatio="none">
                    <path 
                        d={`M0,${GAME_HEIGHT - 100} 
                           l150,-80 l100,50 l120,-60 l180,70 l150,-40 l100,50 
                           L800,${GAME_HEIGHT - 120}
                           l150,-80 l100,50 l120,-60 l180,70 l150,-40 l100,50
                           L1600,${GAME_HEIGHT - 100}
                           V${GAME_HEIGHT} H0 Z`} 
                        fill="#1a202c"
                    />
                </svg>
            </div>
            {/* Near layer: Trees/Hills */}
            <div 
                style={{
                    ...layerStyle,
                    animation: `scroll-near ${isBoosted ? 10 : 20}s linear infinite`,
                    opacity: 0.5,
                }}
            >
                <svg width="100%" height="100%" viewBox={`0 0 ${GAME_WIDTH * 2} ${GAME_HEIGHT}`} preserveAspectRatio="none">
                    <path 
                        d={`M0,${GAME_HEIGHT - 60} 
                           c100,-30 150,10 250,0
                           s150,-40 250,-20 
                           s200,30 300,10 
                           
                           c100,-30 150,10 250,0
                           s150,-40 250,-20 
                           s200,30 300,10 
                           
                           V${GAME_HEIGHT} H0 Z`} 
                        fill="#2d3748"
                    />
                </svg>
            </div>
        </div>
    );
};

export default React.memo(Background);