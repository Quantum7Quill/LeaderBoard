import axios from 'axios';

const API_BASE = 'http://localhost:8000'; // adjust if needed

export const fetchTop10 = async () => {
  const res = await axios.get(`${API_BASE}/api/leaderboard/top`);
  return res.data;
};

export const fetchUserRank = async (userId) => {
  const res = await axios.get(`${API_BASE}/api/leaderboard/rank/${userId}`);
  return res.data;
};
