import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import './BuilderRegistration.css';
import ThreeBackground from './ThreeBackground';

function BuilderRegistration() {
  const [formData, setFormData] = useState({
    builderName: '',
    companyName: '',
    licenseNumber: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    description: ''
  });

  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const auth = getAuth();
  const db = getFirestore();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Step 1: Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      // Step 2: Save builder details in Firestore
      const builderData = {
        builderName: formData.builderName,
        companyName: formData.companyName,
        licenseNumber: formData.licenseNumber,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        description: formData.description,
        role: 'builder',
        registrationDate: new Date().toISOString(),
        userId: user.uid
      };

      // Save to Firestore
      await setDoc(doc(db, "builders", user.uid), builderData);

      setSuccess(`Builder registered successfully! Welcome, ${formData.builderName}`);
      setError(null);

      // Clear form after successful registration
      setFormData({
        builderName: '',
        companyName: '',
        licenseNumber: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        description: ''
      });

    } catch (err) {
      setError(err.message);
      setSuccess(null);
      console.error("Error during registration:", err);
    }
  };

  return (
    <div>
      <ThreeBackground />
      <div className="builder-registration">
        <div className="registration-container">
          <h1>Builder Registration</h1>
          {error && <div className="error-message">{error}</div>}
          {success && (
            <div className="success-message">
              <span role="img" aria-label="success">✅</span> {success}
            </div>
          )}
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

            <div className="form-group">
              <label>Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="Enter password"
              />
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
    </div>
  );
}

export default BuilderRegistration; 