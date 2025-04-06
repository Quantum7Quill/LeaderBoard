import React, { useState, useEffect } from 'react';
import { fetchUserRank } from '../ApiHandler';
import './UserLookup.css'; // Import the CSS file for styling

export default function UserLookup() {
  const [userId, setUserId] = useState('');
  const [rankInfo, setRankInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (userId) {
        handleLookup();
      }
    }, 500); // 500ms debounce time

    return () => {
      clearTimeout(handler);
    };
  }, [userId]);

  const handleLookup = async () => {
    try {
      const data = await fetchUserRank(userId);
      setRankInfo(data);
      setError(null);
    } catch (err) {
      setRankInfo(null);
      if (err.response) {
        if (err.response.status === 404) {
          setError('User not found');
        } else if (err.response.status === 429) {
          setError('Too many requests. Please try again later.');
        } else {
          setError(`Error: ${err.response.data.message || 'An unexpected error occurred'}`);
        }
      } else if (err.request) {
        setError('Network error. Please check your connection.');
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  return (
    <div className="user-lookup-container">
      <h2>🔍 Look Up Your Rank</h2>
      <input
        type="text"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        placeholder="Enter userid"
        className="user-lookup-input"
      />
      {rankInfo && userId && (
        <p className="user-lookup-result">
           {rankInfo.username} (id = {userId}) is ranked #{rankInfo.rank} with {rankInfo.score} points.
        </p>
      )}
      {error && <p className="user-lookup-error">{error}</p>}
    </div>
  );
}
