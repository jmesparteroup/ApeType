export interface Game {
    id: string;
    creatorId: string;
    creatorReady: boolean;
    testType: string;
    testLevel: number;
    players: Player[];
    testcase: string[];
    readyToStart: boolean;
    rankings: Player[];
}

export interface Player {
    id: string;
    nickname: string;
    color: string;
    wpm: number;
    accuracy: number;
    ready: boolean;
    progress: number;
}

export interface StartPayload {
    gameId: string;
    type: string;
    level: number;
    time?: number;
    numWords?: number;
    quoteLength?: number;
}