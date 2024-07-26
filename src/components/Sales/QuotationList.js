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
import { getQuotations, deleteQuotation } from '../../services/sales/quotationApiService';
import QuotationForm from './QuotationForm';

const QuotationList = () => {
  const [quotations, setQuotations] = useState([]);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [quotationToDelete, setQuotationToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        const data = await getQuotations();
        setQuotations(data);
      } catch (error) {
        setSnackbarMessage('Failed to load quotations.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    };

    fetchQuotations();
  }, []);

  const handleEdit = (quotation) => {
    setSelectedQuotation(quotation);
    setFormOpen(true);
  };

  const handleDelete = (quotation) => {
    setQuotationToDelete(quotation);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      if (quotationToDelete) {
        await deleteQuotation(quotationToDelete.id);
        setQuotations(quotations.filter(q => q.id !== quotationToDelete.id));
        setSnackbarMessage('Quotation deleted successfully!');
        setSnackbarSeverity('success');
      }
    } catch (error) {
      setSnackbarMessage('Failed to delete quotation.');
      setSnackbarSeverity('error');
    } finally {
      setSnackbarOpen(true);
      setDeleteConfirmOpen(false);
      setQuotationToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmOpen(false);
    setQuotationToDelete(null);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedQuotation(null);
  };

  const handleFormSave = async () => {
    try {
      const data = await getQuotations(); // Fetch updated list of quotations
      setQuotations(data);
      setSnackbarMessage('Quotation saved successfully!');
      setSnackbarSeverity('success');
    } catch (error) {
      setSnackbarMessage('Failed to save quotation.');
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

  const filteredQuotations = quotations.filter((quotation) =>
    quotation.opportunity?.name?.toLowerCase().includes(searchQuery.toLowerCase())
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
        <Tooltip title="Add Quotation">
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
              <TableCell>Opportunity</TableCell>
              <TableCell>Quotation Date</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredQuotations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              filteredQuotations
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((quotation) => (
                  <TableRow key={quotation.id}>
                    <TableCell>{quotation.id}</TableCell>
                    <TableCell>{quotation.opportunity ? quotation.opportunity.name : 'N/A'}</TableCell>
                    <TableCell>{quotation.quotationDate ? new Date(quotation.quotationDate).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell>{quotation.totalAmount}</TableCell>
                    <TableCell>{quotation.status}</TableCell>
                    <TableCell>
                      <Tooltip title="Edit">
                        <IconButton onClick={() => handleEdit(quotation)}>
                          <span className="material-icons">edit</span>
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton onClick={() => handleDelete(quotation)}>
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
        count={filteredQuotations.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />

      {/* Quotation Form Dialog */}
      <Dialog open={formOpen} onClose={handleFormClose}>
        <DialogTitle>{selectedQuotation ? 'Edit Quotation' : 'Add Quotation'}</DialogTitle>
        <DialogContent>
          <QuotationForm
            quotation={selectedQuotation}
            onSave={handleFormSave}
            onCancel={handleFormClose}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFormClose}>Cancel</Button>
          <Button onClick={handleFormSave} color="primary">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={cancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this quotation?
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

export default QuotationList;
