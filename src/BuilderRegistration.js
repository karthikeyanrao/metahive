import React, { useState } from 'react';
import './BuilderRegistration.css';

function BuilderRegistration() {
  const [formData, setFormData] = useState({
    builderName: '',
    companyName: '',
    licenseNumber: '',
    authCertificate: null,
    email: '',
    phone: '',
    address: '',
    website: '',
    yearsOfExperience: '',
    description: ''
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
      authCertificate: e.target.files[0]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log(formData);
  };

  return (
    <div className="builder-registration">
      <div className="registration-container">
        <h1>Builder Registration</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Builder/Company Name *</label>
            <input
              type="text"
              name="builderName"
              value={formData.builderName}
              onChange={handleInputChange}
              required
              placeholder="Enter builder or company name"
            />
          </div>

          <div className="form-group">
            <label>License Number *</label>
            <input
              type="text"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleInputChange}
              required
              placeholder="Enter builder license number"
            />
          </div>

          <div className="form-group">
            <label>Authentication Certificate *</label>
            <input
              type="file"
              name="authCertificate"
              onChange={handleFileChange}
              required
              accept=".pdf,.jpg,.jpeg,.png"
              className="file-input"
            />
            <small>Upload your builder authentication certificate (PDF, JPG, PNG)</small>
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
              />
            </div>
          </div>

          <div className="form-group">
            <label>Office Address *</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              placeholder="Enter complete office address"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Website</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="Enter company website"
              />
            </div>

            <div className="form-group">
              <label>Years of Experience *</label>
              <input
                type="number"
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleInputChange}
                required
                min="0"
                placeholder="Years of experience"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Company Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Tell us about your company and previous projects"
            />
          </div>

          <button type="submit" className="submit-button">
            Register as Builder
          </button>
        </form>
      </div>
    </div>
  );
}

export default BuilderRegistration; 