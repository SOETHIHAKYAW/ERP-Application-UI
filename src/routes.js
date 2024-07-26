import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import PurchasingPage from './pages/PurchasingPage';
import SalesPage from './pages/SalesPage';
import ManufacturingPage from './pages/ManufacturingPage';
import AccountingPage from './pages/AccountingPage';
import FixedAssetsPage from './pages/FixedAssetsPage';

const LayoutWithSidebar = () => (
  <div className="layout-with-sidebar">
    <Sidebar />
    <div className="main-content">
      <Outlet />
      <Footer />
    </div>
  </div>
);

const LayoutWithoutSidebar = () => (
  <div className="layout-without-sidebar">
    {/* <Header /> */}
    <div className="main-content">
      <Outlet />
    </div>
    <Footer />
  </div>
);

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LayoutWithoutSidebar />} >
        <Route index element={<HomePage />} />
      </Route>
      <Route path="/purchasing/*" element={<LayoutWithSidebar />} >
        <Route path="*" element={<PurchasingPage />} />
      </Route>
      <Route path="/sales/*" element={<LayoutWithSidebar />} >
        <Route path="*" element={<SalesPage />} />
      </Route>
      <Route path="/manufacturing/*" element={<LayoutWithSidebar />} >
        <Route path="*" element={<ManufacturingPage />} />
      </Route>
      <Route path="/accounting/*" element={<LayoutWithSidebar />} >
        <Route path="*" element={<AccountingPage />} />
      </Route>
      <Route path="/fixed-assets/*" element={<LayoutWithSidebar />} >
        <Route path="*" element={<FixedAssetsPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
