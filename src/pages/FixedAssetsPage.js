import React, { useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import FixedAssetList from '../components/FixedAssets/FixedAssetList';

const FixedAssetsPage = () => {
  useEffect(() => {
    const button = document.querySelector('.MuiButton-root.MuiButton-contained.MuiButton-containedPrimary');
    if (button) {
      button.remove();
    }
  }, []);

  return (
    <div>
      <Sidebar />
      <main>
        <h1>Fixed Assets</h1>
        <FixedAssetList onEdit={(asset) => {/* Handle form open for editing */}} />
      </main>
      <Footer />
    </div>
  );
};

export default FixedAssetsPage;
