import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logOut } = UserAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">WARVAULT<span>STREAM</span></Link>
      <div className="nav-links">
        {user ? (
          <>
            {/* Link ini akan membawa user ke koleksi film pribadinya */}
            <Link to="/collection" className="nav-item">MY VAULT</Link>
            <button onClick={handleLogout} className="btn-logout">LOGOUT</button>
          </>
        ) : (
          <Link to="/login" className="btn-login-nav">SIGN IN</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;