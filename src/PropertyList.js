import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import image1 from './home.png';
import './PropertyList.css';

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
    // Add more sample properties
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
        <select
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
        >
          <option value="all">All Prices</option>
          <option value="low">$0 - $200,000</option>
          <option value="mid">$200,000 - $500,000</option>
          <option value="high">$500,000+</option>
        </select>
      </div>
      <div className="properties-grid">
        {filteredProperties.map((property) => (
          <Link to={`/property/${property.id}`} key={property.id} className="property-card">
            <img src={property.image} alt={property.title} />
            <div className="property-info">
              <h3>{property.title}</h3>
              <p className="price">${property.price.toLocaleString()}</p>
              <p className="details">
                {property.bedrooms} beds • {property.bathrooms} baths • {property.area} sqft
              </p>
              <p className="location">{property.location}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default PropertyList; 