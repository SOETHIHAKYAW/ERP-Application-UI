import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';
import './SalesInvoiceForm.css'; // Import the CSS file for styling

const SalesInvoiceForm = () => {
    const [invoice, setInvoice] = useState({
        customerName: '',
        invoiceDate: '',
        amount: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const { id } = useParams();
    const history = useHistory();

    useEffect(() => {
        if (id) {
            setIsEditing(true);
            axios.get(`/api/sales-invoices/${id}`)
                .then(response => setInvoice(response.data))
                .catch(error => console.error('Error fetching invoice', error));
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInvoice(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const request = isEditing
            ? axios.put(`/api/sales-invoices/${id}`, invoice)
            : axios.post('/api/sales-invoices', invoice);

        request
            .then(() => history.push('/sales-invoices'))
            .catch(error => console.error('Error saving invoice', error));
    };

    return (
        <div className="sales-invoice-form">
            <h2>{isEditing ? 'Edit Sales Invoice' : 'Create Sales Invoice'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="customerName">Customer Name:</label>
                    <input
                        type="text"
                        id="customerName"
                        name="customerName"
                        value={invoice.customerName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="invoiceDate">Invoice Date:</label>
                    <input
                        type="date"
                        id="invoiceDate"
                        name="invoiceDate"
                        value={invoice.invoiceDate}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="amount">Amount:</label>
                    <input
                        type="number"
                        id="amount"
                        name="amount"
                        value={invoice.amount}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    {isEditing ? 'Update Invoice' : 'Create Invoice'}
                </button>
            </form>
        </div>
    );
};

export default SalesInvoiceForm;
