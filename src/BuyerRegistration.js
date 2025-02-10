import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, storage } from "./context/firebase"; // Include initialized Firestore and Storage instances
import { doc, setDoc } from "firebase/firestore"; // Firestore functions
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase Storage functions
import './BuyerRegistration.css';
import ThreeBackground from './ThreeBackground';

function BuyerRegistration() {
  const [formData, setFormData] = useState({
    fullName: '',
    aadharId: '',
    aadharProof: null,
    email: '',
    phone: '',
    address: '',
    password: '',
    annualIncome: '',
    panNumber: ''
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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

      // Step 2: Upload Aadhar Proof to Firebase Storage (if file exists)
      let aadharProofURL = null;
      if (formData.aadharProof) {
        const aadharProofRef = ref(storage, `aadharProofs/${user.uid}_${formData.aadharProof.name}`);
        await uploadBytes(aadharProofRef, formData.aadharProof);
        aadharProofURL = await getDownloadURL(aadharProofRef);
      }
      
      // Step 3: Save additional details in Firestore
      const buyerData = {
        fullName: formData.fullName,
        aadharId: formData.aadharId,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        annualIncome: formData.annualIncome,
        panNumber: formData.panNumber,
        aadharProofURL, // Will be null if no file was uploaded
        registrationDate: new Date().toISOString(),
        userId: user.uid
      };

      // Save to Firestore
      await setDoc(doc(db, "buyers", user.uid), buyerData);

      setSuccess(`Buyer registered successfully! Welcome, ${formData.fullName}`);
      setError(null);
      
      // Clear form after successful registration
      setFormData({
        fullName: '',
        aadharId: '',
        aadharProof: null,
        email: '',
        phone: '',
        address: '',
        password: '',
        annualIncome: '',
        panNumber: ''
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
    <div className="buyer-registration">
      <div className="registration-container">
        <h1>Buyer Registration</h1>
        {error && <div className="error-message">{error}</div>}
        {success && (
          <div className="success-message">
            <span role="img" aria-label="success">✅</span> {success}
          </div>
        )}
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
            <label>Aadhar Card Proof </label>
            <input
              type="file"
              name="aadharProof"
              onChange={handleFileChange}
              
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
              <label>Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="Enter your password"
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
    </div>
  );
}

export default BuyerRegistration;
