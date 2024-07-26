import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/payments';

// Fetch all payments
export const getPayments = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching payments:', error);
    throw error;
  }
};

// Fetch a single payment by ID
export const getPaymentById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching payment with ID ${id}:`, error);
    throw error;
  }
};

// Add a new payment
export const addPayment = async (payment) => {
  try {
    const response = await axios.post(BASE_URL, payment);
    return response.data;
  } catch (error) {
    console.error('Error adding payment:', error);
    throw error;
  }
};

// Update an existing payment
export const updatePayment = async (payment) => {
  try {
    const response = await axios.put(`${BASE_URL}/${payment.id}`, payment);
    return response.data;
  } catch (error) {
    console.error(`Error updating payment with ID ${payment.id}:`, error);
    throw error;
  }
};

// Delete a payment by ID
export const deletePayment = async (id) => {
  try {
    await axios.delete(`${BASE_URL}/${id}`);
  } catch (error) {
    console.error(`Error deleting payment with ID ${id}:`, error);
    throw error;
  }
};