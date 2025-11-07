import React, { useState, useEffect, useCallback, useRef } from 'react';
import Ninja from './components/Ninja';
import Obstacle from './components/Obstacle';
import Ground from './components/Ground';
import ScoreDisplay from './components/ScoreDisplay';
import GameOverScreen from './components/GameOverScreen';
import StartScreen from './components/StartScreen';
import Background from './components/Background';
import HealthBar from './components/HealthBar';
import PowerUp from './components/PowerUp';
import { useGameLoop } from './hooks/useGameLoop';
import { GameState, ObstacleType, PowerUpType, PowerUpEffect } from './types';
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
    OBSTACLE_HEIGHT,
    MAX_HEALTH,
    INVINCIBILITY_DURATION,
    MIN_POWERUP_INTERVAL,
    MAX_POWERUP_INTERVAL,
    POWERUP_WIDTH,
    POWERUP_HEIGHT,
    POWERUP_Y_POSITION,
    SHIELD_DURATION,
    BOOST_DURATION,
    BOOST_MULTIPLIER
} from './constants';

const App: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>(GameState.Menu);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(() => Number(localStorage.getItem('ninjaHighScore') || 0));
    const [scale, setScale] = useState(1);
    const [health, setHealth] = useState(MAX_HEALTH);
    const [isInvincible, setIsInvincible] = useState(false);
    
    const ninjaY = useRef(0);
    const ninjaVelocityY = useRef(0);
    const [obstacles, setObstacles] = useState<ObstacleType[]>([]);
    const [powerUps, setPowerUps] = useState<PowerUpType[]>([]);
    const timeToNextObstacle = useRef(0);
    const timeToNextPowerUp = useRef(MIN_POWERUP_INTERVAL);
    const gameSpeedMultiplier = useRef(1);

    const [isShielded, setIsShielded] = useState(false);
    const [isBoosted, setIsBoosted] = useState(false);
    const invincibilityTimer = useRef<number | null>(null);
    const shieldTimer = useRef<number | null>(null);
    const boostTimer = useRef<number | null>(null);

    const resetGameState = useCallback(() => {
        ninjaY.current = 0;
        ninjaVelocityY.current = 0;
        setObstacles([]);
        setPowerUps([]);
        setScore(0);
        setHealth(MAX_HEALTH);
        setIsInvincible(false);
        setIsShielded(false);
        setIsBoosted(false);
        
        if (invincibilityTimer.current) clearTimeout(invincibilityTimer.current);
        if (shieldTimer.current) clearTimeout(shieldTimer.current);
        if (boostTimer.current) clearTimeout(boostTimer.current);
        invincibilityTimer.current = null;
        shieldTimer.current = null;
        boostTimer.current = null;

        timeToNextObstacle.current = 2000;
        timeToNextPowerUp.current = MIN_POWERUP_INTERVAL;
        gameSpeedMultiplier.current = 1;
    }, []);

    const startGame = () => {
        resetGameState();
        setGameState(GameState.Playing);
    };

    useEffect(() => {
        const handleResize = () => {
            const scaleX = window.innerWidth / GAME_WIDTH;
            const scaleY = window.innerHeight / GAME_HEIGHT;
            setScale(Math.min(scaleX, scaleY));
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

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

        const boostFactor = isBoosted ? BOOST_MULTIPLIER : 1;
        const currentScoreRate = SCORE_RATE * boostFactor;
        
        // Update score and game speed
        setScore(prev => prev + deltaTime * currentScoreRate * gameSpeedMultiplier.current);
        gameSpeedMultiplier.current += 0.00005;

        // Ninja physics
        ninjaVelocityY.current += GRAVITY * deltaTime;
        ninjaY.current += ninjaVelocityY.current * deltaTime;
        
        if (ninjaY.current < 0) {
            ninjaY.current = 0;
            ninjaVelocityY.current = 0;
        }

        const ninjaLeft = GAME_WIDTH * 0.1;
        const ninjaRight = ninjaLeft + NINJA_WIDTH;
        const ninjaBottom = ninjaY.current;
        const ninjaTop = ninjaBottom + NINJA_HEIGHT;

        // Obstacle Collision detection
        if (!isInvincible && !isShielded) {
            for (const obs of obstacles) {
                const obsLeft = obs.x;
                const obsRight = obs.x + obs.width;
                const obsBottom = 0;
                const obsTop = obs.height;

                if (ninjaRight > obsLeft && ninjaLeft < obsRight && ninjaTop > obsBottom && ninjaBottom < obsTop) {
                    const newHealth = health - 1;
                    setHealth(newHealth);

                    if (newHealth <= 0) {
                        setGameState(GameState.GameOver);
                        if (score > highScore) {
                            const finalScore = Math.floor(score);
                            setHighScore(finalScore);
                            localStorage.setItem('ninjaHighScore', finalScore.toString());
                        }
                        return;
                    } else {
                        setIsInvincible(true);
                        if (invincibilityTimer.current) clearTimeout(invincibilityTimer.current);
                        invincibilityTimer.current = window.setTimeout(() => {
                            setIsInvincible(false);
                            invincibilityTimer.current = null;
                        }, INVINCIBILITY_DURATION);
                    }
                    break;
                }
            }
        }
        
        // Power-up Collision detection
        let collectedPowerUpId: number | null = null;
        for (const pu of powerUps) {
            const puLeft = pu.x;
            const puRight = pu.x + POWERUP_WIDTH;
            const puBottom = pu.y;
            const puTop = pu.y + POWERUP_HEIGHT;

            if (ninjaRight > puLeft && ninjaLeft < puRight && ninjaTop > puBottom && ninjaBottom < puTop) {
                collectedPowerUpId = pu.id;
                if (pu.effect === PowerUpEffect.Shield) {
                    setIsShielded(true);
                    if (shieldTimer.current) clearTimeout(shieldTimer.current);
                    shieldTimer.current = window.setTimeout(() => setIsShielded(false), SHIELD_DURATION);
                } else if (pu.effect === PowerUpEffect.SpeedBoost) {
                    setIsBoosted(true);
                    if (boostTimer.current) clearTimeout(boostTimer.current);
                    boostTimer.current = window.setTimeout(() => setIsBoosted(false), BOOST_DURATION);
                }
                break;
            }
        }

        const currentSpeed = OBSTACLE_SPEED * gameSpeedMultiplier.current * boostFactor;
        
        // Move obstacles and remove off-screen ones
        let newObstacles = obstacles
            .map(obs => ({ ...obs, x: obs.x - currentSpeed * deltaTime }))
            .filter(obs => obs.x > -OBSTACLE_WIDTH);

        // Move power-ups and remove collected/off-screen ones
        let newPowerUps = powerUps
            .map(pu => ({ ...pu, x: pu.x - currentSpeed * deltaTime }))
            .filter(pu => pu.x > -POWERUP_WIDTH && pu.id !== collectedPowerUpId);
        
        // Spawn new obstacles
        timeToNextObstacle.current -= deltaTime;
        if (timeToNextObstacle.current <= 0) {
            newObstacles.push({ id: Date.now(), x: GAME_WIDTH, width: OBSTACLE_WIDTH, height: OBSTACLE_HEIGHT });
            timeToNextObstacle.current = Math.random() * (MAX_OBSTACLE_INTERVAL - MIN_OBSTACLE_INTERVAL) + MIN_OBSTACLE_INTERVAL;
        }

        // Spawn new power-ups
        timeToNextPowerUp.current -= deltaTime;
        if (timeToNextPowerUp.current <= 0) {
            newPowerUps.push({
                id: Date.now(),
                x: GAME_WIDTH,
                y: POWERUP_Y_POSITION,
                effect: Math.random() < 0.5 ? PowerUpEffect.Shield : PowerUpEffect.SpeedBoost,
            });
            timeToNextPowerUp.current = Math.random() * (MAX_POWERUP_INTERVAL - MIN_POWERUP_INTERVAL) + MIN_POWERUP_INTERVAL;
        }

        setObstacles(newObstacles);
        setPowerUps(newPowerUps);

    }, [gameState, obstacles, powerUps, score, highScore, isInvincible, isShielded, isBoosted, health]);

    useGameLoop(gameTick, gameState === GameState.Playing);

    const isJumping = ninjaY.current > 0;

    return (
        <div 
            className="relative bg-gray-900 overflow-hidden select-none touch-manipulation" 
            style={{ 
                width: GAME_WIDTH, 
                height: GAME_HEIGHT,
                transform: `scale(${scale})`,
                transformOrigin: 'center center',
            }}
        >
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-900 to-gray-900 opacity-80"></div>
            <Background isBoosted={isBoosted} />
            <HealthBar health={health} maxHealth={MAX_HEALTH} />
            <ScoreDisplay score={Math.floor(score)} highScore={highScore} />
            <Ground />
            <Ninja y={ninjaY.current} isJumping={isJumping} isInvincible={isInvincible} isShielded={isShielded} />
            {obstacles.map(obs => (
                <Obstacle key={obs.id} x={obs.x} width={obs.width} height={obs.height} />
            ))}
            {powerUps.map(pu => (
                <PowerUp key={pu.id} x={pu.x} y={pu.y} effect={pu.effect} />
            ))}
            {gameState === GameState.Menu && <StartScreen onStart={startGame} />}
            {gameState === GameState.GameOver && <GameOverScreen score={Math.floor(score)} onRestart={startGame} />}
        </div>
    );
};

export default App;