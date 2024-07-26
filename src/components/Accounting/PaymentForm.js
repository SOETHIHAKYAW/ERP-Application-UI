import React, { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import { Button, Input, Modal } from '../common';
import './PaymentForm.css'; // Assuming you have a CSS file for styling

const PaymentForm = ({ paymentId, onClose, onSave }) => {
    const [payment, setPayment] = useState({});
    const { get, post, put } = useApi();

    useEffect(() => {
        if (paymentId) {
            get(`/api/payments/${paymentId}`)
                .then(response => setPayment(response.data))
                .catch(error => console.error('Error fetching payment:', error));
        }
    }, [paymentId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPayment(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSave = () => {
        const request = paymentId ? put : post;
        const url = paymentId ? `/api/payments/${paymentId}` : '/api/payments';

        request(url, payment)
            .then(response => {
                onSave(response.data);
                onClose();
            })
            .catch(error => console.error('Error saving payment:', error));
    };

    return (
        <Modal onClose={onClose}>
            <h2>{paymentId ? 'Edit Payment' : 'Create Payment'}</h2>
            <Input
                label="Title"
                name="title"
                value={payment.title || ''}
                onChange={handleChange}
            />
            <Input
                label="Amount"
                name="amount"
                value={payment.amount || ''}
                onChange={handleChange}
            />
            <Button onClick={handleSave}>{paymentId ? 'Update' : 'Save'}</Button>
        </Modal>
    );
};

export default PaymentForm;
