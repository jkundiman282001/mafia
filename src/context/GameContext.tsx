import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { GameState, Player, GamePhase } from '../types';

interface GameContextType {
  state: GameState;
  hostGame: () => void;
  joinGame: (gameCode: string, playerName: string) => void;
  startGame: () => void;
  nextPhase: () => void;
  submitAction: (targetPlayer: Player) => void;
  resetGame: () => void;
}

const initialState: GameState = {
  players: [],
  currentPhase: 'night',
  selectedPlayer: null,
  mafiaCount: 0,
  doctorTarget: null,
  detectiveTarget: null,
  phaseTimeLeft: 120,
  gameLog: [],
  gameCode: '',
  isHost: false,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

type GameAction =
  | { type: 'HOST_GAME' }
  | { type: 'JOIN_GAME'; payload: { gameCode: string; playerName: string } }
  | { type: 'START_GAME' }
  | { type: 'NEXT_PHASE' }
  | { type: 'SUBMIT_ACTION'; payload: Player }
  | { type: 'RESET_GAME' }
  | { type: 'UPDATE_PHASE_TIME'; payload: number };

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'HOST_GAME':
      const gameCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      localStorage.setItem('mafiaGameCode', gameCode);
      return {
        ...state,
        gameCode,
        isHost: true,
      };

    case 'JOIN_GAME':
      if (state.players.length >= 12) {
        return state;
      }
      const newPlayer: Player = {
        id: state.players.length,
        name: action.payload.playerName,
        role: 'townspeople',
        alive: true,
      };
      return {
        ...state,
        players: [...state.players, newPlayer],
        gameLog: [...state.gameLog, `${action.payload.playerName} joined the game!`],
      };

    case 'START_GAME':
      if (state.players.length < 6) {
        return state;
      }
      const playersWithRoles = assignRoles(state.players);
      return {
        ...state,
        players: playersWithRoles,
        currentPhase: 'night',
        mafiaCount: playersWithRoles.filter(p => p.role === 'mafia').length,
      };

    case 'NEXT_PHASE':
      const nextPhase = getNextPhase(state.currentPhase);
      return {
        ...state,
        currentPhase: nextPhase,
        phaseTimeLeft: 120,
        selectedPlayer: null,
        doctorTarget: null,
        detectiveTarget: null,
      };

    case 'SUBMIT_ACTION':
      return {
        ...state,
        selectedPlayer: action.payload,
      };

    case 'RESET_GAME':
      return initialState;

    case 'UPDATE_PHASE_TIME':
      return {
        ...state,
        phaseTimeLeft: action.payload,
      };

    default:
      return state;
  }
}

function assignRoles(players: Player[]): Player[] {
  const playerCount = players.length;
  const mafiaCount = Math.floor(playerCount / 3);
  const roles: ('mafia' | 'townspeople' | 'doctor' | 'detective')[] = [
    ...Array(mafiaCount).fill('mafia'),
    'doctor',
    'detective',
    ...Array(playerCount - mafiaCount - 2).fill('townspeople'),
  ];

  // Shuffle roles
  for (let i = roles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [roles[i], roles[j]] = [roles[j], roles[i]];
  }

  return players.map((player, index) => ({
    ...player,
    role: roles[index],
  }));
}

function getNextPhase(currentPhase: GamePhase): GamePhase {
  switch (currentPhase) {
    case 'night':
      return 'day';
    case 'day':
      return 'voting';
    case 'voting':
      return 'night';
    default:
      return 'night';
  }
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  useEffect(() => {
    const savedGameCode = localStorage.getItem('mafiaGameCode');
    if (savedGameCode) {
      dispatch({ type: 'HOST_GAME' });
    }
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (state.phaseTimeLeft > 0 && state.currentPhase !== 'game-over') {
      timer = setInterval(() => {
        dispatch({ type: 'UPDATE_PHASE_TIME', payload: state.phaseTimeLeft - 1 });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [state.phaseTimeLeft, state.currentPhase]);

  const value = {
    state,
    hostGame: () => dispatch({ type: 'HOST_GAME' }),
    joinGame: (gameCode: string, playerName: string) =>
      dispatch({ type: 'JOIN_GAME', payload: { gameCode, playerName } }),
    startGame: () => dispatch({ type: 'START_GAME' }),
    nextPhase: () => dispatch({ type: 'NEXT_PHASE' }),
    submitAction: (targetPlayer: Player) =>
      dispatch({ type: 'SUBMIT_ACTION', payload: targetPlayer }),
    resetGame: () => dispatch({ type: 'RESET_GAME' }),
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
} 