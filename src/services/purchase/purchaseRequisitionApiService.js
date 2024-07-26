import axios from 'axios';

// Base URL for Purchase Requisition API
const API_URL = 'http://localhost:8080/api/purchase-requisitions';

export const getPurchaseRequisitions = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const addPurchaseRequisition = async (requisition) => {
  const response = await axios.post(API_URL, requisition);
  return response.data;
};

export const updatePurchaseRequisition = async (id, requisition) => {
  const response = await axios.put(`${API_URL}/${id}`, requisition);
  return response.data;
};

export const deletePurchaseRequisition = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};
