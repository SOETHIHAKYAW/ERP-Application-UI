import axios from 'axios';

// Base URL for Goods Receipt API
const BASE_URL = 'http://localhost:8080/api/goods-receipts';

export const getGoodsReceipts = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching goods receipts:', error);
    throw error;
  }
};

export const addGoodsReceipt = async (receipt) => {
  try {
    const response = await axios.post(BASE_URL, receipt);
    return response.data;
  } catch (error) {
    console.error('Error adding goods receipt:', error);
    throw error;
  }
};

export const updateGoodsReceipt = async (id, receipt) => {
  try {
    const response = await axios.put(`${BASE_URL}/${id}`, receipt);
    return response.data;
  } catch (error) {
    console.error('Error updating goods receipt:', error);
    throw error;
  }
};

export const deleteGoodsReceipt = async (id) => {
  try {
    await axios.delete(`${BASE_URL}/${id}`);
  } catch (error) {
    console.error('Error deleting goods receipt:', error);
    throw error;
  }
};
