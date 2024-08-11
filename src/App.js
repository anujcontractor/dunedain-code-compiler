
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AddProblem from './pages/AddProblem';
import Navbar from './components/Navbar';
import Compiler from './components/Compiler';
import UserDashboard from './pages/UserDashboard';

import ContestPage from './pages/ContestPage';
import ContestDetails from './pages/ContestDetails';

import './App.css';
import Problems from "./pages/Problems";
import ProblemPage from "./pages/ProblemPage";
import ContestProblemPage from "./pages/ContestProblemPage";

function App() {
    
    return (
        <div className="App">
            <Router>
            <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/compiler" element={<Compiler />} />
                    <Route path="/add-problem" element={<AddProblem />} />
                    <Route path="/user-dashboard" element={<UserDashboard />} />
                    <Route path="/problems" element={<Problems />} />
                    <Route path="/contests" element={<ContestPage />} />
                    <Route path="/contests/:id" element={<ContestDetails />} />
                    <Route path='/problems/:id' element={<ProblemPage />} />
                    <Route path='/contests/:contestId/:queId' element={<ContestProblemPage />} />
            </Routes>
            </Router>
            <ToastContainer />
        </div>
    );
    
}

export default App;
