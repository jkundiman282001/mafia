import React from 'react';
import { GameProvider } from './context/GameContext';
import Menu from './components/Menu';
import GameSetup from './components/GameSetup';
import GamePhase from './components/GamePhase';
import GameOver from './components/GameOver';
import './App.css';

function App() {
  return (
    <GameProvider>
      <div className="app">
        <Menu />
        <GameSetup />
        <GamePhase />
        <GameOver />
      </div>
    </GameProvider>
  );
}

export default App; 