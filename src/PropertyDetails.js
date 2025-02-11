import React, { useState } from "react";
import "./PropertyDetails.css";
import home from "./home.png";
import ThreeBackground from './ThreeBackground';
import { ethers } from 'ethers';
import { useWeb3 } from './context/Web3Context';
import { SENDER_ADDRESS, SENDER_ABI } from './contracts/SenderContract';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from "./context/firebase"; // Ensure db is properly exported
import { doc, deleteDoc } from "firebase/firestore";  
import BuildingBadge from './BuildingBadge';

import b1 from './b1.jpg';
import b2 from './b2.jpg';
import be1 from './be1.jpg';
import k1 from './k1.jpg';


function PropertyDetails() {
  const [showAgentPopup, setShowAgentPopup] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(null);
  const { isConnected, account } = useWeb3();
  const [paymentStatus, setPaymentStatus] = useState('');
  const [isSold, setIsSold] = useState(() => {
    return localStorage.getItem(`property_${id}_sold`) === 'true'
  });
  const [property, setProperty] = useState(null);
  const NFT_CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const toggleAgentPopup = () => {
    setShowAgentPopup(!showAgentPopup);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await deleteDoc(doc(db, 'properties', id));
        localStorage.removeItem(`property_${id}_sold`);
        alert('Property deleted successfully!');
        navigate('/');
      } catch (error) {
        console.error('Error deleting property:', error);
        alert('Failed to delete property. Please try again.');
      }
    }
  };
 
  // Rest of your existing constants (images, features, amenities)
  const images = [
    { id: 1, url:be1 , alt: "Living Room" },
    { id: 2, url:k1 , alt: "Kitchen" },
    { id: 3, url: b1, alt: "Master Bedroom" },
    { id: 4, url: b2, alt: "Bathroom" },
  ];

  const features = {
    basics: [
      { icon: "fa-bed", text: "Bedrooms", value: "12" },
      { icon: "fa-bath", text: "Bathrooms", value: "5" },
      { icon: "fa-ruler-combined", text: "Square Feet", value: "4000" },
      { icon: "fa-car", text: "Garage", value: "2 Cars" },
    ],
    comfort: [
      { icon: "fa-fan", text: "Climate Control", value: "Central AC" },
      { icon: "fa-swimming-pool", text: "Pool", value: "2" },
      { icon: "fa-hot-tub", text: "Spa", value: "Jacuzzi" },
      { icon: "fa-sun", text: "Lighting", value: "Smart LED" },
    ],
    security: [
      { icon: "fa-shield-alt", text: "Security System", value: "24/7" },
      { icon: "fa-video", text: "Surveillance", value: "HD Cameras" },
      { icon: "fa-key", text: "Access", value: "Biometric" },
      { icon: "fa-parking", text: "Parking", value: "Secured" },
    ],
  };

  const amenities = [
    "Smart Home System",
    "24/7 Security",
    "Fitness Center",
    "Rooftop Garden",
    "Wine Cellar",
    "Home Theater",
  ];

  const handlePayment = async () => {
    try {
      if (!isConnected) {
        alert('Please connect your wallet first');
        return;
      }
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const senderContract = new ethers.Contract(
        SENDER_ADDRESS, 
        SENDER_ABI, 
        signer
      );

      const amountToSend = ethers.parseEther("2.0");
      setPaymentStatus('Processing payment...');
      
      const tx = await senderContract.sendEther({ value: amountToSend });
      await tx.wait();
      
      setPaymentStatus('');
      setIsSold(true);
      localStorage.setItem(`property_${id}_sold`, 'true');
      alert('Payment sent successfully!');
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('');
      
      if (error.code === 'ACTION_REJECTED') {
        alert('Transaction was rejected by user');
      } else if (error.code === 'INSUFFICIENT_FUNDS') {
        alert('Insufficient funds to complete the transaction');
      } else {
        alert(`Payment failed: ${error.message || 'Please try again'}`);
      }
    }
  };

  return (
    <>
      <ThreeBackground />
      <div className={`property-details ${isSold ? 'sold-out' : ''}`}>
        <div className="property-header">
          <div className="header-content">
            <h1 className="property-title">VIT</h1>
            <div className="property-meta">
              <div className="property-location">
                <i className="fas fa-map-marker-alt"></i>
                Chennai,Tamil Nadu
              </div>
              <div className="property-price">$780,000</div>
            </div>
            <div className="property-tags">
              <span className="tag">Premium</span>
              <span className="tag">Verified</span>
              {isSold ? (
                <span className="tag sold">Sold</span>
              ) : (
                <span className="tag">New</span>
              )}
            </div>
          </div>
        </div>

        <div className="gallery-container">
          <div className="main-image">
            <img src={selectedImage || images[0].url} alt="Main view" />
            {isSold && (
              <div className="sold-overlay">
                <span className="sold-text">SOLD OUT</span>
              </div>
            )}
          </div>
          <div className="gallery-thumbnails">
            {images.map((image) => (
              <div
                key={image.id}
                className={`thumbnail ${
                  selectedImage === image.url ? "active" : ""
                }`}
                onClick={() => setSelectedImage(image.url)}
              >
                <img src={image.url} alt={image.alt} />
              </div>
            ))}
          </div>
        </div>

        <div className="property-details-grid">
          <div className="property-description">
            <h2 className="description-title">About this property</h2>
            <div className="description-content">
              <p>
                Experience luxury living at its finest in this stunning penthouse
                suite. Featuring breathtaking city views, premium finishes, and
                state-of-the-art amenities, this property represents the pinnacle
                of urban sophistication.
              </p>
              <div className="highlights">
                <h3>Property Highlights</h3>
                <ul>
                  <li>Floor-to-ceiling windows with panoramic views</li>
                  <li>Custom Italian kitchen with premium appliances</li>
                  <li>Private elevator access</li>
                  <li>Smart home automation system</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="property-sidebar">
            <div className="features-section">
              <h2 className="features-title">Property Features</h2>
              {Object.entries(features).map(([category, items]) => (
                <div key={category} className="feature-category">
                  <h3 className="category-title">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </h3>
                  <div className="features-list">
                    {items.map((feature, index) => (
                      <div key={index} className="feature-item">
                        <div className="feature-icon">
                          <i className={`fas ${feature.icon}`}></i>
                        </div>
                        <div className="feature-content">
                          <div className="feature-text">{feature.text}</div>
                          <div className="feature-value">{feature.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="amenities-section">
              <h2 className="features-title">Amenities</h2>
              <div className="amenities-list">
                {amenities.map((amenity, index) => (
                  <div key={index} className="amenity-item">
                    <i className="fas fa-check"></i>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="contact-section">
          <div className="agent-info">
            <div className="agent-avatar">
              <i className="fas fa-user-circle"></i>
            </div>
            <div className="agent-details">
              <h3>Advitya</h3>
              <p>Luxury Property Specialist</p>
            </div>
          </div>
          <div className="contact-buttons">
  {!isSold ? (
    <>
      <button 
        className="contact-button" 
        onClick={toggleAgentPopup}
      >
        <i className="fas fa-phone-alt"></i> Contact Builder
      </button>

      <button 
        className="schedule-button" 
        onClick={() => window.open("https://cal.com/subhashini-s-m-kecyon", "_blank")}
      >
        <i className="fas fa-calendar-alt"></i> Schedule Viewing
      </button>

      <button 
        className={`pay-button`}
        onClick={handlePayment}
        disabled={!isConnected}
        style={{ cursor: !isConnected ? 'not-allowed' : 'pointer' }}
      >
        <i className="fas fa-credit-card"></i>
        Pay Now
      </button>
    </>
  ) : (
    <button 
      className="delete-button"
      onClick={handleDelete}
    >
      <i className="fas fa-trash"></i> Delete Property
    </button>
  )}

  {paymentStatus && (
    <div className={`payment-status ${paymentStatus.includes('failed') ? 'error' : ''}`}>
      {paymentStatus}
    </div>
  )}
</div>
        </div>

        {showAgentPopup && (
          <>
            <div className="overlay" onClick={toggleAgentPopup}></div>
            <div className="agent-popup">
              <div className="popup-content">
                <span className="close-button" onClick={toggleAgentPopup}>&times;</span>
                <h2>Agent Details</h2>
                <p><strong>Name:</strong> Advitya</p>
                <p><strong>Address:</strong> 123 Luxury St, Metropolis</p>
                <p><strong>Phone:</strong> +1 (234) 567-890</p>
                <p className="rating">⭐⭐⭐⭐⭐</p>
              </div>
            </div>
          </>
        )}
         <div className={`verification-section ${isSold ? 'sold-out' : ''}`}>
          <h2>Property Verification</h2>
          <BuildingBadge 
            contractAddress={NFT_CONTRACT_ADDRESS}
            tokenId={0}
            isSold={isSold}
          />
        </div>
        
      </div>
    </>
  );
}

export default PropertyDetails;