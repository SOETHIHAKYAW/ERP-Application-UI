import React from 'react';
import './Statistics.css'; // Import the CSS file for styling

const Statistics = () => {
    // Example data; replace with real data or chart components
    const data = {
        totalSales: 15000,
        totalPurchases: 8000,
        totalInvoices: 120,
        totalPayments: 7500
    };

    return (
        <div className="statistics">
            <h3>Statistics</h3>
            <div className="stats-card">
                <h4>Total Sales</h4>
                <p>${data.totalSales}</p>
            </div>
            <div className="stats-card">
                <h4>Total Purchases</h4>
                <p>${data.totalPurchases}</p>
            </div>
            <div className="stats-card">
                <h4>Total Invoices</h4>
                <p>{data.totalInvoices}</p>
            </div>
            <div className="stats-card">
                <h4>Total Payments</h4>
                <p>${data.totalPayments}</p>
            </div>
        </div>
    );
};

export default Statistics;
