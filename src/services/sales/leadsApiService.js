import axios from 'axios';

const API_URL = 'http://localhost:8080/api/leads';

// Fetch all leads
export const getLeads = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching leads:', error);
        throw error;
    }
};

// Add a new lead
export const addLead = async (lead) => {
    try {
        const response = await axios.post(API_URL, lead);
        return response.data;
    } catch (error) {
        console.error('Error adding lead:', error);
        throw error;
    }
};

// Update an existing lead by ID
export const updateLead = async (id, lead) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, lead);
        return response.data;
    } catch (error) {
        console.error('Error updating lead:', error);
        throw error;
    }
};

// Delete a lead by ID
export const deleteLead = async (id) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error('Error deleting lead:', error);
        throw error;
    }
};
