
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Ninja from './components/Ninja';
import Obstacle from './components/Obstacle';
import Ground from './components/Ground';
import ScoreDisplay from './components/ScoreDisplay';
import GameOverScreen from './components/GameOverScreen';
import StartScreen from './components/StartScreen';
import { useGameLoop } from './hooks/useGameLoop';
import { GameState, ObstacleType } from './types';
import { 
    GAME_WIDTH, 
    GAME_HEIGHT, 
    NINJA_WIDTH, 
    NINJA_HEIGHT, 
    GROUND_HEIGHT, 
    GRAVITY, 
    JUMP_STRENGTH, 
    OBSTACLE_SPEED, 
    SCORE_RATE,
    MIN_OBSTACLE_INTERVAL,
    MAX_OBSTACLE_INTERVAL,
    OBSTACLE_WIDTH,
    OBSTACLE_HEIGHT
} from './constants';

const App: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>(GameState.Menu);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(() => Number(localStorage.getItem('ninjaHighScore') || 0));
    
    const ninjaY = useRef(0);
    const ninjaVelocityY = useRef(0);
    const [obstacles, setObstacles] = useState<ObstacleType[]>([]);
    const timeToNextObstacle = useRef(0);
    const gameSpeedMultiplier = useRef(1);

    const resetGameState = useCallback(() => {
        ninjaY.current = 0;
        ninjaVelocityY.current = 0;
        setObstacles([]);
        setScore(0);
        timeToNextObstacle.current = 2000;
        gameSpeedMultiplier.current = 1;
    }, []);

    const startGame = () => {
        resetGameState();
        setGameState(GameState.Playing);
    };

    const handleJump = useCallback(() => {
        if (gameState === GameState.Playing && ninjaY.current === 0) {
            ninjaVelocityY.current = JUMP_STRENGTH;
        }
    }, [gameState]);

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.code === 'Space' || e.key === ' ') {
                handleJump();
            }
        };
        
        window.addEventListener('keydown', handleKeyPress);
        window.addEventListener('touchstart', handleJump);
        window.addEventListener('mousedown', handleJump);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
            window.removeEventListener('touchstart', handleJump);
            window.removeEventListener('mousedown', handleJump);
        };
    }, [handleJump]);
    
    const gameTick = useCallback((deltaTime: number) => {
        if (gameState !== GameState.Playing) return;

        // Update score and game speed
        setScore(prev => prev + deltaTime * SCORE_RATE * gameSpeedMultiplier.current);
        gameSpeedMultiplier.current += 0.00005;

        // Ninja physics
        ninjaVelocityY.current += GRAVITY * deltaTime;
        ninjaY.current += ninjaVelocityY.current * deltaTime;
        
        if (ninjaY.current < 0) {
            ninjaY.current = 0;
            ninjaVelocityY.current = 0;
        }

        // Move obstacles
        const currentSpeed = OBSTACLE_SPEED * gameSpeedMultiplier.current;
        const newObstacles = obstacles
            .map(obs => ({ ...obs, x: obs.x - currentSpeed * deltaTime }))
            .filter(obs => obs.x > -OBSTACLE_WIDTH);

        // Spawn new obstacles
        timeToNextObstacle.current -= deltaTime;
        if (timeToNextObstacle.current <= 0) {
            newObstacles.push({
                id: Date.now(),
                x: GAME_WIDTH,
                width: OBSTACLE_WIDTH,
                height: OBSTACLE_HEIGHT,
            });
            timeToNextObstacle.current = Math.random() * (MAX_OBSTACLE_INTERVAL - MIN_OBSTACLE_INTERVAL) + MIN_OBSTACLE_INTERVAL;
        }
        setObstacles(newObstacles);

        // Collision detection
        const ninjaLeft = GAME_WIDTH * 0.1;
        const ninjaRight = ninjaLeft + NINJA_WIDTH;
        const ninjaBottom = ninjaY.current;
        const ninjaTop = ninjaBottom + NINJA_HEIGHT;

        for (const obs of newObstacles) {
            const obsLeft = obs.x;
            const obsRight = obs.x + obs.width;
            const obsBottom = 0;
            const obsTop = obs.height;

            if (ninjaRight > obsLeft && ninjaLeft < obsRight && ninjaTop > obsBottom && ninjaBottom < obsTop) {
                setGameState(GameState.GameOver);
                if (score > highScore) {
                    setHighScore(Math.floor(score));
                    localStorage.setItem('ninjaHighScore', Math.floor(score).toString());
                }
                return;
            }
        }
    }, [gameState, obstacles, score, highScore]);

    useGameLoop(gameTick, gameState === GameState.Playing);

    const isJumping = ninjaY.current > 0;

    return (
        <div 
            className="relative bg-gray-900 overflow-hidden select-none touch-manipulation" 
            style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
        >
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-900 to-gray-900 opacity-80"></div>
            <ScoreDisplay score={Math.floor(score)} highScore={highScore} />
            <Ground />
            <Ninja y={ninjaY.current} isJumping={isJumping} />
            {obstacles.map(obs => (
                <Obstacle key={obs.id} x={obs.x} width={obs.width} height={obs.height} />
            ))}
            {gameState === GameState.Menu && <StartScreen onStart={startGame} />}
            {gameState === GameState.GameOver && <GameOverScreen score={Math.floor(score)} onRestart={startGame} />}
        </div>
    );
};

export default App;
