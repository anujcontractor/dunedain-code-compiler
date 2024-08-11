import React, { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import axios from 'axios';
import './AddProblem.css';
import { toast } from 'react-toastify';
import baseURL from '../utils/baseURL';
import Select from 'react-select';


const AddProblem = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [constraints, setConstraints] = useState('');
  const [testCases, setTestCases] = useState([{ input: '', output: '', explanation: '', isSample: false, showExplanation: false }]);
  const tagOptions = [
    { value: 'array', label: 'Array' },
    { value: 'dp', label: 'Dynamic Programming' },
    { value: 'linkedlist', label: 'Linked List' },
    { value: 'string', label: 'String' },
  ]; 
  const customStyles = {
    control: (base, state) => ({
      ...base,
      
      // match with the menu
      borderRadius: state.isFocused ? "3px 3px 0 0" : 3,
      // Overwrittes the different states of border
      borderColor: state.isFocused ? "yellow" : "green",
      // Removes weird border around container
      boxShadow: state.isFocused ? null : null,
      
    }),
    menu: base => ({
      ...base,
      background: "#023950",
      // override border radius to match the box
      borderRadius: 0,
      // kill the gap
      marginTop: 0
      
    }),
    menuList: base => ({
      ...base,
      background: "#023950",
      // kill the white space on first and last option
      padding: 0
    })
  };
  const [selectedTags, setSelectedTags] = useState([]);
  


const [difficulty, setDifficulty] = useState('Easy');




  const handleAddTestCase = () => {
    setTestCases([...testCases, { input: '', output: '', explanation: '', isSample: false, showExplanation: false }]);
  };

  const handleRemoveTestCase = (index) => {
    if (testCases.length > 1) {
      const newTestCases = testCases.filter((_, idx) => idx !== index);
      setTestCases(newTestCases);
    } else {
      toast.error('At least one test case is required');
    }
  };

  const handleTestCaseChange = (index, field, value) => {
    const newTestCases = [...testCases];
    newTestCases[index][field] = value;
    setTestCases(newTestCases);
  };

  const toggleExplanation = (index) => {
    const newTestCases = [...testCases];
    newTestCases[index].showExplanation = !newTestCases[index].showExplanation;
    setTestCases(newTestCases);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const questionData = {
      title,
      description,
      constraints,
      examples: testCases,
      tags: selectedTags.map(tag => tag.value),
      difficulty
    };

    try {
      await axios.post(`${baseURL}/question/new-question`, questionData);
      toast.success('Problem added successfully');
      setTitle('');
      setDescription('');
      setConstraints('');
      setTestCases([{ input: '', output: '', explanation: '', isSample: false, showExplanation: false }]);
      setSelectedTags([]);
      setDifficulty('easy');
    } catch (error) {
      console.error('Error adding question:', error);
      toast.error('Failed to add question');
    }
  };
  

  return (
    <div className="container add-question-page">
      <div className="problem-home-banner">
        <h1>Add New Problem</h1>
      </div>
      <div className="problem-home-content">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
            style={{ width: '90%' }}
              type="text"
              id="title"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <MDEditor
              value={description}
              onChange={setDescription}
            />
          </div>
          
         
          <div className="form-group">
            <label>Test Cases:</label>
            {testCases.map((testCase, index) => (
              <div key={index} className="test-case">
                <div className="form-group">
                  <label htmlFor={`input-${index}`}>Input:</label>
                  <textarea
                  style={{ width: '90%' }}
                    id={`input-${index}`}
                    className="form-control"
                    value={testCase.input}
                    onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor={`output-${index}`}  >Output:</label>
                  <textarea
                    style={{ width: '90%' }}
                    id={`output-${index}`}
                    className="form-control"
                    value={testCase.output}
                    onChange={(e) => handleTestCaseChange(index, 'output', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={testCase.isSample}
                      onChange={(e) => handleTestCaseChange(index, 'isSample', e.target.checked)}
                    />
                    Use as Sample Test Case
                  </label>
                </div>
                <div className="form-group">
                  <button type="button" className="btn toggle-explanation-button" onClick={() => toggleExplanation(index)}>
                    {testCase.showExplanation ? 'Hide Explanation' : 'Add Explanation'}
                  </button>
                  {testCase.showExplanation && (
                    <div className="form-group">
                      <label htmlFor={`explanation-${index}`}>Explanation:</label>
                      <MDEditor
                        value={testCase.explanation}
                        onChange={(value) => handleTestCaseChange(index, 'explanation', value)}
                      />
                    </div>
                  )}
                </div>
                <button type="button" className="btn remove-test-case-button" onClick={() => handleRemoveTestCase(index)}>Remove Test Case</button>
              </div>
            ))}
            <button type="button" className="btn cta-button" onClick={handleAddTestCase}>Add Test Case</button>
          </div>
          <div className="form-group">
            <label htmlFor="constraints">Constraints:</label>
            <MDEditor
              value={constraints}
              onChange={setConstraints}
            />
          </div>
          
  <div className="form-group">
  <label htmlFor="tags">Tags:</label>
  <Select 
    styles={customStyles}
    id="tags"
    options={tagOptions}
    isMulti
    value={selectedTags}
    onChange={setSelectedTags}
    placeholder="Select tags"
  />
</div>

<div className="form-group">
  <label htmlFor="difficulty">Difficulty:</label>
  <select 
    id="difficulty" 
    value={difficulty} 
    onChange={(e) => setDifficulty(e.target.value)}
  >
    <option value="Easy">Easy</option>
    <option value="Medium">Medium</option>
    <option value="Hard">Hard</option>
  </select>
</div>
          <button  type="submit" className="btn cta-button">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default AddProblem;
