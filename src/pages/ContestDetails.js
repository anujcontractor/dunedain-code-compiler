import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './ContestDetails.css';
import axios from 'axios';
import baseURL from '../utils/baseURL';

const ContestDetails = () => {
  const { id } = useParams();
  const [contest, setContest] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchContestDetails = async () => {
      try {
        const response = await axios.get(`${baseURL}/contest/${id}`);
        setContest(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching contest details');
        setLoading(false);
      }
    };

    fetchContestDetails();
  }, [id]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(`${baseURL}/contest/${id}/leaderboard`);
        setLeaderboard(response.data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    };

    fetchLeaderboard();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="contest-details">
      <div className="contest-info">
        <h2>{contest.name}</h2>
        <p>Start Time: {new Date(contest.startTime).toLocaleString()}</p>
        <p>End Time: {new Date(contest.endTime).toLocaleString()}</p>
        <p>Participants: {contest.participants.length}</p>
      </div>
      <div className="section-container">
        <div className="questions-list">
          <h3>Questions</h3>
          <ul>
            {contest.questions.map((question) => (
              <li key={question._id}>
                <Link to={`/contests/${id}/${question._id}`}>{question.title}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="leaderboard">
          <h3>Leaderboard</h3>
          {leaderboard.length > 0 ? (
            <ul>
            {leaderboard
              .sort((a, b) => b.solved - a.solved)
              .map((user, index) => (
                <li key={user.username}>
                  <span>{index + 1}. </span>
                  <span>{user.username} </span>
                  <span>solve: {user.solved}</span>
                </li>
              ))}
          </ul>
          ) : (
            <p>No participants have solved any questions yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContestDetails;
