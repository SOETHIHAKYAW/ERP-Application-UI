import React, { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import { Button, Input, Modal } from '../common';
import './InvoiceForm.css'; // Assuming you have a CSS file for styling

const InvoiceForm = ({ invoiceId, onClose, onSave }) => {
    const [invoice, setInvoice] = useState({});
    const { get, post, put } = useApi();

    useEffect(() => {
        if (invoiceId) {
            get(`/api/invoices/${invoiceId}`)
                .then(response => setInvoice(response.data))
                .catch(error => console.error('Error fetching invoice:', error));
        }
    }, [invoiceId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInvoice(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSave = () => {
        const request = invoiceId ? put : post;
        const url = invoiceId ? `/api/invoices/${invoiceId}` : '/api/invoices';

        request(url, invoice)
            .then(response => {
                onSave(response.data);
                onClose();
            })
            .catch(error => console.error('Error saving invoice:', error));
    };

    return (
        <Modal onClose={onClose}>
            <h2>{invoiceId ? 'Edit Invoice' : 'Create Invoice'}</h2>
            <Input
                label="Title"
                name="title"
                value={invoice.title || ''}
                onChange={handleChange}
            />
            <Input
                label="Amount"
                name="amount"
                value={invoice.amount || ''}
                onChange={handleChange}
            />
            <Button onClick={handleSave}>{invoiceId ? 'Update' : 'Save'}</Button>
        </Modal>
    );
};

export default InvoiceForm;
