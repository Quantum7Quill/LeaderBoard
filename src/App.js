import React from 'react';
import Leaderboard from './components/Leaderboard';
import UserLookup from './components/UserLookup';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <h1>📊 Leaderboard Dashboard</h1>
      <Leaderboard />
      <div className="divider"></div>
      <UserLookup />
    </div>
  );
}

export default App;
