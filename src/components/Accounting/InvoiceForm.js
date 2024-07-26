import React, { useState, useEffect } from 'react';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import AlertDialog from '../common/AlertDialog'; // Ensure this is correctly imported or adjust the path as needed
import { createInvoice, updateInvoice } from '../../services/accounting/invoiceApiService'; // Adjust import as needed

const InvoiceForm = ({ open, onClose, currentInvoice, onSave }) => {
  const [invoice, setInvoice] = useState({
    invoiceDate: '',
    amount: '',
    status: '',
  });

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    if (currentInvoice) {
      setInvoice({
        invoiceDate: currentInvoice.invoiceDate ? currentInvoice.invoiceDate.split('T')[0] : '', // Convert to date string format
        amount: currentInvoice.amount || '',
        status: currentInvoice.status || '',
      });
    } else {
      setInvoice({
        invoiceDate: '',
        amount: '',
        status: '',
      });
    }
  }, [currentInvoice]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoice((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (currentInvoice) {
        // Update existing invoice
        await updateInvoice({
          id: currentInvoice.id, // Ensure ID is included
          ...invoice,
        });
      } else {
        // Create new invoice
        await createInvoice(invoice);
      }
      onSave(); // Refresh the invoice list
      onClose(); // Close the dialog
    } catch (error) {
      console.error('Error saving invoice:', error);
      setAlertMessage('An error occurred while saving the invoice.');
      setAlertOpen(true);
    }
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{currentInvoice ? 'Edit Invoice' : 'Create Invoice'}</DialogTitle>
      <DialogContent>
        <TextField
          label="Invoice Date"
          type="date"
          name="invoiceDate"
          value={invoice.invoiceDate}
          onChange={handleChange}
          fullWidth
          margin="dense"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Amount"
          type="number"
          name="amount"
          value={invoice.amount}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
        <TextField
          label="Status"
          name="status"
          value={invoice.status}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>{currentInvoice ? 'Update' : 'Create'}</Button>
      </DialogActions>
      <AlertDialog
        open={alertOpen}
        onClose={handleAlertClose}
        message={alertMessage}
      />
    </Dialog>
  );
};

export default InvoiceForm;
