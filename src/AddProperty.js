import React, { useState } from 'react';
import './AddProperty.css';
import ThreeBackground from './ThreeBackground';
import { db } from './context/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './context/firebase';


function AddProperty() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    description: ''
  });
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };
  const handleUpload = () => {
    if (selectedFiles.length === 0) {
      alert("Please select files first!");
      return;
    }
    console.log("Uploading files:", selectedFiles);
    // Implement upload logic here
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const fileURLs = [];
      console.log('Starting property submission...');
      for (const file of selectedFiles) {
        const fileRef = ref(storage, `property-docs/${file.name}`);
        await uploadBytes(fileRef, file);
        const fileURL = await getDownloadURL(fileRef);
        fileURLs.push(fileURL);
      }
       // 🔹 Fetch latitude and longitude using OpenStreetMap API
       const locationQuery = encodeURIComponent(formData.location);
       const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${locationQuery}&limit=1`);
       const data = await response.json();
   
       if (data.length === 0) {
         alert("Location not found. Please enter a valid address.");
         setIsLoading(false);
         return;
       }
   
       // Define lat & lng before using them
       const lat = parseFloat(data[0].lat);
       const lng = parseFloat(data[0].lon);
   
       console.log(`Fetched Coordinates: ${lat}, ${lng}`);
   
 
       // 🔹 Prepare property data with lat/lng
      const propertyData = {
        title: formData.title,
        price: Number(formData.price),
        location: formData.location,
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        area: Number(formData.area),
        description: formData.description,
        lat: lat, // ✅ Ensure lat is defined
        lng: lng, // ✅ Ensure lng is defined
        createdAt: new Date().toISOString(),
        documentUrl: fileURLs,
      };
  


      // Add to Firestore
      console.log('Saving to database...', propertyData);
      const docRef = await addDoc(collection(db, 'properties'), propertyData);
      
      console.log('Property added successfully with ID: ', docRef.id);
      alert('Property listed successfully! Redirecting to properties page...');
      
      // Clear form
      setFormData({
        title: '',
        price: '',
        location: '',
        bedrooms: '',
        bathrooms: '',
        area: '',
        description: ''
      });
      
      // Redirect to properties page
      setTimeout(() => {
        navigate('/properties');
      }, 500);

    } catch (error) {
      console.error('Error details:', error);
      alert('Error adding property: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ThreeBackground />
      <div className="add-property">
        {/* Back Button */}
        <button className="back-button" onClick={() => window.history.back()}>
           Back
        </button>
        <h2>List Your Property</h2>
        <form onSubmit={handleSubmit} className="property-form">
          <div className="form-group">
            <label htmlFor="title">Property Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter property title"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price ($)</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter price"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter location"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="area">Area (sq ft)</label>
              <input
                type="number"
                id="area"
                name="area"
                value={formData.area}
                onChange={handleChange}
                placeholder="Enter area"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="bedrooms">Bedrooms</label>
              <input
                type="number"
                id="bedrooms"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                placeholder="No. of bedrooms"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="bathrooms">Bathrooms</label>
              <input
                type="number"
                id="bathrooms"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                placeholder="No. of bathrooms"
                required
              />
            </div>
          </div>
          <div className="form-row">
  <div className="form-group">
    <label htmlFor="documents">Upload Documents</label>
    <input
      type="file"
      id="documents"
      name="documents"
      multiple
      onChange={handleFileChange}
      accept=".pdf,.doc,.docx,.jpg,.png"
      
    />
    <small>Supported formats: PDF, DOC, DOCX, JPG, PNG</small>
    <button 
      className="upload-button" 
      onClick={handleUpload} 
      disabled={selectedFiles.length === 0}
    >
      Upload
    </button >
  </div>

</div>


          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter property description"
              required
            />
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? (
              
                <span> </span>
                    
            
            ) : (
              'Add Property'
            )}
          </button>
        </form>
      </div>
    </>
  );
}

export default AddProperty; 