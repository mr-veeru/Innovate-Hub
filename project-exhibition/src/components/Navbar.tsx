import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
import { FaHome, FaPlus, FaSignOutAlt, FaUser } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const UserSignOut = async () => {
    navigate('/');
    await signOut(auth);
  };

  return (
    <div className="navbar">
      <div className="navbar-links">
        {!user ? (
          <>
            <Link to={'/'} className="nav-link">
              Login
            </Link>
            <Link to={'/register'} className="nav-link">
              Register
            </Link>
          </>
        ) : (
          <>
            <Link to={'/main'} className="nav-link">
              <span title="Home">
                <FaHome />
              </span>
            </Link>
            <Link to={'/createPost'} className="nav-link">
              <span title="Create Post">
                <FaPlus />
              </span>
            </Link>
            <Link to={'/myPost'} className="nav-link">
              <span title="My Posts">
                <FaUser />
              </span>
            </Link>
          </>
        )}
      </div>

      <div className="user-info user-name">
        {user && <p className="user-name">Hello {user.displayName}</p>}
      </div>

      <div className="user-info">
        {user && (
          <>
            {user.photoURL && <img className="user-photo" src={user.photoURL} alt="Profile" />}
            <button className="logout-btn" onClick={UserSignOut}>
              <span title="Sign Out">
                <FaSignOutAlt />
              </span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
