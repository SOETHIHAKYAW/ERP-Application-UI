import React, { useState, useEffect } from 'react';
import {
  getPurchaseRequisitions,
  addPurchaseRequisition,
  updatePurchaseRequisition,
  deletePurchaseRequisition
} from '../../services/purchase/purchaseRequisitionApiService';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';

const PurchaseRequisitionList = () => {
  const [requisitions, setRequisitions] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [selectedRequisition, setSelectedRequisition] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [requisitionToDelete, setRequisitionToDelete] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    description: '',
    requestDate: '',
    status: ''
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRequisitions();
  }, []);

  // const fetchRequisitions = async () => {
  //   setLoading(true);
  //   try {
  //     const data = await getPurchaseRequisitions();
  //     setRequisitions(data);
  //   } catch (error) {
  //     console.error('Error fetching purchase requisitions:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const fetchRequisitions = async () => {
    setLoading(true);
    try {
      const data = await getPurchaseRequisitions(); // Check this function
      console.log('Fetched requisitions:', data); // Add this line to debug
      setRequisitions(data);
    } catch (error) {
      console.error('Error fetching purchase requisitions:', error);
    } finally {
      setLoading(false);
    }
  };
  

  const handleAddDialogOpen = () => setAddDialogOpen(true);
  const handleAddDialogClose = () => setAddDialogOpen(false);

  const handleEditDialogOpen = (requisition) => {
    setSelectedRequisition(requisition);
    setFormData({
      id: requisition.id,
      description: requisition.description,
      requestDate: requisition.requestDate,
      status: requisition.status
    });
    setEditDialogOpen(true);
  };
  const handleEditDialogClose = () => setEditDialogOpen(false); // Fixed here

  const handleDeleteConfirmOpen = (requisition) => {
    setRequisitionToDelete(requisition);
    setDeleteConfirmOpen(true);
  };
  const handleDeleteConfirmClose = () => setDeleteConfirmOpen(false);

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleSearchChange = (event) => setSearchQuery(event.target.value);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddRequisition = async () => {
    setLoading(true);
    try {
      await addPurchaseRequisition(formData);
      setSnackbarMessage('Purchase requisition added successfully.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      handleAddDialogClose();
      await fetchRequisitions(); // Reload data
    } catch (error) {
      console.error('Error adding purchase requisition:', error);
      setSnackbarMessage('Failed to add purchase requisition.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRequisition = async () => {
    setLoading(true);
    try {
      await updatePurchaseRequisition(formData.id, formData);
      setSnackbarMessage('Purchase requisition updated successfully.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      handleEditDialogClose();
      await fetchRequisitions(); // Reload data
    } catch (error) {
      console.error('Error updating purchase requisition:', error);
      setSnackbarMessage('Failed to update purchase requisition.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRequisition = async () => {
    setLoading(true);
    try {
      await deletePurchaseRequisition(requisitionToDelete.id);
      setSnackbarMessage('Purchase requisition deleted successfully.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      handleDeleteConfirmClose();
      await fetchRequisitions(); // Reload data
    } catch (error) {
      console.error('Error deleting purchase requisition:', error);
      setSnackbarMessage('Failed to delete purchase requisition.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Filter requisitions based on search query
  const filteredRequisitions = requisitions.filter((requisition) =>
    requisition.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const handlePageChange = (event, newPage) => setPage(newPage);
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
        <Tooltip title="Add Requisition">
          <IconButton onClick={handleAddDialogOpen}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      </div>

      {loading && <div>Loading...</div>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Request Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRequisitions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              filteredRequisitions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((requisition) => (
                <TableRow key={requisition.id}>
                  <TableCell>{requisition.id}</TableCell>
                  <TableCell>{requisition.description}</TableCell>
                  <TableCell>{new Date(requisition.requestDate).toLocaleDateString()}</TableCell>
                  <TableCell>{requisition.status}</TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleEditDialogOpen(requisition)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => handleDeleteConfirmOpen(requisition)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredRequisitions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />

      <Dialog open={addDialogOpen} onClose={handleAddDialogClose}>
        <DialogTitle>Add Purchase Requisition</DialogTitle>
        <DialogContent>
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Request Date"
            name="requestDate"
            type="date"
            value={formData.requestDate}
            onChange={handleFormChange}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            margin="normal"
          />
          <TextField
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddRequisition} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
        <DialogTitle>Edit Purchase Requisition</DialogTitle>
        <DialogContent>
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Request Date"
            name="requestDate"
            type="date"
            value={formData.requestDate}
            onChange={handleFormChange}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            margin="normal"
          />
          <TextField
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdateRequisition} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteConfirmOpen} onClose={handleDeleteConfirmClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this purchase requisition?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirmClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteRequisition} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default PurchaseRequisitionList;
