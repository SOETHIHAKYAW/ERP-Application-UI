import axios from 'axios';

const API_URL = 'http://localhost:8080/api/vendors';

export const getVendors = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const addVendor = async (vendor) => {
    const response = await axios.post(API_URL, vendor);
    return response.data;
};

export const updateVendor = async (id, vendor) => {
    const response = await axios.put(`${API_URL}/${id}`, vendor);
    return response.data;
};

export const deleteVendor = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};
