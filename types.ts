
export enum GameState {
    Menu,
    Playing,
    GameOver,
}

export interface ObstacleType {
    id: number;
    x: number;
    width: number;
    height: number;
}

export enum PowerUpEffect {
    Shield,
    SpeedBoost,
}

export interface PowerUpType {
    id: number;
    x: number;
    y: number;
    effect: PowerUpEffect;
}
