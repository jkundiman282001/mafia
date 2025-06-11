import React, { useState } from 'react';
import { useGame } from '../context/GameContext';

const GameSetup: React.FC = () => {
  const { state, joinGame, startGame } = useGame();
  const [gameCode, setGameCode] = useState('');
  const [playerName, setPlayerName] = useState('');

  if (!state.gameCode && state.players.length === 0) {
    return null;
  }

  const handleJoinGame = () => {
    if (gameCode && playerName) {
      joinGame(gameCode, playerName);
      setPlayerName('');
    }
  };

  return (
    <div className="setup-section">
      {state.isHost ? (
        <>
          <h2>Game Code: {state.gameCode}</h2>
          <div className="waiting-room">
            <h3>Waiting Room</h3>
            <div className="joined-players">
              {state.players.map((player, index) => (
                <div key={player.id} className="joined-player">
                  <div className="player-number">{index + 1}</div>
                  <div className="player-name">{player.name}</div>
                </div>
              ))}
            </div>
            <div className="player-count">
              Players: {state.players.length}/12
            </div>
            <button
              onClick={startGame}
              disabled={state.players.length < 6}
            >
              Start Game
            </button>
          </div>
        </>
      ) : (
        <div className="join-section">
          <h2>Join Game</h2>
          <input
            type="text"
            placeholder="Enter Game Code"
            value={gameCode}
            onChange={(e) => setGameCode(e.target.value.toUpperCase())}
          />
          <input
            type="text"
            placeholder="Enter Your Name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
          <button onClick={handleJoinGame}>Join</button>
        </div>
      )}
    </div>
  );
};

export default GameSetup; 