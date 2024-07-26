import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar'; // Import Sidebar component
import PurchasingPage from './pages/PurchasingPage';
import SalesPage from './pages/SalesPage';
import ManufacturingPage from './pages/ManufacturingPage';
import AccountingPage from './pages/AccountingPage';
import FixedAssetsPage from './pages/FixedAssetsPage';
import './assets/styles/global.css'; // Import your global styles
import './assets/styles/App.css'; // Import specific styles for App
import DashboardPage from './pages/DashboardPage';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Sidebar /> {/* Sidebar component */}
        <div className="main-content-container">
          <Header /> {/* Header component */}
          <div className="main-content">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/purchasing" element={<PurchasingPage />} />
              <Route path="/sales" element={<SalesPage />} />
              <Route path="/manufacturing" element={<ManufacturingPage />} />
              <Route path="/accounting" element={<AccountingPage />} />
              <Route path="/fixed-assets" element={<FixedAssetsPage />} />
            </Routes>
          </div>
          <Footer /> {/* Footer component */}
        </div>
      </div>
    </Router>
  );
};

export default App;
