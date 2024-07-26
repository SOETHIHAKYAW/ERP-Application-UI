import React from 'react';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';

const PurchaseRequisitionForm = ({
  formData,
  onChange,
  onSave,
  onClose,
  isEditing,
}) => {
  return (
    <>
      <DialogContent>
        <TextField
          margin="dense"
          label="Requisition Date"
          type="date"
          fullWidth
          name="requisitionDate"
          value={formData.requisitionDate}
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
        <Button onClick={onSave} color="primary">
          {isEditing ? 'Save' : 'Add'}
        </Button>
      </DialogActions>
    </>
  );
};

export default PurchaseRequisitionForm;
