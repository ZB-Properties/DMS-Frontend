import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css'


export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();


  return (
    <nav className="navbar">
      <h1>Document Manager</h1>
      <div>
  
        {isAuthenticated && (
          <>
            <Link to="/upload" className="nav-items">Upload</Link>
            <Link to="/documents" className="nav-items">Documents</Link>
            <span>
              Welcome, <strong>{user?.name || "User"}</strong>
            </span>
            <button onClick={logout} className="nav-button">Logout</button>
          </>
        )}

        {!isAuthenticated && (
          <>
            <Link to="/register" className="nav-items">Signup</Link>
            <Link to="/login" className="nav-items">Login</Link>
          </>
        )}
      </div>
    </nav>
  );
}
