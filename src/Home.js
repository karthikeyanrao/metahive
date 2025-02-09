import React from 'react';
import { Link } from 'react-router-dom';
import ThreeBackground from './ThreeBackground';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <ThreeBackground />
      <section className="hero-section">
        <h1>The Future of LifeScapes</h1>
        <p>
        Find properties so extraordinary, even your dream home will do a double take. 
        Your future address is chilling in our curated collection—go say hi!
        </p>
        <Link to="/properties" className="cta-button">
          Explore Properties
        </Link>
      </section>

      <section className="features-section">
        <h2>Why Choose Us</h2>
        <div className="features-grid">
          <div className="feature-card">
            <i className="fas fa-building"></i>
            <h3>Premium Selection</h3>
            <p>Access to exclusive properties and luxury real estate options tailored to your preferences.</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-shield-alt"></i>
            <h3>Secure Transactions</h3>
            <p>Advanced blockchain technology ensuring safe and transparent property dealings.</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-chart-line"></i>
            <h3>Smart Investment</h3>
            <p>Data-driven insights and market analysis to make informed investment decisions.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home; 