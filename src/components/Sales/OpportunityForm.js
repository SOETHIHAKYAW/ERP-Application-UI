import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { getLeads } from '../../services/sales/leadsApiService'; // Import getLeads
import { createOpportunity } from '../../services/sales/opportunityApiService'; // Import createOpportunity

const OpportunityForm = ({ open, onClose, onSave, opportunity }) => {
    const [formData, setFormData] = useState({
        id: '',
        leadId: '',
        description: '',
        estimatedValue: '',
        expectedCloseDate: '',
        status: ''
    });

    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const data = await getLeads();
                setLeads(data);
            } catch (error) {
                console.error('Failed to load leads:', error);
            }
        };

        fetchLeads();
    }, []);

    useEffect(() => {
        if (opportunity) {
            setFormData({
                id: opportunity.id || '',
                leadId: opportunity.lead?.id || '', // Use lead ID for saving
                description: opportunity.description || '',
                estimatedValue: opportunity.estimatedValue || '',
                expectedCloseDate: opportunity.expectedCloseDate ? new Date(opportunity.expectedCloseDate).toISOString().substr(0, 10) : '',
                status: opportunity.status || '' // Ensure status is handled
            });
        } else {
            setFormData({
                id: '',
                leadId: '', // Default to empty
                description: '',
                estimatedValue: '',
                expectedCloseDate: '',
                status: '' // Default to empty
            });
        }
    }, [opportunity]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await createOpportunity(formData);
            onSave();
            onClose();
        } catch (error) {
            console.error('Error saving opportunity:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{opportunity ? 'Edit Opportunity' : 'Create New Opportunity'}</DialogTitle>
            <DialogContent>
                <TextField
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Estimated Value"
                    name="estimatedValue"
                    type="number"
                    value={formData.estimatedValue}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Expected Close Date"
                    name="expectedCloseDate"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={formData.expectedCloseDate}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Lead"
                    name="leadId"
                    select
                    value={formData.leadId}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                >
                    {leads.map(lead => (
                        <MenuItem key={lead.id} value={lead.id}>
                            {lead.name} {/* Display lead name */}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    label="Status"
                    name="status"
                    select
                    value={formData.status}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                >
                    {/* Add status options */}
                    <MenuItem value="New">New</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Closed">Closed</MenuItem>
                </TextField>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">Cancel</Button>
                <Button onClick={handleSubmit} color="primary" disabled={loading}>
                    {loading ? 'Saving...' : 'Save'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default OpportunityForm;
