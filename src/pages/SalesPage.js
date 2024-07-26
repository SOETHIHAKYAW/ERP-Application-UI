import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import LeadList from '../components/Sales/LeadList';
import OpportunityList from '../components/Sales/OpportunityList';
import { Container, Tabs, Tab, Box } from '@mui/material';

const SalesPage = () => {
  const [currentTab, setCurrentTab] = useState('lead');

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <div>
      <Sidebar />
      <main>
        <h1>Sales</h1>
        <Container>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            aria-label="sales-tabs"
          >
            <Tab label="Leads" value="lead" />
            <Tab label="Opportunities" value="opportunity" />
            {/* <Tab label="Quotations" value="quotation" /> }
            { <Tab label="Sales Orders" value="salesOrder" />
            <Tab label="Sales Invoices" value="salesInvoice" /> */}
          </Tabs>
          <Box sx={{ mt: 2 }}>
            {currentTab === 'lead' && <LeadList />}
            {currentTab === 'opportunity' && <OpportunityList />}
            {/* {currentTab === 'quotation' && <QuotationList />} }
            { {currentTab === 'salesOrder' && <SalesOrderList />}
            {currentTab === 'salesInvoice' && <SalesInvoiceList />} */}
          </Box>
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default SalesPage;
