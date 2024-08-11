import axios from "axios";
import baseURL from "../utils/baseURL";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './Problems.css';

const tagOptions = [
    { value: 'array', label: 'Array' },
    { value: 'dp', label: 'Dynamic Programming' },
    { value: 'linkedlist', label: 'Linked List' },
    { value: 'string', label: 'String' },
];

const Problems = () => {

    const [questions, setQuestions] = useState([]);
    const [filteredQuestions, setFilteredQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [difficultyFilter, setDifficultyFilter] = useState("All");
    const [tagFilter, setTagFilter] = useState("");

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get(`${baseURL}/question/all`);
                setQuestions(response.data);
                setFilteredQuestions(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching questions:', error);
                setLoading(false);
            }
        };

        fetchQuestions();
    }, []);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        filterQuestions(e.target.value, difficultyFilter, tagFilter);
    };

    const handleDifficultyChange = (e) => {
        setDifficultyFilter(e.target.value);
        filterQuestions(search, e.target.value, tagFilter);
    };

    const handleTagChange = (e) => {
        setTagFilter(e.target.value);
        filterQuestions(search, difficultyFilter, e.target.value);
    };

    const filterQuestions = (searchText, difficulty, tag) => {
        let filtered = questions;

        if (difficulty !== "All") {
            filtered = filtered.filter(question => question.difficulty === difficulty);
        }

        if (tag) {
            filtered = filtered.filter(question => question.tags.includes(tag));
        }

        filtered = filtered.filter(question =>
            question.title.toLowerCase().includes(searchText.toLowerCase())
        );

        setFilteredQuestions(filtered);
    };

    return (
        <div className="problems-page">
            <h1>Explore Problems</h1>
            <div className="filters">
                <input 
                    type="text"
                    value={search}
                    onChange={handleSearch}
                    className="search-bar"
                    placeholder="Search problems by name..."
                />
                <select value={difficultyFilter} onChange={handleDifficultyChange} className="difficulty-filter">
                    <option value="All">All Difficulties</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                </select>
                <select value={tagFilter} onChange={handleTagChange} className="tag-filter">
                    <option value="">All Tags</option>
                    {tagOptions.map((tag) => (
                        <option key={tag.value} value={tag.value}>{tag.label}</option>
                    ))}
                </select>
            </div>
            {loading ? (
                <h2>Loading...</h2>
            ) : (
                <div className="problems-list">
                    {filteredQuestions.length ? (
                        filteredQuestions.map((question, index) => (
                            <Link to={`/problems/${question._id}`} key={index} className="problem-card">
                                <h3>{question.title}</h3>
                                <p>Difficulty: {question.difficulty}</p>
                                <p>Tags: {question.tags.join(', ')}</p>
                            </Link>
                        ))
                    ) : (
                        <h2>No problems found</h2>
                    )}
                </div>
            )}
        </div>
    );
};

export default Problems;
