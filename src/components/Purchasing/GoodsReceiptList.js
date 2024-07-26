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
import TablePagination from '@mui/material/TablePagination';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { getGoodsReceipts, deleteGoodsReceipt } from '../../services/purchase/goodsReceiptApiService';
import GoodsReceiptForm from './GoodsReceiptForm';

const GoodsReceiptList = () => {
    const [receipts, setReceipts] = useState([]);
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    const [formOpen, setFormOpen] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [receiptToDelete, setReceiptToDelete] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // Fetch all goods receipts on component mount
    useEffect(() => {
        const fetchReceipts = async () => {
            try {
                const data = await getGoodsReceipts();
                setReceipts(data);
            } catch (error) {
                setSnackbarMessage('Failed to load goods receipts.');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            }
        };

        fetchReceipts();
    }, []);

    // Handle edit receipt
    const handleEdit = (receipt) => {
        setSelectedReceipt(receipt);
        setFormOpen(true);
    };

    // Handle delete receipt
    const handleDelete = (receipt) => {
        setReceiptToDelete(receipt);
        setDeleteConfirmOpen(true);
    };

    // Confirm deletion
    const confirmDelete = async () => {
        try {
            if (receiptToDelete) {
                await deleteGoodsReceipt(receiptToDelete.id);
                setReceipts(receipts.filter(r => r.id !== receiptToDelete.id));
                setSnackbarMessage('Goods receipt deleted successfully!');
                setSnackbarSeverity('success');
            }
        } catch (error) {
            setSnackbarMessage('Failed to delete goods receipt.');
            setSnackbarSeverity('error');
        } finally {
            setSnackbarOpen(true);
            setDeleteConfirmOpen(false);
            setReceiptToDelete(null);
        }
    };

    // Cancel deletion
    const cancelDelete = () => {
        setDeleteConfirmOpen(false);
        setReceiptToDelete(null);
    };

    // Handle form close
    const handleFormClose = () => {
        setFormOpen(false);
        setSelectedReceipt(null);
    };

    // Handle form save
    const handleFormSave = async () => {
        try {
            const data = await getGoodsReceipts();
            setReceipts(data);
            setSnackbarMessage('Goods receipt saved successfully!');
            setSnackbarSeverity('success');
        } catch (error) {
            setSnackbarMessage('Failed to save goods receipt.');
            setSnackbarSeverity('error');
        } finally {
            setSnackbarOpen(true);
            handleFormClose();
        }
    };

    // Handle snackbar close
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    // Handle search input change
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    // Handle page change
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Handle rows per page change
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Filter receipts based on search query
    const filteredReceipts = receipts.filter(receipt =>
        receipt.id.toString().includes(searchQuery) ||
        (receipt.order && receipt.order.id.toString().includes(searchQuery)) ||
        receipt.status.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Paginate receipts
    const paginatedReceipts = filteredReceipts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
                <Tooltip title="Add Goods Receipt">
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
                            <TableCell>Order ID</TableCell>
                            <TableCell>Receipt Date</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedReceipts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} style={{ textAlign: 'center' }}>
                                    No data available
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedReceipts.map(receipt => (
                                <TableRow key={receipt.id}>
                                    <TableCell>{receipt.id}</TableCell>
                                    <TableCell>{receipt.order?.id}</TableCell> {/* Handle potential null value */}
                                    <TableCell>{new Date(receipt.receiptDate).toLocaleDateString()}</TableCell>
                                    <TableCell>{receipt.status}</TableCell>
                                    <TableCell>
                                        <Tooltip title="Edit">
                                            <IconButton onClick={() => handleEdit(receipt)}>
                                                <span className="material-icons">edit</span>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton onClick={() => handleDelete(receipt)}>
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
                count={filteredReceipts.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
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
                    Are you sure you want to delete this goods receipt?
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelDelete} color="primary">Cancel</Button>
                    <Button onClick={confirmDelete} color="secondary">Delete</Button>
                </DialogActions>
            </Dialog>

            {/* Goods Receipt Form Dialog */}
            <GoodsReceiptForm open={formOpen} onClose={handleFormClose} onSave={handleFormSave} receipt={selectedReceipt} />
        </div>
    );
};

export default GoodsReceiptList;
