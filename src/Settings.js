import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from './context/AuthContext';
import { useWeb3 } from './context/Web3Context';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import { db } from './context/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './Settings.css';
import ThreeBackground from './ThreeBackground';

const storage = getStorage(); // Initialize Firebase Storage

function Settings() {
  const { currentUser } = useAuth();
  const { isConnected, account } = useWeb3();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [walletBalance, setWalletBalance] = useState(null);
  const [isBuilder, setIsBuilder] = useState(localStorage.getItem('isBuilder') === 'true');

  const [profileData, setProfileData] = useState({
    name: '',
    email: currentUser?.email || '',
    avatar: currentUser?.photoURL || '',
    isBuilder: isBuilder
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
    const fetchUserData = async () => {
      if (currentUser?.uid) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setProfileData(prev => ({
              ...prev,
              avatar: userData.avatar || localStorage.getItem('avatar') || currentUser.photoURL || ''
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
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    try {
      const storageRef = ref(storage, `avatars/${currentUser.uid}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
  
      // Update Firestore and local state
      await updateDoc(doc(db, "users", currentUser.uid), { avatar: downloadURL });
      setProfileData(prev => ({ ...prev, avatar: downloadURL }));
      localStorage.setItem('avatar', downloadURL);
  
      console.log("Avatar uploaded successfully:", downloadURL);
    } catch (error) {
      console.error("Error uploading avatar:", error);
    }
  };
  
  
  const handleUploadClick = () => {
    fileInputRef.current.click(); // Trigger file input
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (currentUser?.uid) {
      try {
        const userRef = doc(db, 'users', currentUser.uid);
        
        // Check if the document exists
        const docSnap = await getDoc(userRef);
        
        if (docSnap.exists()) {
          await updateDoc(userRef, {
            isBuilder: isBuilder,
            name: profileData.name,
            email: profileData.email,
            updatedAt: new Date().toISOString()
          });
        } else {
          await setDoc(userRef, {
            isBuilder: isBuilder,
            name: profileData.name,
            email: profileData.email,
            avatar: profileData.avatar, 
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }

        localStorage.setItem('isBuilder', isBuilder);
        alert('Settings saved successfully!');
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
    <div>
      <ThreeBackground />
      <div className="settings-container">
        <h1>Account Settings</h1>

        <div className="settings-content">
          <div className="profile-section">

            {/* Avatar Section
            <div className="avatar-section">
              <div className="avatar-preview">
                {profileData.avatar ? (
                  <img src={profileData.avatar} alt="Profile" />
                ) : (
                  <i className="fas fa-user-circle"></i>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <button className="upload-button" onClick={handleUploadClick}>
                <i className="fas fa-camera"></i> Upload Photo
              </button>
            </div> */}

            {/* Profile Form */}
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

              {/* Wallet Info */}
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

              {/* Builder Checkbox */}
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
    </div>
  );
}

export default Settings;
