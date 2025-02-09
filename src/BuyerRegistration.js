import React, { useState } from 'react';
import './BuyerRegistration.css';

function BuyerRegistration() {
  const [formData, setFormData] = useState({
    fullName: '',
    aadharId: '',
    aadharProof: null,
    email: '',
    phone: '',
    address: '',
    occupation: '',
    annualIncome: '',
    panNumber: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prevState => ({
      ...prevState,
      aadharProof: e.target.files[0]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log(formData);
  };

  return (
    <div className="buyer-registration">
      <div className="registration-container">
        <h1>Buyer Registration</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Aadhar ID *</label>
              <input
                type="text"
                name="aadharId"
                value={formData.aadharId}
                onChange={handleInputChange}
                required
                placeholder="Enter your Aadhar number"
                pattern="[0-9]{12}"
                title="Please enter valid 12-digit Aadhar number"
              />
            </div>

            <div className="form-group">
              <label>PAN Number *</label>
              <input
                type="text"
                name="panNumber"
                value={formData.panNumber}
                onChange={handleInputChange}
                required
                placeholder="Enter PAN number"
                pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                title="Please enter valid PAN number"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Aadhar Card Proof *</label>
            <input
              type="file"
              name="aadharProof"
              onChange={handleFileChange}
              required
              accept=".pdf,.jpg,.jpeg,.png"
              className="file-input"
            />
            <small>Upload your Aadhar card (PDF, JPG, PNG)</small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Enter email address"
              />
            </div>

            <div className="form-group">
              <label>Phone *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                placeholder="Enter phone number"
                pattern="[0-9]{10}"
                title="Please enter valid 10-digit phone number"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Residential Address *</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              placeholder="Enter your complete residential address"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Occupation *</label>
              <input
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={handleInputChange}
                required
                placeholder="Enter your occupation"
              />
            </div>

            <div className="form-group">
              <label>Annual Income *</label>
              <input
                type="number"
                name="annualIncome"
                value={formData.annualIncome}
                onChange={handleInputChange}
                required
                min="0"
                placeholder="Enter annual income"
              />
            </div>
          </div>

          <button type="submit" className="submit-button">
            Register as Buyer
          </button>
        </form>
      </div>
    </div>
  );
}

export default BuyerRegistration; 