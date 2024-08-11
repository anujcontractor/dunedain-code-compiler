import React, { useEffect, useState } from 'react';
import './UserDashboard.css';
import axios from 'axios';
import baseURL from '../utils/baseURL';
import { Link } from 'react-router-dom';
const UserDashboard = () => {
  const [userData, setUserData] = useState(null);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userName = localStorage.getItem('userName');
        if (userName) {
          axios.get(`${baseURL}/user/${userName}`).then((response) => {
            setUserData(response.data);
            console.log(response.data);
          });
          console.log('User found in localStorage', userData);
        } else {
          console.log('No user found in localStorage');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

// 

// const fetchProblem = async (questionId) => {
//   try {
//     const response = await axios.get(`${baseURL}/question/${questionId}`, {
//       headers: {
//         'Content-Type': 'application/json',
//         'username': localStorage.getItem('userName'),
//       },
//     });
//     console.log(response.data);
//     return response.data.title; 
//   } catch (error) {
//     console.error('Error fetching question:', error);
//     return null;
//   }
// };

const [questionTitles, setQuestionTitles] = useState([]);

  useEffect(() => {
    const fetchAllQuestions = async () => {
      try {
        const titles = await Promise.all(userData?.solvedQuestions.map(async (question) => {
          const response = await axios.get(`${baseURL}/question/${question}`, {
            headers: {
              'Content-Type': 'application/json',
              'username': localStorage.getItem('userName'),
            },
          });
          return { id: question, title: response.data.question.title };
        }));
        console.log("question : ");
        console.log(titles);
        setQuestionTitles(titles);
      } catch (error) {
        console.error('Error fetching question titles:', error);
      }
    };

    fetchAllQuestions();
  }, [userData]);

  if (!userData) return <p>Loading...</p>;

  return (
    <div className="user-dashboard">
      <div className="profile-section">
        <h2>{userData.username}</h2>
      </div>

      <div className="stats-section">
        <div className="stats">
          <h3>Accuracy </h3>
          {
            userData.solvedQuestions.length > 0
              ? <p>{((userData.rightSub / (userData.rightSub + userData.wrongSub)) * 100).toFixed(2)}%</p>
              : <p>0%</p>
          }
        </div>
        <div className="stats">
          <h3>Questions Solved</h3>
          <p>{userData.solvedQuestions.length}</p>
        </div>
      </div>

      <div className="questions-section">
        <h3>Questions Solved</h3>
        <ul>
      {questionTitles.map(({ id, title }) => (
        <li key={id}>
          <Link to={`/question/${id}`}>{title}</Link>
        </li>
      ))}
    </ul>
      </div>
    </div>
  );
}

export default UserDashboard;
