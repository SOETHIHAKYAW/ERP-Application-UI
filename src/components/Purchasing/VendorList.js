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
import { getVendors, deleteVendor } from '../../services/purchase/vendorApiService';
import VendorForm from './VendorForm';

const VendorList = () => {
    const [vendors, setVendors] = useState([]);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [formOpen, setFormOpen] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [vendorToDelete, setVendorToDelete] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const data = await getVendors();
                setVendors(data);
            } catch (error) {
                setSnackbarMessage('Failed to load vendors.');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            }
        };

        fetchVendors();
    }, []);

    const handleEdit = (vendor) => {
        setSelectedVendor(vendor);
        setFormOpen(true);
    };

    const handleDelete = (vendor) => {
        setVendorToDelete(vendor);
        setDeleteConfirmOpen(true);
    };

    const confirmDelete = async () => {
        try {
            if (vendorToDelete) {
                await deleteVendor(vendorToDelete.id);
                setVendors(vendors.filter(v => v.id !== vendorToDelete.id));
                setSnackbarMessage('Vendor deleted successfully!');
                setSnackbarSeverity('success');
            }
        } catch (error) {
            setSnackbarMessage('Failed to delete vendor.');
            setSnackbarSeverity('error');
        } finally {
            setSnackbarOpen(true);
            setDeleteConfirmOpen(false);
            setVendorToDelete(null);
        }
    };

    const cancelDelete = () => {
        setDeleteConfirmOpen(false);
        setVendorToDelete(null);
    };

    const handleFormClose = () => {
        setFormOpen(false);
        setSelectedVendor(null);
    };

    const handleFormSave = async () => {
        try {
            const data = await getVendors();
            setVendors(data);
            setSnackbarMessage('Vendor saved successfully!');
            setSnackbarSeverity('success');
        } catch (error) {
            setSnackbarMessage('Failed to save vendor.');
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
        // Optionally filter the data based on the search query
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const filteredVendors = vendors.filter(vendor =>
        vendor.name.toLowerCase().includes(searchQuery.toLowerCase())
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
                <Tooltip title="Add Vendor">
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
                            <TableCell>Name</TableCell>
                            <TableCell>Contact Info</TableCell>
                            <TableCell>Registration Date</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredVendors.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    No data available
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredVendors
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map(vendor => (
                                    <TableRow key={vendor.id}>
                                        <TableCell>{vendor.id}</TableCell>
                                        <TableCell>{vendor.name}</TableCell>
                                        <TableCell>{vendor.contactInfo}</TableCell>
                                        <TableCell>{new Date(vendor.registrationDate).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Tooltip title="Edit">
                                                <IconButton onClick={() => handleEdit(vendor)}>
                                                    <span className="material-icons">edit</span>
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton onClick={() => handleDelete(vendor)}>
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
                count={filteredVendors.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
            />

            {/* Snackbar for success or error messages */}
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

            {/* Confirmation dialog for delete */}
            <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this vendor?
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelDelete} color="primary">Cancel</Button>
                    <Button onClick={confirmDelete} color="secondary">Delete</Button>
                </DialogActions>
            </Dialog>

            {/* Vendor Form Dialog */}
            <VendorForm open={formOpen} onClose={handleFormClose} onSave={handleFormSave} vendor={selectedVendor} />
        </div>
    );
};

export default VendorList;
