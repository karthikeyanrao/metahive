import React, { useState } from "react";
import "./PropertyDetails.css";
import home from "./home.png";

function PropertyDetails() {
  const [selectedImage, setSelectedImage] = useState(null);

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

  return (
    <div className="property-details">
      <div className="property-header">
        <div className="header-content">
          <h1 className="property-title">Luxury Penthouse Suite</h1>
          <div className="property-meta">
            <div className="property-location">
              <i className="fas fa-map-marker-alt"></i>
              Downtown, Metropolis
            </div>
            <div className="property-price">$2,500,000</div>
          </div>
          <div className="property-tags">
            <span className="tag">Premium</span>
            <span className="tag">Verified</span>
            <span className="tag">New</span>
          </div>
        </div>
      </div>

      <div className="gallery-container">
        <div className="main-image">
          <img src={selectedImage || images[0].url} alt="Main view" />
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
            <h3>John Smith</h3>
            <p>Luxury Property Specialist</p>
          </div>
        </div>
        <div className="contact-buttons">
          <button className="contact-button">
            <i className="fas fa-phone-alt"></i>
            Contact Agent
          </button>
          <button className="schedule-button">
            <i className="fas fa-calendar-alt"></i>
            Schedule Viewing
          </button>
        </div>
      </div>
    </div>
  );
}

export default PropertyDetails;
