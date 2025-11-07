import React from 'react';

interface HealthBarProps {
    health: number;
    maxHealth: number;
}

const HealthBar: React.FC<HealthBarProps> = ({ health, maxHealth }) => {
    return (
        <div className="absolute top-4 left-4 flex space-x-2 z-10">
            {Array.from({ length: maxHealth }).map((_, index) => (
                <div 
                    key={index}
                    className={`h-4 w-10 rounded-sm border-2 ${index < health ? 'bg-green-500 border-green-300' : 'bg-gray-700 border-gray-500'}`}
                    style={{ transition: 'background-color 0.3s ease' }}
                ></div>
            ))}
        </div>
    );
};

export default React.memo(HealthBar);