import { Link } from 'react-router-dom';

import './Home.css';

const Home = () => {
    return (
        <div className="home">
            <div className="home-banner">
                <h1>Welcome to Dunedain's Compiler</h1>
                <p>Your all-in-one online coding haven</p>
                <h2>🚀 Code, Compile & Conquer!</h2>
            </div>
            <div className="home-content">
                <h3>What We Support:</h3>
                <ul>
                    <li>⚙️ C - Precision & Performance</li>
                    <li>🔧 C++ - Flexibility & Efficiency</li>
                    <li>🐍 Python - Simplicity & Power</li>
                    <li>☕ Java - Robust & Versatile</li>
                </ul>
                <h4>Why Choose Us?</h4>
                <p>Built with passion, our compiler is designed to bring out the best in your code. Whether you’re debugging a complex algorithm or just starting out, we’ve got you covered!</p>
                <Link to='/compiler' ><button className="cta-button">Start Coding Now</button></Link>
            </div>
            <footer className="home-footer">
                <h2>Made with ❤️ by Dunedain | &copy; 2024 All Rights Reserved</h2>
            </footer>
        </div>
    );
}

export default Home;
