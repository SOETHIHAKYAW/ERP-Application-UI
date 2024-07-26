import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';
import './SalesOrderForm.css'; // Import the CSS file for styling

const SalesOrderForm = () => {
    const [order, setOrder] = useState({
        customerName: '',
        orderDate: '',
        items: [],
        totalAmount: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const { id } = useParams();
    const history = useHistory();

    useEffect(() => {
        if (id) {
            axios.get(`/api/sales-orders/${id}`)
                .then(response => {
                    setOrder(response.data);
                    setIsEditing(true);
                })
                .catch(error => console.error('Error fetching order', error));
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setOrder(prevOrder => ({ ...prevOrder, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const request = isEditing
            ? axios.put(`/api/sales-orders/${id}`, order)
            : axios.post('/api/sales-orders', order);

        request
            .then(() => history.push('/sales-orders'))
            .catch(error => console.error('Error saving order', error));
    };

    return (
        <div className="sales-order-form">
            <h2>{isEditing ? 'Edit Sales Order' : 'Create Sales Order'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="customerName">Customer Name</label>
                    <input
                        type="text"
                        id="customerName"
                        name="customerName"
                        value={order.customerName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="orderDate">Order Date</label>
                    <input
                        type="date"
                        id="orderDate"
                        name="orderDate"
                        value={order.orderDate}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="items">Items (comma separated)</label>
                    <input
                        type="text"
                        id="items"
                        name="items"
                        value={order.items.join(', ')}
                        onChange={e => setOrder(prevOrder => ({ ...prevOrder, items: e.target.value.split(', ') }))}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="totalAmount">Total Amount</label>
                    <input
                        type="number"
                        id="totalAmount"
                        name="totalAmount"
                        value={order.totalAmount}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Save</button>
            </form>
        </div>
    );
};

export default SalesOrderForm;
