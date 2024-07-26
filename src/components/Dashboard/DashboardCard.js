import React from 'react';
import './DashboardCard.css'; // Import the CSS file for styling

const DashboardCard = ({ title, value }) => {
    return (
        <div className="dashboard-card">
            <h3>{title}</h3>
            <p>{value}</p>
        </div>
    );
};

export default DashboardCard;
