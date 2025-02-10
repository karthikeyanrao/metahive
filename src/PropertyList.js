import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { db } from './context/firebase';
import { collection, getDocs } from 'firebase/firestore';
import 'leaflet/dist/leaflet.css';
import image1 from './home.png';
import './PropertyList.css';
import ThreeBackground from './ThreeBackground';

// Red marker icon
const redMarker = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/128/684/684908.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

function PropertyList() {
  const [properties, setProperties] = useState([
    { id: 1, title: 'Modern Downtown Apartment', price: 450000, location: 'Church Street, Bangalore', bedrooms: 2, bathrooms: 2, area: 1200, lat: 12.9758, lng: 77.6095, image: image1 },
    { id: 2, title: 'Luxury Condo', price: 650000, location: 'Indiranagar, Bangalore', bedrooms: 3, bathrooms: 2, area: 1500, lat: 12.9716, lng: 77.6412, image: image1 },
    { id: 3, title: 'Stylish Loft', price: 850000, location: 'Whitefield, Bangalore', bedrooms: 4, bathrooms: 3, area: 1800, lat: 12.9698, lng: 77.7499, image: image1 },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [visibleMap, setVisibleMap] = useState(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'properties'));
      const firestoreProperties = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lat: 12.9716, // Default latitude
        lng: 77.5946, // Default longitude
        image: image1, // Default image
      }));

      setProperties(prev => {
        const existingIds = new Set(prev.map(p => p.id));
        const newProperties = firestoreProperties.filter(p => !existingIds.has(p.id));
        return [...prev, ...newProperties];
      });
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          property.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesPrice = true;
    if (priceRange === 'low') {
      matchesPrice = property.price <= 200000;
    } else if (priceRange === 'mid') {
      matchesPrice = property.price > 200000 && property.price <= 500000;
    } else if (priceRange === 'high') {
      matchesPrice = property.price > 500000;
    }

    return matchesSearch && matchesPrice;
  });

  const toggleMap = (propertyId) => {
    setVisibleMap(visibleMap === propertyId ? null : propertyId);
  };

  return (
    <>
      <ThreeBackground />
      <div className="property-list">
        {/* Back Button */}
        <button className="back-button" onClick={() => window.history.back()}>
           Back
        </button>
        <div className="filters">
          <input
            type="text"
            placeholder="Search by title or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
            <option value="all">All Prices</option>
            <option value="low">$0 - $200,000</option>
            <option value="mid">$200,000 - $500,000</option>
            <option value="high">$500,000+</option>
          </select>
        </div>

        <div className="properties-grid">
          {filteredProperties.map((property) => (
            <div key={property.id} className="property-card">
              <Link to={`/property/${property.id}`} className="property-link">
                <div className="property-image-container">
                  <img src={property.image} alt={property.title} />
                </div>
                <div className="property-info">
                  <h3>{property.title}</h3>
                  <p className="price">${property.price.toLocaleString()}</p>
                  <p className="details">{property.bedrooms} beds • {property.bathrooms} baths • {property.area} sqft</p>
                </div>
              </Link>
              <p className="location">
                <span
                  className="location-marker"
                  onClick={() => toggleMap(property.id)}
                  style={{ cursor: 'pointer' }}
                >
                    {property.location}
                </span>
              </p>
              {visibleMap === property.id && (
                <div className="mini-map">
                  <MapContainer center={[property.lat, property.lng]} zoom={13} style={{ height: '200px', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={[property.lat, property.lng]} icon={redMarker}>
                      <Popup>{property.title}</Popup>
                    </Marker>
                  </MapContainer>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default PropertyList;
