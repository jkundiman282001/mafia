export type Role = 'mafia' | 'townspeople' | 'doctor' | 'detective';

export interface Player {
    id: number;
    name: string;
    role: Role;
    alive: boolean;
}

export type GamePhase = 'night' | 'day' | 'voting' | 'game-over';

export interface GameState {
    players: Player[];
    currentPhase: GamePhase;
    selectedPlayer: Player | null;
    mafiaCount: number;
    doctorTarget: Player | null;
    detectiveTarget: Player | null;
    phaseTimeLeft: number;
    gameLog: string[];
    gameCode: string;
    isHost: boolean;
} 