import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';

const WorkOrderForm = ({ workOrder, onSave, onCancel }) => {
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (workOrder) {
      setDescription(workOrder.description || '');
      setStartDate(workOrder.startDate ? formatDate(new Date(workOrder.startDate)) : '');
      setEndDate(workOrder.endDate ? formatDate(new Date(workOrder.endDate)) : '');
      setEstimatedCost(workOrder.estimatedCost || '');
      setStatus(workOrder.status || '');
    }
  }, [workOrder]);

  const formatDate = (date) => {
    // Format date as yyyy-MM-dd
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSave = () => {
    const formattedStartDate = startDate ? new Date(startDate).toISOString() : null;
    const formattedEndDate = endDate ? new Date(endDate).toISOString() : null;

    const updatedWorkOrder = {
      ...workOrder,
      description,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      estimatedCost,
      status,
    };
    onSave(updatedWorkOrder);
  };

  return (
    <div>
      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
      />
      <TextField
        label="Start Date"
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
        fullWidth
      />
      <TextField
        label="End Date"
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
        fullWidth
      />
      <TextField
        label="Estimated Cost"
        type="number"
        value={estimatedCost}
        onChange={(e) => setEstimatedCost(e.target.value)}
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }}
        fullWidth
      />
      <TextField
        label="Status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        fullWidth
      />
      <Button onClick={onCancel}>Cancel</Button>
      <Button onClick={handleSave} color="primary">Save</Button>
    </div>
  );
};

export default WorkOrderForm;
