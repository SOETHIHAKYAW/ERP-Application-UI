import React, { useState, useEffect } from 'react';
import { TextField, InputAdornment, IconButton, Tooltip, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getFixedAssets, deleteFixedAsset, addFixedAsset, updateFixedAsset } from '../../services/fixedassets/fixedAssetApiService';
import FixedAssetForm from './FixedAssetForm';

const FixedAssetList = () => {
  const [fixedAssets, setFixedAssets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentAsset, setCurrentAsset] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState(null);

  useEffect(() => {
    fetchFixedAssets();
  }, []);

  useEffect(() => {
    filterAssets();
  }, [searchQuery, fixedAssets]);

  const fetchFixedAssets = async () => {
    try {
      const data = await getFixedAssets();
      setFixedAssets(data);
    } catch (error) {
      console.error('Error fetching fixed assets:', error);
    }
  };

  const filterAssets = () => {
    const filtered = fixedAssets.filter(asset =>
      asset.assetName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredAssets(filtered);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleEdit = (asset) => {
    setCurrentAsset(asset);
    setDialogOpen(true);
  };

  const handleDelete = (asset) => {
    setAssetToDelete(asset);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    try {
      if (assetToDelete) {
        await deleteFixedAsset(assetToDelete.id);
        fetchFixedAssets(); // Refresh the asset list
        setConfirmDeleteOpen(false);
        setAssetToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting fixed asset:', error);
    }
  };

  const handleSaveAsset = async (asset) => {
    try {
      if (currentAsset) {
        // Update existing asset
        await updateFixedAsset({ ...currentAsset, ...asset });
      } else {
        // Add new asset
        await addFixedAsset(asset);
      }
      fetchFixedAssets(); // Refresh the asset list
      setDialogOpen(false);
      setCurrentAsset(null); // Clear current asset
    } catch (error) {
      console.error('Error saving fixed asset:', error);
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Tooltip title="Add Fixed Asset">
          <IconButton onClick={() => handleEdit(null)}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Purchase Value</TableCell>
              <TableCell>Purchase Date</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAssets.length > 0 ? (
              filteredAssets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell>{asset.assetName}</TableCell>
                  <TableCell>{asset.purchaseValue}</TableCell>
                  <TableCell>{new Date(asset.purchaseDate).toLocaleDateString()}</TableCell>
                  <TableCell>{asset.location}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(asset)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(asset)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredAssets.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
      <FixedAssetForm
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveAsset}
        initialData={currentAsset}
      />
      <Dialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this fixed asset?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FixedAssetList;
