import React from 'react';
import { useGame } from '../context/GameContext';

const GameOver: React.FC = () => {
  const { state, resetGame } = useGame();

  if (state.currentPhase !== 'game-over') {
    return null;
  }

  const mafiaWon = state.players.filter(p => p.alive && p.role === 'mafia').length >=
    state.players.filter(p => p.alive).length / 2;

  return (
    <div className="game-over">
      <h2>Game Over!</h2>
      <div className="winner-announcement">
        {mafiaWon ? 'Mafia Wins!' : 'Town Wins!'}
      </div>
      <div className="player-roles">
        <h3>Final Player Roles:</h3>
        {state.players.map((player) => (
          <div key={player.id} className="player-role">
            {player.name}: {player.role.toUpperCase()}
          </div>
        ))}
      </div>
      <button onClick={resetGame}>New Game</button>
    </div>
  );
};

export default GameOver; 