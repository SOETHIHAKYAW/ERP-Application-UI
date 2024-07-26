import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Grid, InputAdornment } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { getOpportunities } from '../../services/sales/opportunityApiService'; // Assuming you have this service

const QuotationForm = ({ quotation, onSave, onCancel }) => {
  const { control, handleSubmit, setValue, getValues } = useForm({
    defaultValues: {
      id: quotation ? quotation.id : '',
      opportunity: quotation ? quotation.opportunity : '',
      quotationDate: quotation ? new Date(quotation.quotationDate).toISOString().split('T')[0] : '',
      totalAmount: quotation ? quotation.totalAmount : '',
      status: quotation ? quotation.status : ''
    }
  });

  const [opportunities, setOpportunities] = useState([]);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const data = await getOpportunities();
        setOpportunities(data);
      } catch (error) {
        console.error('Failed to fetch opportunities:', error);
      }
    };

    fetchOpportunities();
  }, []);

  const onSubmit = async (data) => {
    try {
      await onSave(data);
    } catch (error) {
      console.error('Failed to save quotation:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Controller
            name="opportunity"
            control={control}
            render={({ field }) => (
              <TextField
                select
                label="Opportunity"
                fullWidth
                variant="outlined"
                {...field}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <span className="material-icons">arrow_drop_down</span>
                    </InputAdornment>
                  ),
                }}
              >
                {opportunities.map(opportunity => (
                  <MenuItem key={opportunity.id} value={opportunity.id}>
                    {opportunity.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="quotationDate"
            control={control}
            render={({ field }) => (
              <TextField
                type="date"
                label="Quotation Date"
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                {...field}
                required
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="totalAmount"
            control={control}
            render={({ field }) => (
              <TextField
                type="number"
                label="Total Amount"
                fullWidth
                variant="outlined"
                {...field}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <TextField
                select
                label="Status"
                fullWidth
                variant="outlined"
                {...field}
                required
              >
                <MenuItem value="Draft">Draft</MenuItem>
                <MenuItem value="Approved">Approved</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
              </TextField>
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Save
          </Button>
          <Button type="button" variant="outlined" color="secondary" onClick={onCancel} style={{ marginLeft: '10px' }}>
            Cancel
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default QuotationForm;
