import { Link } from 'react-router-dom';
import './Navbar.css';
import baseURL from '../utils/baseURL';
import axios from 'axios';
import { toast } from 'react-toastify';

const Navbar = () => {

    window.onload = async function() {
        
        const name = prompt("Enter your name:");
        
        if(name === null || name === "") {
            alert("Please enter a valid name!");
            window.location.reload();
            return;
        }
        try {
            await axios.post(`${baseURL}/user/login`, {name});
            toast.success('Logged in successfully');
          }
          catch (error) {
            console.log(error);
            toast.error('Failed to log in');
          }
        localStorage.setItem('userName',name);
    }

    return (
        <nav className="navbar">
            <div className="logo">
                <Link to='/'>Dunedain's Compiler</Link>
            </div>
            <div className="links">
                <Link to="/">Home</Link>
                <Link to="/add-problem">Add Problem</Link>
                <Link to="/problems">Problems</Link>
                <Link to="/contests">Contests</Link>
                <Link to="/compiler">Compile Code</Link>
            </div>
        </nav>
    );
}

export default Navbar;
