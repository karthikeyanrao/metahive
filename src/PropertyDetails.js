import React, { useState, useEffect } from "react";
import "./PropertyDetails.css";
import home from "./home.png";
import ThreeBackground from './ThreeBackground';
import { ethers } from 'ethers';
import { useWeb3 } from './context/Web3Context'; // Make sure you have this context
import { SENDER_ADDRESS, SENDER_ABI } from './contracts/SenderContract';
import { useParams } from 'react-router-dom';
import BuildingBadge from './BuildingBadge';

function PropertyDetails() {
  const { id } = useParams(); // Assuming you have a property ID from the URL
  const [selectedImage, setSelectedImage] = useState(null);
  const { isConnected, account } = useWeb3();
  const [paymentStatus, setPaymentStatus] = useState('');
  const [isSold, setIsSold] = useState(() => {
    return localStorage.getItem(`property_${id}_sold`) === 'true'
  });
  const [property, setProperty] = useState(null);
  const NFT_CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Your deployed contract address

  const images = [
    { id: 1, url: home, alt: "Living Room" },
    { id: 2, url: home, alt: "Kitchen" },
    { id: 3, url: home, alt: "Master Bedroom" },
    { id: 4, url: home, alt: "Bathroom" },
  ];

  const features = {
    basics: [
      { icon: "fa-bed", text: "Bedrooms", value: "4" },
      { icon: "fa-bath", text: "Bathrooms", value: "3" },
      { icon: "fa-ruler-combined", text: "Square Feet", value: "3,500" },
      { icon: "fa-car", text: "Garage", value: "2 Cars" },
    ],
    comfort: [
      { icon: "fa-fan", text: "Climate Control", value: "Central AC" },
      { icon: "fa-swimming-pool", text: "Pool", value: "Infinity" },
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
      
      // Get contract instance
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Create contract instance with ABI
      const senderContract = new ethers.Contract(
        SENDER_ADDRESS, 
        SENDER_ABI, 
        signer
      );

      // Amount to send (2 ETH)
      const amountToSend = ethers.parseEther("2.0");

      setPaymentStatus('Processing payment...'); // Show processing status
      
      // Send transaction
      const tx = await senderContract.sendEther({ value: amountToSend });
      await tx.wait();
      
      setPaymentStatus(''); // Clear the status
      setIsSold(true);  // Set the property as sold
      // Store the sold status in localStorage
      localStorage.setItem(`property_${id}_sold`, 'true');
      alert('Payment sent successfully!');
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus(''); // Clear the status
      
      // Show user-friendly error message
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
          {/* Back Button */}
          <button className="back-button" onClick={() => window.history.back()}>
            Back
          </button>
          <div className="header-content">
            <h1 className="property-title">Luxury Penthouse Suite</h1>
            <div className="property-meta">
              <div className="property-location">
                <i className="fas fa-map-marker-alt"></i>
                Downtown, Metropolis
              </div>
              <div className="property-price">
                {isSold ? (
                  <span className="sold-out-price">SOLD OUT</span>
                ) : (
                  '$5000,000'
                )}
              </div>
            </div>
            <div className="property-tags">
              <span className="tag">Premium</span>
              <span className="tag">Verified</span>
              {isSold && <span className="tag sold">Sold Out</span>}
            </div>
          </div>
        </div>

        <div className={`gallery-container ${isSold ? 'sold-out' : ''}`}>
          <div className="main-image">
            <img src={selectedImage || images[0].url} alt="Main view" />
            {isSold && (
              <div className="sold-out-overlay">
                <span>SOLD OUT</span>
              </div>
            )}
          </div>
          <div className="gallery-thumbnails">
            {images.map((image) => (
              <div
                key={image.id}
                className={`thumbnail ${selectedImage === image.url ? "active" : ""} ${isSold ? 'sold-out' : ''}`}
                onClick={() => setSelectedImage(image.url)}
              >
                <img src={image.url} alt={image.alt} />
              </div>
            ))}
          </div>
        </div>

        <div className={`property-details-grid ${isSold ? 'sold-out' : ''}`}>
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

        <div className={`contact-section ${isSold ? 'sold-out' : ''}`}>
          <div className="agent-info">
            <div className="agent-avatar">
              <i className="fas fa-user-circle"></i>
            </div>
            <div className="agent-details">
              <h3>John Smith</h3>
              <p>Luxury Property Specialist</p>
            </div>
          </div>
          <div className="contact-buttons">
            <button className="contact-button" disabled={isSold}>
              <i className="fas fa-phone-alt"></i>
              Contact Builder
            </button>
            <button className="schedule-button" disabled={isSold}>
              <i className="fas fa-calendar-alt"></i>
              Schedule Viewing
            </button>
            <button 
              className={`pay-button ${isSold ? 'sold-out' : ''}`}
              onClick={handlePayment}
              disabled={!isConnected || isSold}
            >
              <i className="fas fa-credit-card"></i>
              {isSold ? 'Sold Out' : 'Pay Now'}
            </button>
            {paymentStatus && (
              <div className={`payment-status ${paymentStatus.includes('failed') ? 'error' : ''}`}>
                {paymentStatus}
              </div>
            )}
          </div>
        </div>

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


