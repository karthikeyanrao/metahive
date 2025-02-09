import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWeb3 } from './context/Web3Context';
import './Navbar.css';

function Navbar() {
  const location = useLocation();
  const { isConnected, connectWallet, disconnectWallet, account } = useWeb3();
  const [showRegisterDropdown, setShowRegisterDropdown] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Stake and Buy</Link>
      </div>
      <div className="navbar-links">
        {isConnected ? (
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
              List Property
            </Link>
            <div className="account-section">
              <span className="wallet-address">
                {account?.slice(0, 6)}...{account?.slice(-4)}
              </span>
              <button onClick={disconnectWallet} className="login-button">
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
            <button onClick={connectWallet} className="login-button">
              Login with Wallet
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar; 