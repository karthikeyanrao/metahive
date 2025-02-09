import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import PropertyList from './PropertyList';
import PropertyDetails from './PropertyDetails';
import AddProperty from './AddProperty';
import {Web3Provider} from "./context/Web3Context";
import BuilderRegistration from './BuilderRegistration';
import BuyerRegistration from './BuyerRegistration';

function App() {
  return (
    <Web3Provider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<PropertyList />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/add-property" element={<AddProperty />} />
            <Route path="/register/builder" element={<BuilderRegistration />} />
            <Route path="/register/buyer" element={<BuyerRegistration />} />
          </Routes>
        </div>
      </Router>
    </Web3Provider>
  );
}

export default App;
