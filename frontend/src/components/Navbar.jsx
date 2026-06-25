import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CalendarDays, LogOut, User as UserIcon } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <CalendarDays className="brand-icon" />
          <span>LocalEvents</span>
        </Link>
      </div>
      <div className="navbar-links">
        <Link to="/">Explore</Link>
        {user ? (
          <>
            {user.role === 'Organizer' && <Link to="/dashboard">Dashboard</Link>}
            <Link to="/bookings">My Bookings</Link>
            <div className="user-menu">
              <span className="user-greeting">Hi, {user.name}</span>
              <button onClick={handleLogout} className="btn-icon">
                <LogOut size={18} />
              </button>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-outline">Login</Link>
            <Link to="/register" className="btn-primary">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
