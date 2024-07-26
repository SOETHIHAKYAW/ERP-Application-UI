import React from 'react';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const DashboardPage = () => {
    return (
        <div>
            <Sidebar />
            <main>
                <h1>Welcome to the ERP System</h1>
                {/* Add content for the Dashboard */}
            </main>
            <Footer />
        </div>
    );
};

export default DashboardPage;
