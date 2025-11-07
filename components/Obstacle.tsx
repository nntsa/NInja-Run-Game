
import React from 'react';
import { GROUND_HEIGHT } from '../constants';

interface ObstacleProps {
    x: number;
    width: number;
    height: number;
}

const Obstacle: React.FC<ObstacleProps> = ({ x, width, height }) => {
    const style: React.CSSProperties = {
        position: 'absolute',
        bottom: `${GROUND_HEIGHT}px`,
        left: `${x}px`,
        width: `${width}px`,
        height: `${height}px`,
    };

    return (
        <div style={style} className="bg-red-500 border-2 border-red-300 rounded-sm"></div>
    );
};

export default React.memo(Obstacle);
