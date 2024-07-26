// src/components/Sales/SalesOrderList.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './SalesOrderList.css'; // Import the CSS file for styling

const SalesOrderList = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        axios.get('/api/sales-orders')
            .then(response => setOrders(response.data))
            .catch(error => console.error('Error fetching orders', error));
    }, []);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            axios.delete(`/api/sales-orders/${id}`)
                .then(() => setOrders(orders.filter(order => order.id !== id)))
                .catch(error => console.error('Error deleting order', error));
        }
    };

    return (
        <div className="sales-order-list">
            <h2>Sales Orders</h2>
            <Link to="/sales-orders/create" className="btn btn-primary">Create New Order</Link>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Customer Name</th>
                        <th>Order Date</th>
                        <th>Total Amount</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.customerName}</td>
                            <td>{order.orderDate}</td>
                            <td>{order.totalAmount}</td>
                            <td>
                                <Link to={`/sales-orders/${order.id}`}>View</Link>
                                <Link to={`/sales-orders/edit/${order.id}`}>Edit</Link>
                                <button onClick={() => handleDelete(order.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SalesOrderList;
