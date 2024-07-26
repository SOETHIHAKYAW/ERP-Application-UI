import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import WorkOrderList from '../components/Manufacturing/WorkOrderList';
import { Container, Tabs, Tab, Box } from '@mui/material';
// import './ManufacturingPage.css'; // Import the CSS file

const ManufacturingPage = () => {
  const [currentTab, setCurrentTab] = useState('workOrder');

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <div>
      <Sidebar />
      <main className="main-content">
        <h1>Manufacturing</h1>
        <Container>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            aria-label="manufacturing-tabs"
            className="tabs-container"
          >
            <Tab label="Work Orders" value="workOrder" />
            {/* Add more tabs if needed */}
          </Tabs>
          <Box sx={{ mt: 2 }}>
            {currentTab === 'workOrder' && <WorkOrderList />}
            {/* Add more components based on the selected tab */}
          </Box>
        </Container>
      </main>
      <Footer className="footer" />
    </div>
  );
};

export default ManufacturingPage;
