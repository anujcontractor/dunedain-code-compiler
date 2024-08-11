import React, { useState, useEffect } from 'react';
import axios from 'axios';
import baseURL from '../utils/baseURL';
import './ProblemPage.css';
import { useParams } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import ContestCompiler from '../components/ContestCompiler';

const ContestProblemPage = () => {
    
    let t = 0;
    const questionId = useParams().queId;
    const contestId = useParams().contestId;
    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const response = await axios.get(`${baseURL}/question/${contestId}/${questionId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'username': localStorage.getItem('userName'),
                    },
                });
                setProblem(response.data.question);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching problem:', error);
                setLoading(false);
            }
        };

        fetchProblem();
    }, [questionId, contestId]);

    return (
        <div className="problem-page">
            {loading ? (
                <h2>Loading...</h2>
            ) : (
                <>
                    <div className="problem-details">
                        <h1>{problem?.title}</h1>
                        <MDEditor.Markdown
                            source={problem?.description}
                            style={{
                                fontSize: "20px",
                                display: "block",
                                margin: "auto auto",
                                padding: "2rem",
                                backgroundColor: "inherit",
                            }}
                        />

                        <h3>Test Cases:</h3>
                        <ul>
                            {problem?.examples?.map((testcase, index) => (
                                <>
                                {testcase.isSample && <li key={index}>
                                    <strong>Testcase {++t}:</strong><br />
                                    <MDEditor.Markdown
                                        source={testcase.input}
                                        style={{
                                            fontSize: "18px",
                                            display: "block",
                                            margin: "auto auto",
                                            padding: "2rem",
                                            backgroundColor: "inherit",
                                        }}
                                    />
                                    <strong>Expected Output:</strong><br />
                                    <MDEditor.Markdown
                                        source={testcase.output}
                                        style={{
                                            fontSize: "18px",
                                            display: "block",
                                            margin: "auto auto",
                                            padding: "2rem",
                                            backgroundColor: "inherit",
                                        }}
                                    />
                                    {testcase?.explanation && (
                                        <>
                                            <strong>Explanation:</strong><br />
                                            <MDEditor.Markdown
                                                source={testcase.explanation}
                                                style={{
                                                    fontSize: "18px",
                                                    display: "block",
                                                    margin: "auto auto",
                                                    padding: "2rem",
                                                    backgroundColor: "inherit",
                                                }}
                                            />
                                        </>
                                    )}
                                </li>}
                                </>
                            ))}
                        </ul>
                        {problem?.constraints && (<><h3>Constraints:</h3>
                        <MDEditor.Markdown
                            source={problem?.constraints}
                            style={{
                                fontSize: "18px",
                                display: "block",
                                margin: "auto auto",
                                padding: "2rem",
                                backgroundColor: "inherit",
                            }}
                        /></>)}
                    </div>

                    <div className="compiler-section">
                        <ContestCompiler />
                    </div>
                </>
            )}
        </div>
    );
};

export default ContestProblemPage;
