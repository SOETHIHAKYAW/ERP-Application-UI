import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { addVendor, updateVendor } from '../../services/purchase/vendorApiService';

const VendorForm = ({ open, onClose, onSave, vendor }) => {
    const [formData, setFormData] = useState({
        name: '',
        contactInfo: '',
        registrationDate: ''
    });

    useEffect(() => {
        if (vendor) {
            setFormData({
                name: vendor.name || '',
                contactInfo: vendor.contactInfo || '',
                registrationDate: vendor.registrationDate ? new Date(vendor.registrationDate).toISOString().split('T')[0] : ''
            });
        } else {
            setFormData({
                name: '',
                contactInfo: '',
                registrationDate: ''
            });
        }
    }, [vendor]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            if (vendor) {
                // Update existing vendor
                await updateVendor(vendor.id, formData);
            } else {
                // Add new vendor
                await addVendor(formData);
            }
            onSave();
        } catch (error) {
            console.error('Failed to save vendor:', error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{vendor ? 'Edit Vendor' : 'Add Vendor'}</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Name"
                    type="text"
                    fullWidth
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    label="Contact Info"
                    type="text"
                    fullWidth
                    name="contactInfo"
                    value={formData.contactInfo}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    label="Registration Date"
                    type="date"
                    fullWidth
                    name="registrationDate"
                    value={formData.registrationDate}
                    onChange={handleChange}
                    InputLabelProps={{
                        shrink: true
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">Cancel</Button>
                <Button onClick={handleSave} color="primary">Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default VendorForm;
