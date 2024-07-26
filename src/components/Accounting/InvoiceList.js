import React, { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import { Table, Button } from '../common';
import InvoiceForm from './InvoiceForm';
import './InvoiceList.css'; // Assuming you have a CSS file for styling

const InvoiceList = () => {
    const [invoices, setInvoices] = useState([]);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const { get, delete: del } = useApi();

    useEffect(() => {
        get('/api/invoices')
            .then(response => setInvoices(response.data))
            .catch(error => console.error('Error fetching invoices:', error));
    }, []);

    const handleDelete = (id) => {
        del(`/api/invoices/${id}`)
            .then(() => setInvoices(prev => prev.filter(invoice => invoice.id !== id)))
            .catch(error => console.error('Error deleting invoice:', error));
    };

    return (
        <div>
            <Button onClick={() => setSelectedInvoice({})}>Add New Invoice</Button>
            <Table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Amount</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {invoices.map(invoice => (
                        <tr key={invoice.id}>
                            <td>{invoice.id}</td>
                            <td>{invoice.title}</td>
                            <td>{invoice.amount}</td>
                            <td>
                                <Button onClick={() => setSelectedInvoice(invoice)}>Edit</Button>
                                <Button onClick={() => handleDelete(invoice.id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {selectedInvoice && (
                <InvoiceForm
                    invoiceId={selectedInvoice.id}
                    onClose={() => setSelectedInvoice(null)}
                    onSave={(updatedInvoice) => {
                        setInvoices(prev => prev.map(invoice =>
                            invoice.id === updatedInvoice.id ? updatedInvoice : invoice
                        ));
                        setSelectedInvoice(null);
                    }}
                />
            )}
        </div>
    );
};

export default InvoiceList;
