import React, { useEffect, useState } from 'react';
import { fetchTop10 } from '../ApiHandler';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import './Leaderboard.css';

export default function Leaderboard() {
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  useEffect(() => {
    const getTop = async () => {
      setLoading(true);
      try {
        const data = await fetchTop10();
        setTopUsers(data['leaderboard']);
        setLastRefreshed(new Date());
      } catch (error) {
        if (error.response && error.response.status === 429) {
          console.warn('Too many requests, retrying in 1 second...');
          setTimeout(getTop, 1000); // Retry after 1 second
        } else {
          console.error('Failed to fetch leaderboard:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    getTop();
    const interval = setInterval(getTop, 30000); // Auto-refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const data = await fetchTop10();
      setTopUsers(data['leaderboard']);
      setLastRefreshed(new Date());
    } catch (error) {
      if (error.response && error.response.status === 429) {
        console.warn('Too many requests, retrying in 1 second...');
        setTimeout(handleRefresh, 1000); // Retry after 1 second
      } else {
        console.error('Failed to fetch leaderboard:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <h2 className="leaderboard-title">🏆 Leaderboard</h2>
        <button onClick={handleRefresh} className="refresh-button" disabled={loading}>
          <FontAwesomeIcon icon={faSyncAlt} spin={loading} />
        </button>
      </div>
      <p className="refresh-note">
        Refreshes every 30 seconds
        {lastRefreshed && ` | Last refreshed at: ${lastRefreshed.toLocaleTimeString()}`}
      </p>
      <ul className="leaderboard-list">
        {topUsers.map((user, index) => (
          <li key={index} className="leaderboard-item">
            <span className="leaderboard-rank">#{index + 1}</span>
            <span className="leaderboard-name">{user.username}</span>
            <span className="leaderboard-score">{user.score} pts</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
