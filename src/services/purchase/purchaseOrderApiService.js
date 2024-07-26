import axios from 'axios';

// Base URL for Purchase Order API
const BASE_URL = 'http://localhost:8080/api/purchase-orders';

export const getPurchaseOrders = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data; // Return the response data
  } catch (error) {
    console.error('Error fetching purchase orders:', error);
    throw error;
  }
};

export const addPurchaseOrder = async (orderData) => {
    try {
        const response = await axios.post(BASE_URL, orderData);
        console.log("Create Purchase Order",response)
        return response.data;
    } catch (error) {
        throw new Error('Failed to add purchase order');
    }
};


export const updatePurchaseOrder = async (id, order) => {
  try {
    const response = await axios.put(`${BASE_URL}/${id}`, order);
    return response.data; // Return the updated data
  } catch (error) {
    console.error('Error updating purchase order:', error);
    throw error; // Throw error to be handled by the caller
  }
};

export const deletePurchaseOrder = async (id) => {
  try {
    await axios.delete(`${BASE_URL}/${id}`);
  } catch (error) {
    console.error('Error deleting purchase order:', error);
    throw error;
  }
};
