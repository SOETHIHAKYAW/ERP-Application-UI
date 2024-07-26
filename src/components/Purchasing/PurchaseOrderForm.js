// src/components/Purchasing/PurchaseOrderForm.js

import React, { useState, useEffect } from 'react';
import { addPurchaseOrder, updatePurchaseOrder } from '../../services/purchase/purchaseOrderApiService';
import { getPurchaseRequisitions } from '../../services/purchase/purchaseRequisitionApiService';
import Input from '../common/Input';
import Button from '../common/Button';
import Notification from '../common/Notification';

const PurchaseOrderForm = ({ selectedOrder, onFormSubmit }) => {
  const [formState, setFormState] = useState({
    requisitionId: '',
    orderDate: '',
    totalAmount: '',
    status: '',
  });
  const [purchaseRequisitions, setPurchaseRequisitions] = useState([]);

  useEffect(() => {
    const fetchPurchaseRequisitions = async () => {
      try {
        const data = await getPurchaseRequisitions();
        setPurchaseRequisitions(data);
      } catch (error) {
        console.error('Failed to fetch purchase requisitions:', error);
      }
    };

    fetchPurchaseRequisitions();
  }, []);

  useEffect(() => {
    if (selectedOrder) {
      setFormState({
        requisitionId: selectedOrder.requisition.id,
        orderDate: new Date(selectedOrder.orderDate).toISOString().substring(0, 10),
        totalAmount: selectedOrder.totalAmount,
        status: selectedOrder.status,
      });
    }
  }, [selectedOrder]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (selectedOrder) {
        await updatePurchaseOrder(selectedOrder.id, formState);
        Notification.show('Purchase order updated successfully!', 'success');
      } else {
        await addPurchaseOrder(formState);
        Notification.show('Purchase order added successfully!', 'success');
      }

      onFormSubmit();
      setFormState({
        requisitionId: '',
        orderDate: '',
        totalAmount: '',
        status: '',
      });
    } catch (error) {
      Notification.show('Failed to save purchase order.', 'error');
      console.error('Failed to save purchase order:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="form-group">
        <label htmlFor="requisitionId">Purchase Requisition</label>
        <select
          name="requisitionId"
          value={formState.requisitionId}
          onChange={handleChange}
          required
          className="form-control"
        >
          <option value="">Select Purchase Requisition</option>
          {purchaseRequisitions.map((requisition) => (
            <option key={requisition.id} value={requisition.id}>
              {requisition.id} - {requisition.status}
            </option>
          ))}
        </select>
      </div>
      <Input
        label="Order Date"
        type="date"
        name="orderDate"
        value={formState.orderDate}
        onChange={handleChange}
        required
      />
      <Input
        label="Total Amount"
        type="number"
        name="totalAmount"
        value={formState.totalAmount}
        onChange={handleChange}
        required
      />
      <Input
        label="Status"
        name="status"
        value={formState.status}
        onChange={handleChange}
        required
      />
      <Button type="submit" text={selectedOrder ? 'Update' : 'Add'} />
    </form>
  );
};

export default PurchaseOrderForm;
