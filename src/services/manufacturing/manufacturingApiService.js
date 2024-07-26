// src/services/manufacturing/manufacturingApiService.js

import axios from 'axios';

const API_URL = 'http://localhost:8080/api/work-orders';

// Fetch all work orders
export const getWorkOrders = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Add a new work order
export const createWorkOrder = async (workOrder) => {
  const response = await axios.post(API_URL, workOrder);
  return response.data;
};

// Update an existing work order
export const updateWorkOrder = async (id, workOrder) => {
  const response = await axios.put(`${API_URL}/${id}`, workOrder);
  return response.data;
};

// Delete a work order
export const deleteWorkOrder = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};
