import axios from 'axios';

const API_URL = 'http://localhost:8080/api/opportunities';

export const getOpportunities = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const createOpportunity = async (opportunity) => {
    const response = await axios.post(API_URL, opportunity);
    return response.data;
};

export const updateOpportunity = async (id, opportunity) => {
    const response = await axios.put(`${API_URL}/${id}`, opportunity);
    return response.data;
};

export const deleteOpportunity = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};
