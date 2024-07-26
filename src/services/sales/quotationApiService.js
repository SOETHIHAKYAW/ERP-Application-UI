import axios from 'axios';

const API_URL = 'http://localhost:8080/api/quotations';

// Fetch all quotations
export const getQuotations = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching quotations: ' + error.message);
    }
};

// Fetch a single quotation by ID
export const getQuotationById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching quotation by ID: ' + error.message);
    }
};

// Add a new quotation
export const createQuotation = async (quotation) => {
    try {
        const response = await axios.post(API_URL, quotation);
        return response.data;
    } catch (error) {
        throw new Error('Error adding quotation: ' + error.message);
    }
};

// Update an existing quotation
export const updateQuotation = async (id, quotation) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, quotation);
        return response.data;
    } catch (error) {
        throw new Error('Error updating quotation: ' + error.message);
    }
};

// Delete a quotation by ID
export const deleteQuotation = async (id) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
        throw new Error('Error deleting quotation: ' + error.message);
    }
};
