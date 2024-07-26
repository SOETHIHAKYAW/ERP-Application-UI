import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { addGoodsReceipt, updateGoodsReceipt } from '../../services/purchase/goodsReceiptApiService';

const GoodsReceiptForm = ({ open, onClose, onSave, receipt }) => {
    const [orderId, setOrderId] = useState('');
    const [receiptDate, setReceiptDate] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        if (receipt) {
            setOrderId(receipt.order?.id || '');
            setReceiptDate(receipt.receiptDate || '');
            setStatus(receipt.status || '');
        } else {
            setOrderId('');
            setReceiptDate('');
            setStatus('');
        }
    }, [receipt]);

    const handleSave = async () => {
        const receiptData = {
            order: { id: orderId },
            receiptDate,
            status
        };

        try {
            if (receipt && receipt.id) {
                await updateGoodsReceipt(receipt.id, receiptData);
            } else {
                await addGoodsReceipt(receiptData);
            }
            onSave();
        } catch (error) {
            console.error('Error saving goods receipt:', error);
            alert('Error saving goods receipt. Please try again.');
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{receipt ? 'Edit Goods Receipt' : 'Add Goods Receipt'}</DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    label="Order ID"
                    type="number"
                    fullWidth
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Receipt Date"
                    type="date"
                    fullWidth
                    value={receiptDate}
                    onChange={(e) => setReceiptDate(e.target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    margin="dense"
                    label="Status"
                    type="text"
                    fullWidth
                    select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <MenuItem value="Received">Received</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Rejected">Rejected</MenuItem>
                </TextField>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleSave} color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default GoodsReceiptForm;
