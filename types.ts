
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
