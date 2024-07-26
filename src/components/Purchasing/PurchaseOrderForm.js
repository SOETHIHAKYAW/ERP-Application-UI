import React from 'react';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import MenuItem from '@mui/material/MenuItem';

const PurchaseOrderForm = ({
  formData,
  onChange,
  onSave,
  onClose,
  isEditing,
  requisitions
}) => {
  return (
    <>
      <DialogContent>
        <TextField
          margin="dense"
          label="Order Date"
          type="date"
          fullWidth
          name="orderDate"
          value={formData.orderDate}
          onChange={onChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          margin="dense"
          label="Total Amount"
          type="number"
          fullWidth
          name="totalAmount"
          value={formData.totalAmount}
          onChange={onChange}
        />
        <TextField
          margin="dense"
          label="Status"
          type="text"
          fullWidth
          select
          name="status"
          value={formData.status}
          onChange={onChange}
        >
          <MenuItem value="Draft">Draft</MenuItem>
          <MenuItem value="In Progress">In Progress</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
          <MenuItem value="Cancelled">Cancelled</MenuItem>
        </TextField>
        <TextField
          margin="dense"
          label="Requisition"
          name="requisitionId"
          fullWidth
          select
          value={formData.requisitionId}
          onChange={onChange}
        >
          {requisitions.map(requisition => (
            <MenuItem key={requisition.id} value={requisition.id}>
              {requisition.id}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onSave} color="primary">
          {isEditing ? 'Save' : 'Add'}
        </Button>
      </DialogActions>
    </>
  );
};

export default PurchaseOrderForm;
