import React, { useState, useEffect } from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getInvoices, deleteInvoice, createInvoice, updateInvoice } from '../../services/accounting/invoiceApiService';
import InvoiceForm from './InvoiceForm';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  useEffect(() => {
    filterInvoices();
  }, [searchQuery, invoices]);

  const fetchInvoices = async () => {
    try {
      const data = await getInvoices();
      setInvoices(data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  const filterInvoices = () => {
    const filtered = invoices.filter(invoice => {
      // Ensure invoice properties are not null and provide default values
      const invoiceDate = invoice.invoiceDate ? invoice.invoiceDate.toLowerCase() : '';
      const status = invoice.status ? invoice.status.toLowerCase() : '';
      const query = searchQuery.toLowerCase();
      return invoiceDate.includes(query) || status.includes(query);
    });
    setFilteredInvoices(filtered);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleEdit = (invoice) => {
    setCurrentInvoice(invoice);
    setDialogOpen(true);
  };

  const handleDelete = (invoice) => {
    setInvoiceToDelete(invoice);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    try {
      if (invoiceToDelete) {
        await deleteInvoice(invoiceToDelete.id);
        fetchInvoices(); // Refresh the invoice list
        setConfirmDeleteOpen(false);
        setInvoiceToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting invoice:', error);
    }
  };

  const handleSaveInvoice = async (invoice) => {
    try {
      if (currentInvoice) {
        // Update existing invoice
        await updateInvoice({ ...currentInvoice, ...invoice });
      } else {
        // Create new invoice
        await createInvoice(invoice);
      }
      await fetchInvoices(); // Refresh the invoice list
      setDialogOpen(false);
      setCurrentInvoice(null); // Clear current invoice
    } catch (error) {
      console.error('Error saving invoice:', error);
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
        <Tooltip title="Add Invoice">
          <IconButton onClick={() => handleEdit(null)}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Invoice Date</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInvoices.length > 0 ? (
              filteredInvoices.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{new Date(invoice.invoiceDate).toLocaleDateString()}</TableCell>
                  <TableCell>{invoice.amount}</TableCell>
                  <TableCell>{invoice.status}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(invoice)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(invoice)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
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
        count={filteredInvoices.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
      <InvoiceForm
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveInvoice}
        currentInvoice={currentInvoice}
      />
      <Dialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this invoice?</Typography>
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

export default InvoiceList;
