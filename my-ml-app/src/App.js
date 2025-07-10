import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Calculate from './components/Calculate';
import Home from './components/Home'

function App() {
  return (
    
    <Router>
      <nav className="navbar">
        <ul>
          <li className="logo-section">
            <img src={logo} alt="Logo" className="logo" />
            <Link to="/" className="brand-text">GoSally</Link>
          </li>
          <li className="nav-links">
            <Link to="/calculate">Calculate</Link>
            <Link to="/register">Register</Link>
            <Link to="/login" className="login-btn">Login</Link>
          </li>
        </ul>
      </nav>

      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calculate" element={<Calculate />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;