import React from 'react';
import DashboardCard from './DashboardCard';
import Statistics from './Statistics';
import './Dashboard.css'; // Import the CSS file for styling

const Dashboard = () => {
    return (
        <div className="dashboard">
            <h2>Dashboard</h2>
            <div className="dashboard-cards">
                <DashboardCard title="Total Sales" value="$15,000" />
                <DashboardCard title="Total Purchases" value="$8,000" />
                <DashboardCard title="Total Invoices" value="120" />
                <DashboardCard title="Total Payments" value="$7,500" />
            </div>
            <Statistics />
        </div>
    );
};

export default Dashboard;
