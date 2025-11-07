
import React from 'react';
import { NINJA_WIDTH, NINJA_HEIGHT, GROUND_HEIGHT } from '../constants';

interface NinjaProps {
    y: number;
    isJumping: boolean;
}

const Ninja: React.FC<NinjaProps> = ({ y, isJumping }) => {
    const style: React.CSSProperties = {
        position: 'absolute',
        bottom: `${GROUND_HEIGHT + y}px`,
        left: `${NINJA_WIDTH * 2}px`,
        width: `${NINJA_WIDTH}px`,
        height: `${NINJA_HEIGHT}px`,
        transition: 'transform 0.1s',
        transform: isJumping ? 'rotate(-15deg)' : 'none',
    };

    return (
      <div style={style} className="bg-gray-800 border-2 border-gray-200 rounded-t-lg rounded-b-sm flex items-start justify-center pt-2">
        <div className="w-4/5 h-4 bg-gray-200 opacity-90 clip-path-ninja-eyes"></div>
      </div>
    );
};

// A simple utility to create the eye-slit effect without adding complex SVG or config
const NinjaStyleInjector = () => (
  <style>{`
    .clip-path-ninja-eyes {
      clip-path: polygon(0 20%, 100% 20%, 100% 40%, 0 40%);
    }
  `}</style>
);


const MemoizedNinja = React.memo(Ninja);

const NinjaContainer: React.FC<NinjaProps> = (props) => (
  <>
    <NinjaStyleInjector />
    <MemoizedNinja {...props} />
  </>
);

export default React.memo(NinjaContainer);
