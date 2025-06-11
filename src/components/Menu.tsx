import React from 'react';
import { useGame } from '../context/GameContext';

const Menu: React.FC = () => {
  const { state, hostGame } = useGame();

  if (state.currentPhase !== 'night' || state.players.length > 0) {
    return null;
  }

  return (
    <div className="menu-section">
      <h1>Mafia Game</h1>
      <div className="menu-buttons">
        <button onClick={hostGame}>Host Game</button>
        <button onClick={() => {}}>Join Game</button>
      </div>
    </div>
  );
};

export default Menu; 