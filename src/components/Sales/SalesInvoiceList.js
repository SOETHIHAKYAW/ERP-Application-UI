import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './SalesInvoiceList.css'; // Import the CSS file for styling

const SalesInvoiceList = () => {
    const [invoices, setInvoices] = useState([]);

    useEffect(() => {
        axios.get('/api/sales-invoices')
            .then(response => setInvoices(response.data))
            .catch(error => console.error('Error fetching invoices', error));
    }, []);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this invoice?')) {
            axios.delete(`/api/sales-invoices/${id}`)
                .then(() => setInvoices(invoices.filter(invoice => invoice.id !== id)))
                .catch(error => console.error('Error deleting invoice', error));
        }
    };

    return (
        <div className="sales-invoice-list">
            <h2>Sales Invoices</h2>
            <Link to="/sales-invoices/new" className="btn btn-primary">Create New Invoice</Link>
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Customer Name</th>
                        <th>Invoice Date</th>
                        <th>Amount</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {invoices.map(invoice => (
                        <tr key={invoice.id}>
                            <td>{invoice.id}</td>
                            <td>{invoice.customerName}</td>
                            <td>{invoice.invoiceDate}</td>
                            <td>{invoice.amount}</td>
                            <td>
                                <Link to={`/sales-invoices/${invoice.id}`} className="btn btn-secondary">Edit</Link>
                                <button
                                    onClick={() => handleDelete(invoice.id)}
                                    className="btn btn-danger"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SalesInvoiceList;
