import React, { useState, useEffect } from 'react';
import { BrowserProvider, Contract } from 'ethers';
import { db } from './context/firebase';
import { collection, addDoc, query, where, getDocs, doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './BuildingBadge.css';

// Simplified ABI for basic NFT functionality
const NFT_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "uri",
        "type": "string"
      }
    ],
    "name": "safeMint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "tokenURI",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

function BuildingBadge({ contractAddress, tokenId, isSold, propertyTitle, nftMinted }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [minting, setMinting] = useState(false);
  const [showMintForm, setShowMintForm] = useState(false);
  const [showMintPopup, setShowMintPopup] = useState(false);
  const [mintFormData, setMintFormData] = useState({
    buildingName: '',
    location: '',
    imageUrl: ''
  });
  const [propertyId, setPropertyId] = useState('');

  const [createdAt, setCreatedAt] = useState(null);

  const storage = getStorage();

  // Generate a unique identifier for the property if none is provided
  const propertyIdentifier = `property_${contractAddress}_${tokenId}`;

  // Log the nftMinted status when the component mounts
  useEffect(() => {
    console.log('NftMinted status:', nftMinted); // Print the nftMinted status to the console
  }, [nftMinted]); // Dependency array to run effect when nftMinted changes

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMintFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };



  const handleShowMintForm = () => {
    setShowMintForm(true); // Set showMintForm to true to display the minting form
  };

  const saveBadgeToFirestore = async (badgeData) => {
    try {
      const badgesRef = collection(db, 'nft_badges');
      const docRef = await addDoc(badgesRef, {
        ...badgeData,
        contractAddress,
        tokenId: tokenId.toString(),
        propertyIdentifier, // Use the generated identifier
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('Badge saved to Firestore with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Error saving to Firestore:", error);
      throw error;
    }
  };

  const mintNFT = async (e) => {
    e.preventDefault();
    try {
      setMinting(true);
      setError(null);
      
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const nftContract = new Contract(contractAddress, NFT_ABI, signer);
 

      console.log('Transaction sent:', tx.hash);
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);

      // Create badge details
      const newBadgeDetails = {
        buildingName: metadata.name,
        location: metadata.description,
        isVerified: true,
        verificationDate: new Date(),
        badgeURI: metadata.image,
        tokenId: tokenId.toString(),
        ownerAddress: await signer.getAddress(),
        transactionHash: tx.hash,
        metadata: metadata
      };

      // Save to Firestore
      await saveBadgeToFirestore(newBadgeDetails);

      // Update state
      setBadgeDetails(newBadgeDetails);

      // Clear form and hide it
      setMintFormData({
        buildingName: '',
        location: '',
        imageUrl: ''
      });
      setShowMintForm(false);
      setShowMintPopup(false);
      
    } catch (error) {
      console.error("Error minting NFT:", error);
      setError(error.message);
    } finally {
      setMinting(false);
    }
  };


  const fetchPropertyData = async () => {
    if (propertyId) {
      try {
        const propertyDoc = await getDoc(doc(db, 'Properties', propertyId));
        if (propertyDoc.exists()) {
          setPropertyData(propertyDoc.data());
          setError(null);
        } else {
          setError('Property not found');
        }
      } catch (err) {
        setError('Error fetching property data: ' + err.message);
      }
    }
  };



  useEffect(() => {
    fetchPropertyData();
  }, [propertyId]);

 

  return (
    <div className={`building-badge ${isSold ? 'sold-out' : ''}`}>
      { !showMintForm && !isSold && (
        <div className="mint-section">
          {nftMinted === "No" ? (
            <button 
              className="mint-button" 
              onClick={handleShowMintForm}
              disabled={loading}
            >
              {loading ? 'Minting...' : 'Mint NFT'}
            </button>
          ) : (
            <p>This property has already been minted.</p>
          )}
        </div>
      )}

      { !showMintForm && isSold && (
        <div className="sold-out-section">
          <div className="sold-out-badge">
            <i className="fas fa-check-circle"></i>
            <span>Sold Out</span>
          </div>
        </div>
      )}

      {showMintForm && (
        <div className="mint-form-container">
          <form onSubmit={mintNFT} className="mint-form">
            <h3>Mint New Building Badge</h3>
            
            <div className="form-group">
              <label htmlFor="buildingName">Building Name:</label>
             <p>{propertyTitle}</p>
            </div>
            
            <div className="form-group">
              <label htmlFor="location">Location:</label>
              <p>{propertyTitle}</p>
            </div>
            
            <div className="form-group">
              <label htmlFor="imageUrl">Image URL (optional):</label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={mintFormData.imageUrl}
                onChange={handleInputChange}
                placeholder="Enter image URL"
              />
              <small className="form-help">Leave empty for auto-generated image</small>
            </div>

            <div className="form-buttons">
              <button 
                type="submit" 
                className="mint-button" 
                disabled={minting}
              >
                {minting ? 'Minting...' : 'Mint Badge'}
              </button>
              <button 
                type="button" 
                className="cancel-button"
                onClick={() => setShowMintForm(false)}
              >
                Cancel
              </button>
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
          </form>
        </div>
      )}

      
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {showMintPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Mint NFT</h2>
            <p>Building Name: {badgeDetails?.buildingName}</p>
            <p>Location: {badgeDetails?.location}</p>
            <p>Price: {badgeDetails?.price}</p>
            <p>Are you sure you want to mint this NFT?</p>
            <button onClick={mintNFT}>Confirm Mint</button>
            <button onClick={() => setShowMintPopup(false)}>Cancel</button>
          </div>
        </div>
      )}

      {createdAt && (
        <div>
          <p>Created At: {new Date(createdAt).toLocaleDateString()}</p>
        </div>
      )}
    </div>
  );
}

export default BuildingBadge; 