import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { addLead, updateLead } from '../../services/sales/leadsApiService';

const LeadForm = ({ open, onClose, onSave, lead }) => {
    const [name, setName] = useState('');
    const [contactInfo, setContactInfo] = useState('');
    const [createdDate, setCreatedDate] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        if (lead) {
            setName(lead.name);
            setContactInfo(lead.contactInfo);
            setCreatedDate(new Date(lead.createdDate).toISOString().split('T')[0]);
            setStatus(lead.status);
        } else {
            setName('');
            setContactInfo('');
            setCreatedDate('');
            setStatus('');
        }
    }, [lead]);

    const handleSave = async () => {
        try {
            if (lead) {
                await updateLead(lead.id, { name, contactInfo, createdDate, status });
            } else {
                await addLead({ name, contactInfo, createdDate, status });
            }
            onSave();
        } catch (error) {
            console.error('Failed to save lead:', error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{lead ? 'Edit Lead' : 'Add New Lead'}</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Name"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Contact Info"
                    fullWidth
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Created Date"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={createdDate}
                    onChange={(e) => setCreatedDate(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Status"
                    fullWidth
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">Cancel</Button>
                <Button onClick={handleSave} color="primary">Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default LeadForm;
