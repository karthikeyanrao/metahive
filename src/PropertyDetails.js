import React, { useState } from "react";
import "./PropertyDetails.css";
import home from "./home.png";
import ThreeBackground from './ThreeBackground';
import { ethers } from 'ethers';
import { useWeb3 } from './context/Web3Context';
import { SENDER_ADDRESS, SENDER_ABI } from './contracts/SenderContract';
import { useParams, useNavigate } from 'react-router-dom';
//import { doc, deleteDoc } from './context/firebase';  
//import { db } from './context/firebase';
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
      <div className="property-details">
        <div className="property-header">
          <div className="header-content">
            <h1 className="property-title">Luxury Penthouse Suite</h1>
            <div className="property-meta">
              <div className="property-location">
                <i className="fas fa-map-marker-alt"></i>
                Downtown, Metropolis
              </div>
              <div className="property-price">$5000,000</div>
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

        {/* Rest of your existing JSX structure */}
        <div className="property-details-grid">
          {/* ... (keeping all the existing content) ... */}
        </div>

        <div className="contact-section">
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
  {!isSold ? (
    <>
      <button 
        className="contact-button" 
        onClick={toggleAgentPopup}
      >
        <i className="fas fa-phone-alt"></i> Contact Agent
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
                <p><strong>Name:</strong> John Smith</p>
                <p><strong>Address:</strong> 123 Luxury St, Metropolis</p>
                <p><strong>Phone:</strong> +1 (234) 567-890</p>
                <p className="rating">⭐⭐⭐⭐⭐</p>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default PropertyDetails;