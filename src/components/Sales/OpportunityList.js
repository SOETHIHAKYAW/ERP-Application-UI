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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TablePagination from '@mui/material/TablePagination';
import { getOpportunities, deleteOpportunity } from '../../services/sales/opportunityApiService';
import OpportunityForm from './OpportunityForm';
import { getLeads } from '../../services/sales/leadsApiService'; // Import getLeads

const OpportunityList = () => {
    const [opportunities, setOpportunities] = useState([]);
    const [leads, setLeads] = useState([]);
    const [selectedOpportunity, setSelectedOpportunity] = useState(null);
    const [formOpen, setFormOpen] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [opportunityToDelete, setOpportunityToDelete] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);

    useEffect(() => {
        const fetchOpportunities = async () => {
            try {
                const data = await getOpportunities();
                setOpportunities(data);
            } catch (error) {
                setSnackbarMessage('Failed to load opportunities.');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            }
        };

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

        fetchOpportunities();
        fetchLeads();
    }, []);

    const handleEdit = (opportunity) => {
        setSelectedOpportunity(opportunity);
        setFormOpen(true);
    };

    const handleDelete = (opportunity) => {
        setOpportunityToDelete(opportunity);
        setDeleteConfirmOpen(true);
    };

    const confirmDelete = async () => {
        try {
            if (opportunityToDelete) {
                await deleteOpportunity(opportunityToDelete.id);
                setOpportunities(opportunities.filter(o => o.id !== opportunityToDelete.id));
                setSnackbarMessage('Opportunity deleted successfully!');
                setSnackbarSeverity('success');
            }
        } catch (error) {
            setSnackbarMessage('Failed to delete opportunity.');
            setSnackbarSeverity('error');
        } finally {
            setSnackbarOpen(true);
            setDeleteConfirmOpen(false);
            setOpportunityToDelete(null);
        }
    };

    const cancelDelete = () => {
        setDeleteConfirmOpen(false);
        setOpportunityToDelete(null);
    };

    const handleFormClose = () => {
        setFormOpen(false);
        setSelectedOpportunity(null);
    };

    const handleFormSave = () => {
        // Refresh the list of opportunities after saving the form
        const fetchOpportunities = async () => {
            try {
                const data = await getOpportunities();
                setOpportunities(data);
                setSnackbarMessage('Opportunity saved successfully!');
                setSnackbarSeverity('success');
            } catch (error) {
                setSnackbarMessage('Failed to save opportunity.');
                setSnackbarSeverity('error');
            } finally {
                setSnackbarOpen(true);
            }
        };
        
        fetchOpportunities();
        handleFormClose();
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const filteredOpportunities = opportunities.filter(opportunity =>
        opportunity.description.toLowerCase().includes(searchQuery.toLowerCase())
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
                <Tooltip title="Add Opportunity">
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
                            {/* <TableCell>Lead</TableCell> */}
                            <TableCell>Description</TableCell>
                            <TableCell>Estimated Value</TableCell>
                            <TableCell>Expected Close Date</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredOpportunities.length > 0 ? (
                            filteredOpportunities.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(opportunity => (
                                <TableRow key={opportunity.id}>
                                    <TableCell>{opportunity.id}</TableCell>
                                    {/* <TableCell>
                                        {leads.find(lead => lead.id === opportunity.leadId)?.name || 'N/A'}
                                    </TableCell> */}
                                    <TableCell>{opportunity.description}</TableCell>
                                    <TableCell>{opportunity.estimatedValue}</TableCell>
                                    <TableCell>{new Date(opportunity.expectedCloseDate).toLocaleDateString()}</TableCell>
                                    <TableCell>{opportunity.status}</TableCell>
                                    <TableCell>
                                        <Tooltip title="Edit">
                                            <IconButton onClick={() => handleEdit(opportunity)}>
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton onClick={() => handleDelete(opportunity)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} style={{ textAlign: 'center' }}>
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
                count={filteredOpportunities.length}
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
                    Are you sure you want to delete this opportunity?
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelDelete} color="primary">Cancel</Button>
                    <Button onClick={confirmDelete} color="secondary">Delete</Button>
                </DialogActions>
            </Dialog>

            {/* Opportunity Form Dialog */}
            <OpportunityForm open={formOpen} onClose={handleFormClose} onSave={handleFormSave} opportunity={selectedOpportunity} />
        </div>
    );
};

export default OpportunityList;
