import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from './context/AuthContext';
import { useWeb3 } from './context/Web3Context';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import { db } from './context/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import * as THREE from 'three';
import './Settings.css';


function Settings() {
  const { currentUser } = useAuth();
  const { isConnected, account } = useWeb3();
  const navigate = useNavigate();
  const [walletBalance, setWalletBalance] = useState(null);
  const [isBuilder, setIsBuilder] = useState(() => {
    // Get the stored value from localStorage or Firestore data
    const storedValue = localStorage.getItem('isBuilder');
    return storedValue ? storedValue === 'true' : false;
  });

  const [profileData, setProfileData] = useState({
    name: '',
    email: currentUser?.email || '',
    avatar: currentUser?.photoURL || '',
    isBuilder: isBuilder // Add isBuilder to profile data
  });

  // Fetch user data including builder status from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser?.uid) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const builderStatus = userData.isBuilder || false;
            setIsBuilder(builderStatus);
            localStorage.setItem('isBuilder', builderStatus);
            
            setProfileData(prev => ({
              ...prev,
              name: userData.name || currentUser.displayName || 'User',
              email: currentUser.email || 'No email provided',
              avatar: userData.avatar || currentUser.photoURL || '',
              isBuilder: builderStatus
            }));
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

  useEffect(() => {
    const fetchBalance = async () => {
      if (isConnected && account) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const balance = await provider.getBalance(account);
          setWalletBalance(ethers.formatEther(balance));
        } catch (error) {
          console.error('Error fetching balance:', error);
        }
      }
    };

    fetchBalance();
  }, [isConnected, account]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (currentUser?.uid) {
      try {
        const userRef = doc(db, 'users', currentUser.uid);
        
        // Check if the document exists
        const docSnap = await getDoc(userRef);
        
        if (docSnap.exists()) {
          // Update existing document
          await updateDoc(userRef, {
            isBuilder: isBuilder,
            name: profileData.name,
            email: profileData.email,
            updatedAt: new Date().toISOString()
          });
        } else {
          // Create new document
          await setDoc(userRef, {
            isBuilder: isBuilder,
            name: profileData.name,
            email: profileData.email,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }

        // Update localStorage
        localStorage.setItem('isBuilder', isBuilder);

        // Show success message
        alert('Settings saved successfully!');
        
        // Navigate to home page after successful save
        navigate('/');
        
      } catch (error) {
        console.error('Error saving settings:', error);
        alert(`Error saving settings: ${error.message}`);
      }
    } else {
      alert('Please login to save settings');
    }
  };

  const handleBuilderChange = (e) => {
    const isChecked = e.target.checked;
    setIsBuilder(isChecked);
    setProfileData(prev => ({
      ...prev,
      isBuilder: isChecked
    }));
  };

  return (
    <div className="settings-container">
      <h1>Account Settings</h1>
      
      <div className="settings-content">
        <div className="profile-section">
          <div className="avatar-section">
            <div className="avatar-preview">
              {profileData.avatar ? (
                <img src={profileData.avatar} alt="Profile" />
              ) : (
                <i className="fas fa-user-circle"></i>
              )}
            </div>
            <button className="upload-button">
              <i className="fas fa-camera"></i>
              Upload Photo
            </button>
          </div>

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={profileData.name}
                readOnly
                className="readonly-input"
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={profileData.email}
                disabled
                className="disabled-input"
              />
            </div>

            <div className="wallet-info">
              <h3>Wallet Information</h3>
              <div className="wallet-details">
                <div className="wallet-address">
                  <label>MetaMask Address:</label>
                  <span className="full-address">{account || 'Not Connected'}</span>
                </div>
                <div className="wallet-balance">
                  <label>MetaMask Balance:</label>
                  <span>{walletBalance ? `${Number(walletBalance).toFixed(4)} ETH` : 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="builder-section">
              <div className="builder-checkbox">
                <input
                  type="checkbox"
                  id="isBuilder"
                  checked={isBuilder}
                  onChange={handleBuilderChange}
                />
                <label htmlFor="isBuilder">I am a Builder</label>
              </div>
              
              {isBuilder && (
                <button 
                  type="button" 
                  className="add-property-button"
                  onClick={() => navigate('/add-property')}
                >
                  Add Property
                </button>
              )}
            </div>

            <button type="submit" className="save-button">
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Settings;