import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import image1 from './home.png';
import './PropertyList.css';

// Red marker (like Google Maps)
const redMarker = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/128/684/684908.png', // Custom red location pin
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});



function PropertyList() {
  const [properties] = useState([
    {
      id: 1,
      title: 'Modern Downtown Apartment',
      price: 450000,
      location: 'Downtown',
      bedrooms: 2,
      bathrooms: 2,
      area: 1200,
      image: image1,
    },
    {
        id: 2,
        title: 'Modern Downtown Apartment',
        price: 450000,
        location: 'Downtown',
        bedrooms: 2,
        bathrooms: 2,
        area: 1200,
        image: image1,
      },
      {
        id: 3,
        title: 'Modern Downtown Apartment',
        price: 450000,
        location: 'Downtown',
        bedrooms: 2,
        bathrooms: 2,
        area: 1200,
        image: image1,
      },
      {
        id: 4,
        title: 'Modern Downtown Apartment',
        price: 450000,
        location: 'Downtown',
        bedrooms: 2,
        bathrooms: 2,
        area: 1200,
        image: image1,
      },
    // Add more sample properties
    { id: 1, title: 'Modern Downtown Apartment', price: 450000, location: 'San Francisco, CA', bedrooms: 2, bathrooms: 2, area: 1200, lat: 37.7749, lng: -122.4194, image: image1 },
    { id: 2, title: 'Luxury Condo', price: 650000, location: 'Los Angeles, CA', bedrooms: 3, bathrooms: 2, area: 1500, lat: 34.0522, lng: -118.2437, image: image1 },
    { id: 3, title: 'Stylish Loft', price: 850000, location: 'New York, NY', bedrooms: 4, bathrooms: 3, area: 1800, lat: 40.7128, lng: -74.0060, image: image1 },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState('all');

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

  return (
    <div className="property-list">
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

      {/* Map with Red Markers */}
      <MapContainer center={[39.8283, -98.5795]} zoom={4} style={{ height: '500px', width: '100%' }}>
        <TileLayer url={`https://api.maptiler.com/maps/streets/256/{z}/{x}/{y}.png?key=EN3bE5dvQyI2LnUWqzTQ`} />
        {filteredProperties.map((property) => (
          <Marker key={property.id} position={[property.lat, property.lng]} icon={redMarker}>
            <Popup>
              <b>{property.title}</b><br />
              {property.location}<br />
              ${property.price.toLocaleString()}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Property Listings */}
      <div className="properties-grid">
        {filteredProperties.map((property) => (
          <Link to={`/property/${property.id}`} key={property.id} className="property-card">
            <img src={property.image} alt={property.title} />
            <div className="property-info">
              <h3>{property.title}</h3>
              <p className="price">${property.price.toLocaleString()}</p>
              <p className="details">{property.bedrooms} beds • {property.bathrooms} baths • {property.area} sqft</p>
              <p className="location">{property.location}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default PropertyList;
