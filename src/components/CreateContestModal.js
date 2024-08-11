import React, { useState, useEffect } from 'react';
import axios from 'axios';
import baseURL from '../utils/baseURL';
import './CreateContestModal.css';

const CreateContestModal = ({ setShowModal, onCreateContest }) => {
  const [newContest, setNewContest] = useState({
    name: '',
    startTime: '',
    endTime: '',
    questions: [],
  });
  const [allQuestions, setAllQuestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`${baseURL}/question/all`);
        setAllQuestions(response.data);
        setFilteredQuestions(response.data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    const filtered = allQuestions.filter(
      (q) =>
        q.title.toLowerCase().includes(e.target.value.toLowerCase()) ||
        q.tags.some((tag) =>
          tag.toLowerCase().includes(e.target.value.toLowerCase())
        ) ||
        q.difficulty.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredQuestions(filtered);
  };

  const handleQuestionSelect = (questionId) => {
    setSelectedQuestions((prevSelected) =>
      prevSelected.includes(questionId)
        ? prevSelected.filter((id) => id !== questionId)
        : [...prevSelected, questionId]
    );
  };

  const handleCreateContest = async () => {
    try {
      const response = await axios.post(`${baseURL}/contest`, {
        ...newContest,
        questions: selectedQuestions,
      });
      if (response.status === 201) {
        onCreateContest();
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error creating contest:', error);
    }
  };

  const handleCloseModal = (e) => {
    if (e.target.className === 'modal') {
      setShowModal(false);
    }
  };

  return (
    <div className="modal" onClick={handleCloseModal}>
      <div className="modal-content">
        <h3>Create Contest</h3>
        <input
          type="text"
          placeholder="Contest Name"
          value={newContest.name}
          onChange={(e) => setNewContest({ ...newContest, name: e.target.value })}
        />
        <input
          type="datetime-local"
          placeholder="Start Time"
          value={newContest.startTime}
          onChange={(e) => setNewContest({ ...newContest, startTime: e.target.value })}
        />
        <input
          type="datetime-local"
          placeholder="End Time"
          value={newContest.endTime}
          onChange={(e) => setNewContest({ ...newContest, endTime: e.target.value })}
        />
        <div>
          <input
            type="text"
            placeholder="Search Questions"
            value={searchQuery}
            onChange={handleSearch}
          />
          {/* <ul className="question-list">
            {filteredQuestions.map((question) => (
              <li key={question._id}>
                <input
                  type="checkbox"
                  checked={selectedQuestions.includes(question._id)}
                  onChange={() => handleQuestionSelect(question._id)}
                />
                {question.title} - {question.difficulty}
              </li>
            ))}
          </ul> */}
           <ul className="question-list">
        {filteredQuestions.map((question) => (
          <li key={question._id}>
            <input
              type="checkbox"
              checked={selectedQuestions.includes(question._id)}
              onChange={() => handleQuestionSelect(question._id)}
            />
            {question.title} - {question.difficulty}
          </li>
        ))}
      </ul>
        </div>
        <button onClick={handleCreateContest}>Create</button>
        <button onClick={() => setShowModal(false)}>Cancel</button>
      </div>
    </div>
  );
};

export default CreateContestModal;

