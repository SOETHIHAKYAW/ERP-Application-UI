import axios from 'axios';

const API_URL = 'http://localhost:8080/api/fixed-assets';

export const getFixedAssets = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching fixed assets:', error);
    throw error;
  }
};

export const addFixedAsset = async (asset) => {
  try {
    const response = await axios.post(API_URL, asset);
    return response.data;
  } catch (error) {
    console.error('Error adding fixed asset:', error);
    throw error;
  }
};

export const updateFixedAsset = async (asset) => {
  try {
    const response = await axios.put(`${API_URL}/${asset.id}`, asset);
    return response.data;
  } catch (error) {
    console.error('Error updating fixed asset:', error);
    throw error;
  }
};

export const deleteFixedAsset = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error('Error deleting fixed asset:', error);
    throw error;
  }
};
