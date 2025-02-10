import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useWeb3 } from './context/Web3Context';
import { useAuth } from './context/AuthContext';
import './Navbar.css';

function Navbar() {
  const location = useLocation();
  const { isConnected, connectWallet, disconnectWallet, account } = useWeb3();
  const { currentUser, logout } = useAuth();
  const [showRegisterDropdown, setShowRegisterDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Invest and Ingest</Link>
      </div>
      <div className="navbar-links">
        {currentUser ? (
          <>
            <Link 
              to="/properties" 
              className={location.pathname === '/properties' ? 'active' : ''}
            >
              Browse Properties
            </Link>
            <Link 
              to="/add-property"
              className={location.pathname === '/add-property' ? 'active' : ''}
            >
              Add Property
            </Link>
            <div className="account-section">
              <button onClick={connectWallet} className="connect-wallet-button">
                {isConnected ? 
                  `${account?.slice(0, 6)}...${account?.slice(-4)}` : 
                  'Connect Wallet'
                }
              </button>
              <button onClick={handleLogout} className="login-button">
                Logout
              </button>
            </div>
          </>
        ) : (
          <div className="auth-buttons">
            <div className="register-dropdown">
              <button 
                className="register-button"
                onMouseEnter={() => setShowRegisterDropdown(true)}
                onMouseLeave={() => setShowRegisterDropdown(false)}
              >
                Register
                {showRegisterDropdown && (
                  <div className="dropdown-menu">
                    <Link to="/register/builder" className="dropdown-item">Builder</Link>
                    <Link to="/register/buyer" className="dropdown-item">Buyer</Link>
                  </div>
                )}
              </button>
            </div>
            <Link to="/login" className="login-nav-button">
              Login 
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar; 