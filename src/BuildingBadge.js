import React, { useState, useEffect } from 'react';
import { BrowserProvider, Contract } from 'ethers';
import { db } from './context/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
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

function BuildingBadge({ contractAddress, tokenId, isSoldOut }) {
  const [badgeDetails, setBadgeDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [minting, setMinting] = useState(false);
  const [showMintForm, setShowMintForm] = useState(false);
  const [mintFormData, setMintFormData] = useState({
    buildingName: '',
    location: '',
    imageUrl: ''
  });

  // Generate a unique identifier for the property if none is provided
  const propertyIdentifier = `property_${contractAddress}_${tokenId}`;

  useEffect(() => {
    const fetchBadgeFromFirestore = async () => {
      try {
        const badgesRef = collection(db, 'nft_badges');
        const q = query(
          badgesRef, 
          where('contractAddress', '==', contractAddress),
          where('tokenId', '==', tokenId.toString())
        );
        
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const badgeDoc = querySnapshot.docs[0].data();
          // Convert Firestore timestamp to Date object if it exists
          if (badgeDoc.verificationDate) {
            badgeDoc.verificationDate = badgeDoc.verificationDate.toDate();
          }
          setBadgeDetails(badgeDoc);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching badge:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    if (contractAddress && tokenId !== undefined) {
      fetchBadgeFromFirestore();
    }
  }, [contractAddress, tokenId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMintFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMintClick = () => {
    setShowMintForm(true);
  };

  const generateDefaultImage = (buildingName, location) => {
    return `https://via.placeholder.com/400x400.png?text=${encodeURIComponent(buildingName)}%0A${encodeURIComponent(location)}`;
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

      const imageUrl = mintFormData.imageUrl || 
        generateDefaultImage(
          mintFormData.buildingName || "MetaHive Tower",
          mintFormData.location || "Crypto Valley"
        );

      // Create metadata
      const metadata = {
        name: mintFormData.buildingName || "MetaHive Tower",
        description: mintFormData.location || "Crypto Valley, Block #1",
        image: imageUrl,
        attributes: [
          {
            trait_type: "Building Name",
            value: mintFormData.buildingName || "MetaHive Tower"
          },
          {
            trait_type: "Location",
            value: mintFormData.location || "Crypto Valley, Block #1"
          },
          {
            trait_type: "Verification Date",
            value: new Date().toISOString()
          }
        ]
      };

      const metadataUri = `data:application/json;base64,${btoa(JSON.stringify(metadata))}`;
      
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      const tx = await nftContract.safeMint(
        await signer.getAddress(),
        metadataUri
      );

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
      
    } catch (error) {
      console.error("Error minting NFT:", error);
      setError(error.message);
    } finally {
      setMinting(false);
    }
  };

  if (loading) {
    return (
      <div className="badge-loading">
        <i className="fas fa-spinner fa-spin"></i> Loading badge...
      </div>
    );
  }

  return (
    <div className={`building-badge ${isSoldOut ? 'sold-out' : ''}`}>
      {!badgeDetails && !showMintForm && !isSoldOut && (
        <div className="mint-section">
          <button 
            className="mint-button" 
            onClick={handleMintClick}
          >
            Mint New Badge
          </button>
        </div>
      )}

      {!badgeDetails && !showMintForm && isSoldOut && (
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
              <input
                type="text"
                id="buildingName"
                name="buildingName"
                value={mintFormData.buildingName}
                onChange={handleInputChange}
                required
                placeholder="Enter building name"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="location">Location:</label>
              <input
                type="text"
                id="location"
                name="location"
                value={mintFormData.location}
                onChange={handleInputChange}
                required
                placeholder="Enter location"
              />
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

      {badgeDetails && (
        <div className={`badge-container ${isSoldOut ? 'sold-out' : ''}`}>
          <div className="badge-header">
            <h3>MetaHive Verification Badge</h3>
            {isSoldOut && (
              <div className="sold-out-stamp">
                <i className="fas fa-check-circle"></i> Sold Out
              </div>
            )}
            {badgeDetails.isVerified && (
              <div className="verified-stamp">
                <i className="fas fa-check-circle"></i> Verified
              </div>
            )}
          </div>
          
          <div className="badge-content">
            <div className="badge-image">
              <img 
                src={badgeDetails.badgeURI}
                alt={badgeDetails.buildingName}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = generateDefaultImage(
                    badgeDetails.buildingName,
                    badgeDetails.location
                  );
                }}
              />
            </div>
            
            <div className="badge-info">
              <h4>{badgeDetails.buildingName}</h4>
              <p><i className="fas fa-map-marker-alt"></i> {badgeDetails.location}</p>
              <p><i className="fas fa-calendar-check"></i> Verified on: {
                badgeDetails.verificationDate.toLocaleDateString()
              }</p>
            </div>
          </div>

          <div className="badge-footer">
            <div className="badge-authenticity">
              Authenticated by MetaHive
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
}

export default BuildingBadge; 