import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

const FixedAssetForm = ({ open, onClose, onSave, initialData }) => {
  const [assetName, setAssetName] = useState('');
  const [purchaseValue, setPurchaseValue] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    if (initialData) {
      setAssetName(initialData.assetName || '');
      setPurchaseValue(initialData.purchaseValue || '');
      setPurchaseDate(initialData.purchaseDate ? new Date(initialData.purchaseDate).toISOString().split('T')[0] : '');
      setLocation(initialData.location || '');
    }
  }, [initialData]);

  const handleSubmit = () => {
    const asset = {
      assetName,
      purchaseValue: parseFloat(purchaseValue),
      purchaseDate: new Date(purchaseDate),
      location
    };
    onSave(asset);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{initialData ? 'Edit Fixed Asset' : 'Add Fixed Asset'}</DialogTitle>
      <DialogContent>
        <TextField
          label="Asset Name"
          fullWidth
          margin="dense"
          value={assetName}
          onChange={(e) => setAssetName(e.target.value)}
        />
        <TextField
          label="Purchase Value"
          type="number"
          fullWidth
          margin="dense"
          value={purchaseValue}
          onChange={(e) => setPurchaseValue(e.target.value)}
        />
        <TextField
          label="Purchase Date"
          type="date"
          fullWidth
          margin="dense"
          InputLabelProps={{ shrink: true }}
          value={purchaseDate}
          onChange={(e) => setPurchaseDate(e.target.value)}
        />
        <TextField
          label="Location"
          fullWidth
          margin="dense"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FixedAssetForm;
