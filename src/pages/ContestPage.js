import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ContestPage.css';
import baseURL from '../utils/baseURL';
import axios from 'axios';
import CreateContestModal from '../components/CreateContestModal';


const ContestPage = () => {
  const [contests, setContests] = useState({ current: [], upcoming: [], finished: [] });
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const handleJoinContest = async (contestId) => {
  try {
    const userId = localStorage.getItem('userName'); // Replace with actual user ID logic
    
    await axios.post(`${baseURL}/contest/add-participant`, { contestId, userId });
    
    // Optionally, refetch contests to update UI
    const response = await axios.get(`${baseURL}/contest`);
    const now = new Date();
    const contests = response.data.reduce((acc, contest) => {
      const startTime = new Date(contest.startTime);
      const endTime = new Date(contest.endTime);
      if (endTime > now) {
        if (startTime > now) {
          acc.upcoming.push(contest);
        } else {
          acc.current.push(contest);
        }
      } else {
        acc.finished.push(contest);
      }
      return acc;
    }, { current: [], upcoming: [], finished: [] });

    setContests(contests);
    navigate(`/contests/${contestId}`);
  } catch (error) {
    console.error("Error joining contest:", error);
  }
};


  useEffect(() => {
    const fetchContests = async () => {
      const response = await axios.get(`${baseURL}/contest`);
      const now = new Date();
      const contests = response.data.reduce((acc, contest) => {
        const startTime = new Date(contest.startTime);
        const endTime = new Date(contest.endTime);
        if (endTime > now) {
          if (startTime > now) {
            acc.upcoming.push(contest);
          } else {
            acc.current.push(contest);
          }
        } else {
          acc.finished.push(contest);
        }
        return acc;
      }, { current: [], upcoming: [], finished: [] });

      setContests(contests);
    };

    fetchContests();

  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setContests((prevContests) => {
        const updatedContests = { ...prevContests };
        updatedContests.current = prevContests.current.filter(
          (contest) => new Date(contest.endTime) > now
        );
        updatedContests.finished = [
          ...prevContests.finished,
          ...prevContests.current.filter((contest) => new Date(contest.endTime) <= now),
        ];
        return updatedContests;
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const renderContests = (contests, title) => (
    <div className="contest-section">
      <h3>{title}</h3>
      {contests.length === 0 ? (
        <p>No contests available</p>
      ) : (
        contests.map((contest) => (
          <div key={contest._id} className="contest-card">
            <h4>{contest.name}</h4>
            <p>Participants: {contest.participants.length}</p>
            <p>Questions: {contest.questions.length}</p>
            <p>
              {new Date(contest.startTime).toLocaleString()} -{' '}
              {new Date(contest.endTime).toLocaleString()}
            </p>
            <button   onClick={() => handleJoinContest(contest._id)}>Join Contest </button>
          </div>
        ))
      )}
    </div>
  );

  const handleCreateContest = () => {
    setShowModal(true);
  };

  const handleContestCreated = () => {
    const fetchContests = async () => {
      const response = await axios.get(`${baseURL}/contest`);
      const now = new Date();
      const contests = response.data.reduce((acc, contest) => {
        const startTime = new Date(contest.startTime);
        const endTime = new Date(contest.endTime);
        if (endTime > now) {
          if (startTime > now) {
            acc.upcoming.push(contest);
          } else {
            acc.current.push(contest);
          }
        } else {
          acc.finished.push(contest);
        }
        return acc;
      }, { current: [], upcoming: [], finished: [] });

      setContests(contests);
    };

    fetchContests();
  };

  

  return (
    <div className="contest-page">
      {renderContests(contests.current, 'Current Contests')}
      {renderContests(contests.upcoming, 'Upcoming Contests')}
      {renderContests(contests.finished, 'Finished Contests')}
      <button className="create-contest-button" onClick={handleCreateContest}>
        Create Contest
      </button>

      {showModal && (
        <CreateContestModal setShowModal={setShowModal} onCreateContest={handleContestCreated} />
      )}
    </div>
  );
};

export default ContestPage;
