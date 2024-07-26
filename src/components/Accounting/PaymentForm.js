import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Button,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { getInvoices } from '../../services/accounting/invoiceApiService';

const PaymentForm = ({ open, onClose, onSave, initialData }) => {
  const { control, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      invoice: '',
      paymentDate: '',
      amount: '',
      method: '',
      status: '',
    },
  });

  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    // Fetch invoices for the dropdown
    const fetchInvoices = async () => {
      try {
        const data = await getInvoices(); // Adjust API call as needed
        setInvoices(data);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      }
    };

    fetchInvoices();
  }, []);

  useEffect(() => {
    if (initialData) {
      // Populate form fields with initial data if provided
      setValue('invoice', initialData.invoice?.id || '');
      setValue('paymentDate', initialData.paymentDate || '');
      setValue('amount', initialData.amount || '');
      setValue('method', initialData.method || '');
      setValue('status', initialData.status || '');
    } else {
      reset(); // Clear form if no initial data
    }
  }, [initialData, reset, setValue]);

  const onSubmit = (data) => {
    onSave({
      ...data,
      paymentDate: new Date(data.paymentDate), // Ensure paymentDate is a Date object
      invoice: { id: data.invoice }, // Assuming invoice is an object with an id property
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialData ? 'Edit Payment' : 'Add Payment'}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="invoice"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Invoice"
                variant="outlined"
                fullWidth
                margin="normal"
              >
                {invoices.map((invoice) => (
                  <MenuItem key={invoice.id} value={invoice.id}>
                    {invoice.id} {/* Adjust display value as needed */}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Controller
            name="paymentDate"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="date"
                label="Payment Date"
                variant="outlined"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label="Amount"
                variant="outlined"
                fullWidth
                margin="normal"
              />
            )}
          />
          <Controller
            name="method"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Payment Method"
                variant="outlined"
                fullWidth
                margin="normal"
              />
            )}
          />
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Status"
                variant="outlined"
                fullWidth
                margin="normal"
              />
            )}
          />
          <DialogActions>
            <Button onClick={onClose} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              {initialData ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentForm;
