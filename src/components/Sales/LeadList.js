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
import { getLeads, deleteLead } from '../../services/sales/leadsApiService';
import LeadForm from './LeadForm';

const LeadList = () => {
    const [leads, setLeads] = useState([]);
    const [selectedLead, setSelectedLead] = useState(null);
    const [formOpen, setFormOpen] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [leadToDelete, setLeadToDelete] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    // Pagination states
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const data = await getLeads();
                setLeads(data);
            } catch (error) {
                setSnackbarMessage('Failed to load leads.');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            }
        };

        fetchLeads();
    }, []);

    const handleEdit = (lead) => {
        setSelectedLead(lead);
        setFormOpen(true);
    };

    const handleDelete = (lead) => {
        setLeadToDelete(lead);
        setDeleteConfirmOpen(true);
    };

    const confirmDelete = async () => {
        try {
            if (leadToDelete) {
                await deleteLead(leadToDelete.id);
                setLeads(leads.filter(l => l.id !== leadToDelete.id));
                setSnackbarMessage('Lead deleted successfully!');
                setSnackbarSeverity('success');
            }
        } catch (error) {
            setSnackbarMessage('Failed to delete lead.');
            setSnackbarSeverity('error');
        } finally {
            setSnackbarOpen(true);
            setDeleteConfirmOpen(false);
            setLeadToDelete(null);
        }
    };

    const cancelDelete = () => {
        setDeleteConfirmOpen(false);
        setLeadToDelete(null);
    };

    const handleFormClose = () => {
        setFormOpen(false);
        setSelectedLead(null);
    };

    const handleFormSave = async () => {
        try {
            const data = await getLeads();
            setLeads(data);
            setSnackbarMessage('Lead saved successfully!');
            setSnackbarSeverity('success');
        } catch (error) {
            setSnackbarMessage('Failed to save lead.');
            setSnackbarSeverity('error');
        } finally {
            setSnackbarOpen(true);
            handleFormClose();
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setPage(0); // Reset to first page on search
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to first page on rows per page change
    };

    const filteredLeads = leads.filter(lead =>
        lead.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const paginatedLeads = filteredLeads.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
                <Tooltip title="Add Lead">
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
                            <TableCell>Created Date</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedLeads.length > 0 ? (
                            paginatedLeads.map(lead => (
                                <TableRow key={lead.id}>
                                    <TableCell>{lead.id}</TableCell>
                                    <TableCell>{lead.name}</TableCell>
                                    <TableCell>{lead.contactInfo}</TableCell>
                                    <TableCell>{new Date(lead.createdDate).toLocaleDateString()}</TableCell>
                                    <TableCell>{lead.status}</TableCell>
                                    <TableCell>
                                        <Tooltip title="Edit">
                                            <IconButton onClick={() => handleEdit(lead)}>
                                                <span className="material-icons">edit</span>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton onClick={() => handleDelete(lead)}>
                                                <span className="material-icons">delete</span>
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} style={{ textAlign: 'center' }}>
                                    No data available
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredLeads.length}
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
                    Are you sure you want to delete this lead?
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelDelete} color="primary">Cancel</Button>
                    <Button onClick={confirmDelete} color="secondary">Delete</Button>
                </DialogActions>
            </Dialog>

            {/* Lead Form Dialog */}
            <LeadForm open={formOpen} onClose={handleFormClose} onSave={handleFormSave} lead={selectedLead} />
        </div>
    );
};

export default LeadList;
