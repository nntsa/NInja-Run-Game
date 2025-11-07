
import React from 'react';
import { GROUND_HEIGHT } from '../constants';

const Ground: React.FC = () => {
    return (
        <div 
            style={{ height: `${GROUND_HEIGHT}px` }} 
            className="absolute bottom-0 left-0 w-full bg-gray-700 border-t-4 border-gray-500"
        ></div>
    );
};

export default React.memo(Ground);
