import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import PurchaseRequisitionList from '../components/Purchasing/PurchaseRequisitionList';
import PurchaseOrderList from '../components/Purchasing/PurchaseOrderList';
import GoodsReceiptList from '../components/Purchasing/GoodsReceiptList';
import { Container, Tabs, Tab, Box } from '@mui/material';
import './PurchasingPage.css'; // Import the CSS file
import VendorList from '../components/Purchasing/VendorList';

const PurchasingPage = () => {
  const [currentTab, setCurrentTab] = useState('purchaseRequisition');

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <div>
      <Sidebar />
      <main className="main-content">
        <h1>Purchasing</h1>
        <Container>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            aria-label="purchase-tabs"
            className="tabs-container"
          >
            <Tab label="Purchase Requisition" value="purchaseRequisition" />
            <Tab label="Purchase Order" value="purchaseOrder" />
            <Tab label="Vendor" value="vendor" />
            <Tab label="Goods Receipt" value="goodsReceipt" />
          </Tabs>
          <Box sx={{ mt: 2 }}>
            {currentTab === 'purchaseRequisition' && <PurchaseRequisitionList />}
            {currentTab === 'purchaseOrder' && <PurchaseOrderList />}
            {currentTab === 'vendor' && <VendorList />}
            {currentTab === 'goodsReceipt' && <GoodsReceiptList />}
          </Box>
        </Container>
      </main>
      <Footer className="footer" />
    </div>
  );
};

export default PurchasingPage;
