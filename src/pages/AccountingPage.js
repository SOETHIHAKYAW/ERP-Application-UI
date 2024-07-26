import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import InvoiceList from '../components/Accounting/InvoiceList';
import PaymentList from '../components/Accounting/PaymentList';
import { Container, Tabs, Tab, Box } from '@mui/material';

const AccountingPage = () => {
  const [currentTab, setCurrentTab] = useState('invoice');

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleEdit = (item) => {
    // Logic to handle editing
  };

  return (
    <div>
      <Sidebar />
      <main className="main-content">
        <h1>Accounting</h1>
        <Container>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            aria-label="accounting-tabs"
            className="tabs-container"
          >
            <Tab label="Invoices" value="invoice" />
            <Tab label="Payments" value="payment" />
          </Tabs>
          <Box sx={{ mt: 2 }}>
            {currentTab === 'invoice' && <InvoiceList onEdit={handleEdit} />}
            {currentTab === 'payment' && <PaymentList onEdit={handleEdit} />}
          </Box>
        </Container>
      </main>
      <Footer className="footer" />
    </div>
  );
};

export default AccountingPage;
