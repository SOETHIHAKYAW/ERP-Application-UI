import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import TablePagination from '@mui/material/TablePagination';
import { createWorkOrder, updateWorkOrder , getWorkOrders, deleteWorkOrder } from '../../services/manufacturing/manufacturingApiService';
import WorkOrderForm from './WorkOrderForm';

const WorkOrderList = () => {
  const [workOrders, setWorkOrders] = useState([]);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [workOrderToDelete, setWorkOrderToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchWorkOrders = async () => {
      try {
        const data = await getWorkOrders();
        setWorkOrders(data);
      } catch (error) {
        setSnackbarMessage('Failed to load work orders.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    };

    fetchWorkOrders();
  }, []);

  const handleEdit = (workOrder) => {
    setSelectedWorkOrder(workOrder);
    setFormOpen(true);
  };

  const handleDelete = (workOrder) => {
    setWorkOrderToDelete(workOrder);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      if (workOrderToDelete) {
        await deleteWorkOrder(workOrderToDelete.id);
        setWorkOrders(workOrders.filter(w => w.id !== workOrderToDelete.id));
        setSnackbarMessage('Work Order deleted successfully!');
        setSnackbarSeverity('success');
      }
    } catch (error) {
      setSnackbarMessage('Failed to delete work order.');
      setSnackbarSeverity('error');
    } finally {
      setSnackbarOpen(true);
      setDeleteConfirmOpen(false);
      setWorkOrderToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmOpen(false);
    setWorkOrderToDelete(null);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedWorkOrder(null);
  };

  const handleFormSave = async (data) => {
    try {
      // If an ID is present, it's an update, otherwise it's a new entry
      if (data.id) {
        await updateWorkOrder(data.id, data); // Assume updateWorkOrder exists
      } else {
        await createWorkOrder(data); // Assume createWorkOrder exists
      }
      const updatedData = await getWorkOrders();
      setWorkOrders(updatedData);
      setSnackbarMessage('Work Order saved successfully!');
      setSnackbarSeverity('success');
    } catch (error) {
      setSnackbarMessage('Failed to save work order.');
      setSnackbarSeverity('error');
    } finally {
      setSnackbarOpen(true);
      handleFormClose();
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter work orders based on search query
  const filteredWorkOrders = workOrders.filter(workOrder =>
    workOrder.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <Tooltip title="Add Work Order">
          <IconButton onClick={() => setFormOpen(true)}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      </div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Estimated Cost</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredWorkOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              filteredWorkOrders
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(workOrder => (
                  <TableRow key={workOrder.id}>
                    <TableCell>{workOrder.id}</TableCell>
                    <TableCell>{workOrder.description}</TableCell>
                    <TableCell>{new Date(workOrder.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(workOrder.endDate).toLocaleDateString()}</TableCell>
                    <TableCell>{workOrder.estimatedCost}</TableCell>
                    <TableCell>{workOrder.status}</TableCell>
                    <TableCell>
                      <Tooltip title="Edit">
                        <IconButton onClick={() => handleEdit(workOrder)}>
                          <span className="material-icons">edit</span>
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton onClick={() => handleDelete(workOrder)}>
                          <span className="material-icons">delete</span>
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredWorkOrders.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />

      {/* Work Order Form Dialog */}
      <Dialog open={formOpen} onClose={handleFormClose}>
        <DialogTitle>{selectedWorkOrder ? 'Edit Work Order' : 'Add Work Order'}</DialogTitle>
        <DialogContent>
          <WorkOrderForm
            workOrder={selectedWorkOrder}
            onSave={handleFormSave}
            onClose={handleFormClose}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFormClose}>Cancel</Button>
          <Button onClick={() => handleFormSave(selectedWorkOrder)} color="primary">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={cancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this work order?
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete}>Cancel</Button>
          <Button onClick={confirmDelete} color="primary">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notification */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default WorkOrderList;
