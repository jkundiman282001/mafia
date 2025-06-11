import React from 'react';
import { useGame } from '../context/GameContext';

const GamePhase: React.FC = () => {
  const { state, nextPhase, submitAction } = useGame();

  if (state.currentPhase === 'night' && state.players.length === 0) {
    return null;
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getPhaseInstructions = () => {
    switch (state.currentPhase) {
      case 'night':
        return 'Night Phase - Mafia choose a target, Doctor protects, Detective investigates';
      case 'day':
        return 'Day Phase - Discuss and share information';
      case 'voting':
        return 'Voting Phase - Vote to eliminate a player';
      default:
        return '';
    }
  };

  return (
    <div className="game-phase">
      <div className="phase-header">
        <h2>{state.currentPhase.toUpperCase()} PHASE</h2>
        <div className="timer">Time Left: {formatTime(state.phaseTimeLeft)}</div>
      </div>

      <div className="phase-instructions">
        {getPhaseInstructions()}
      </div>

      <div className="players-grid">
        {state.players.map((player) => (
          <div
            key={player.id}
            className={`player-card ${!player.alive ? 'dead' : ''} ${
              state.selectedPlayer?.id === player.id ? 'selected' : ''
            }`}
            onClick={() => player.alive && submitAction(player)}
          >
            <div className="player-name">{player.name}</div>
            {!player.alive && <div className="dead-overlay">DEAD</div>}
          </div>
        ))}
      </div>

      <div className="game-log">
        <h3>Game Log</h3>
        <div className="log-entries">
          {state.gameLog.map((entry, index) => (
            <div key={index} className="log-entry">
              {entry}
            </div>
          ))}
        </div>
      </div>

      <button
        className="next-phase-button"
        onClick={nextPhase}
        disabled={state.phaseTimeLeft > 0}
      >
        Next Phase
      </button>
    </div>
  );
};

export default GamePhase; 