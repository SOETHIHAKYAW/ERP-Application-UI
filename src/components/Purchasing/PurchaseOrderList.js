// import React, { useState, useEffect } from 'react';
// import {
//     getPurchaseOrders,
//     addPurchaseOrder,
//     deletePurchaseOrder,
//     updatePurchaseOrder
// } from '../../services/purchase/purchaseOrderApiService';
// import Snackbar from '@mui/material/Snackbar';
// import Alert from '@mui/material/Alert';
// import IconButton from '@mui/material/IconButton';
// import Tooltip from '@mui/material/Tooltip';
// import Dialog from '@mui/material/Dialog';
// import DialogActions from '@mui/material/DialogActions';
// import DialogContent from '@mui/material/DialogContent';
// import DialogTitle from '@mui/material/DialogTitle';
// import Button from '@mui/material/Button';
// import TextField from '@mui/material/TextField';
// import InputAdornment from '@mui/material/InputAdornment';
// import SearchIcon from '@mui/icons-material/Search';
// import AddIcon from '@mui/icons-material/Add';
// import TablePagination from '@mui/material/TablePagination';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';
// import DialogContentText from '@mui/material/DialogContentText';

// const PurchaseOrderList = () => {
//     const [purchaseOrders, setPurchaseOrders] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [snackbarOpen, setSnackbarOpen] = useState(false);
//     const [snackbarMessage, setSnackbarMessage] = useState('');
//     const [selectedOrder, setSelectedOrder] = useState(null);
//     const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
//     const [orderToDelete, setOrderToDelete] = useState(null);
//     const [editDialogOpen, setEditDialogOpen] = useState(false);
//     const [editFormData, setEditFormData] = useState({
//         id: '',
//         orderDate: '',
//         totalAmount: '',
//         status: '',
//         requisitionId: ''
//     });
//     const [searchQuery, setSearchQuery] = useState('');
//     const [addDialogOpen, setAddDialogOpen] = useState(false);
//     const [newOrderData, setNewOrderData] = useState({
//         orderDate: '',
//         totalAmount: '',
//         status: '',
//         requisitionId: ''
//     });

//     // Pagination states
//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(5);

//     useEffect(() => {
//         const fetchPurchaseOrders = async () => {
//             try {
//                 const data = await getPurchaseOrders();
//                 setPurchaseOrders(data);
//             } catch (error) {
//                 setError(error.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchPurchaseOrders();
//     }, []);

//     const handleDelete = (order) => {
//         setOrderToDelete(order);
//         setDeleteConfirmOpen(true);
//     };

//     const confirmDelete = async () => {
//         if (orderToDelete) {
//             try {
//                 await deletePurchaseOrder(orderToDelete.id);
//                 setSnackbarMessage('Purchase deleted successfully!');
//                 setPurchaseOrders(purchaseOrders.filter(order => order.id !== orderToDelete.id));
//             } catch (error) {
//                 setSnackbarMessage('Failed to delete purchase.');
//             } finally {
//                 setSnackbarOpen(true);
//                 setDeleteConfirmOpen(false);
//                 setOrderToDelete(null);
//             }
//         }
//     };

//     const cancelDelete = () => {
//         setDeleteConfirmOpen(false);
//         setOrderToDelete(null);
//     };

//     const openEditDialog = (order) => {
//         setSelectedOrder(order);
//         setEditFormData({
//             id: order.id,
//             orderDate: new Date(order.orderDate).toISOString().split('T')[0],
//             totalAmount: order.totalAmount,
//             status: order.status,
//             requisitionId: order.requisition.id
//         });
//         setEditDialogOpen(true);
//     };

//     const handleEditInputChange = (e) => {
//         const { name, value } = e.target;
//         setEditFormData({ ...editFormData, [name]: value });
//     };

//     const handleUpdateOrder = async () => {
//         try {
//             const updatedOrder = {
//                 ...selectedOrder,
//                 orderDate: editFormData.orderDate,
//                 totalAmount: parseFloat(editFormData.totalAmount),
//                 status: editFormData.status,
//                 requisition: { id: editFormData.requisitionId }
//             };

//             await updatePurchaseOrder(updatedOrder.id, updatedOrder);
//             setSnackbarMessage('Purchase updated successfully!');
//             setPurchaseOrders(purchaseOrders.map(o => (o.id === updatedOrder.id ? updatedOrder : o)));
//             setEditDialogOpen(false);
//         } catch (error) {
//             setSnackbarMessage('Failed to update purchase.');
//         } finally {
//             setSnackbarOpen(true);
//         }
//     };

//     const handleSearchChange = (e) => {
//         setSearchQuery(e.target.value);
//     };

//     const handleAddInputChange = (e) => {
//         const { name, value } = e.target;
//         setNewOrderData({ ...newOrderData, [name]: value });
//     };

//     const handleAddOrder = async () => {
//         // Validate input
//         if (!newOrderData.orderDate || !newOrderData.totalAmount || !newOrderData.status) {
//             setSnackbarMessage('Please fill out all required fields.');
//             setSnackbarOpen(true);
//             return;
//         }
    
//         // Convert requisitionId to integer if it's provided, otherwise set to null
//         const requisitionId = newOrderData.requisitionId ? parseInt(newOrderData.requisitionId, 10) : null;
    
//         // Prepare new order data
//         const newOrder = {
//             orderDate: newOrderData.orderDate,
//             totalAmount: parseFloat(newOrderData.totalAmount),
//             status: newOrderData.status,
//             requisitionId: requisitionId
//         };
    
//         try {
//             await addPurchaseOrder(newOrder);
//             setSnackbarMessage('Purchase added successfully!');
//             setSnackbarOpen(true);
//             setAddDialogOpen(false);
//             const data = await getPurchaseOrders(); // Refresh the data
//             setPurchaseOrders(data);
//         } catch (error) {
//             setSnackbarMessage('Failed to add purchase.');
//             setSnackbarOpen(true);
//         }
//     };

//     // Filter the purchase orders based on the search query
//     const filteredOrders = purchaseOrders.filter(order =>
//         order.id.toString().includes(searchQuery) ||
//         new Date(order.orderDate).toLocaleDateString().includes(searchQuery) ||
//         order.totalAmount.toString().includes(searchQuery) ||
//         order.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         order.requisition.id.toString().includes(searchQuery)
//     );

//     // Calculate paginated data
//     const paginatedOrders = filteredOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

//     // Pagination handlers
//     const handleChangePage = (event, newPage) => {
//         setPage(newPage);
//     };

//     const handleChangeRowsPerPage = (event) => {
//         setRowsPerPage(parseInt(event.target.value, 10));
//         setPage(0);
//     };

//     return (
//         <div>
//             {/* <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '16px' }}>
//                 <TextField
//                     label="Search Orders"
//                     variant="outlined"
//                     value={searchQuery}
//                     onChange={handleSearchChange}
//                     InputProps={{
//                         endAdornment: (
//                             <InputAdornment position="end">
//                                 <SearchIcon />
//                             </InputAdornment>
//                         ),
//                     }}
//                 />
//                 <Button
//                     variant="contained"
//                     // color="primary"
//                     startIcon={<AddIcon />}
//                     onClick={() => setAddDialogOpen(true)}
//                     style={{ marginLeft: '8px' }} 
//                 >
//                 </Button>
//             </div> */}
//             <div style={{ marginBottom: '20px' }}>
//                 <TextField
//                 label="Search"
//                 variant="outlined"
//                 size="small"
//                 value={searchQuery}
//                 onChange={handleSearchChange}
//                 InputProps={{
//                     endAdornment: (
//                     <InputAdornment position="end">
//                         <SearchIcon />
//                     </InputAdornment>
//                     ),
//                 }}
//                 />
//                 <Tooltip title="Add Order">
//                 <IconButton onClick={() => setAddDialogOpen(true)}>
//                     <AddIcon />
//                 </IconButton>
//                 </Tooltip>
//             </div>

//             {loading && <p>Loading...</p>}
//             {error && <p>Error: {error}</p>}
//             {!loading && !error && (
//                 <div>
//                     <TableContainer component={Paper}>
//                         <Table>
//                             <TableHead>
//                                 <TableRow>
//                                     <TableCell>ID</TableCell>
//                                     <TableCell>Order Date</TableCell>
//                                     <TableCell>Total Amount</TableCell>
//                                     <TableCell>Status</TableCell>
//                                     <TableCell>Requisition ID</TableCell>
//                                     <TableCell>Actions</TableCell>
//                                 </TableRow>
//                             </TableHead>
//                             <TableBody>
//                                 {paginatedOrders.length === 0 ? (
//                                     <TableRow>
//                                         <TableCell colSpan={6} align="center">
//                                             No data available
//                                         </TableCell>
//                                     </TableRow>
//                                 ) : (
//                                     paginatedOrders.map(order => (
//                                         <TableRow key={order.id}>
//                                             <TableCell>{order.id}</TableCell>
//                                             <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
//                                             <TableCell>{order.totalAmount.toFixed(2)}</TableCell>
//                                             <TableCell>{order.status}</TableCell>
//                                             <TableCell>{order.requisition.id}</TableCell>
//                                             <TableCell>
//                                                 <Tooltip title="Edit Order">
//                                                     <IconButton onClick={() => openEditDialog(order)}>
//                                                         <span className="material-icons">edit</span>
//                                                     </IconButton>
//                                                 </Tooltip>
//                                                 <Tooltip title="Delete Order">
//                                                     <IconButton onClick={() => handleDelete(order)}>
//                                                         <span className="material-icons">delete</span>
//                                                     </IconButton>
//                                                 </Tooltip>
//                                             </TableCell>
//                                         </TableRow>
//                                     ))
//                                 )}
//                             </TableBody>
//                         </Table>
//                     </TableContainer>

//                     {/* Pagination controls */}
//                     <TablePagination
//                         rowsPerPageOptions={[5, 10, 25]}
//                         component="div"
//                         count={filteredOrders.length}
//                         rowsPerPage={rowsPerPage}
//                         page={page}
//                         onPageChange={handleChangePage}
//                         onRowsPerPageChange={handleChangeRowsPerPage}
//                         style={{ marginTop: '16px' }}
//                     />
//                 </div>
//             )}

//             {/* Snackbar for success message */}
//             <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
//                 <Alert 
//                     onClose={() => setSnackbarOpen(false)} 
//                     severity={snackbarMessage.includes('Failed') ? 'error' : 'success'}
//                 >
//                     {snackbarMessage}
//                 </Alert>
//             </Snackbar>

//             {/* Confirmation dialog for delete */}
//             <Dialog
//                 open={deleteConfirmOpen}
//                 onClose={() => setDeleteConfirmOpen(false)}
//             >
//                 <DialogTitle>Confirm Deletion</DialogTitle>
//                 <DialogContent>
//                     <DialogContentText>
//                         Are you sure you want to delete this purchase order?
//                     </DialogContentText>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={cancelDelete} color="primary">
//                         Cancel
//                     </Button>
//                     <Button onClick={confirmDelete} color="secondary">
//                         Delete
//                     </Button>
//                 </DialogActions>
//             </Dialog>

//             {/* Edit dialog */}
//             <Dialog
//                 open={editDialogOpen}
//                 onClose={() => setEditDialogOpen(false)}
//             >
//                 <DialogTitle>Edit Purchase Order</DialogTitle>
//                 <DialogContent>
//                     <form>
//                         <TextField
//                             label="Order Date"
//                             type="date"
//                             name="orderDate"
//                             value={editFormData.orderDate}
//                             onChange={handleEditInputChange}
//                             fullWidth
//                             margin="normal"
//                             InputLabelProps={{
//                                 shrink: true,
//                             }}
//                         />
//                         <TextField
//                             label="Total Amount"
//                             type="number"
//                             name="totalAmount"
//                             value={editFormData.totalAmount}
//                             onChange={handleEditInputChange}
//                             fullWidth
//                             margin="normal"
//                         />
//                         <TextField
//                             label="Status"
//                             name="status"
//                             value={editFormData.status}
//                             onChange={handleEditInputChange}
//                             fullWidth
//                             margin="normal"
//                         />
//                         <TextField
//                             label="Requisition ID"
//                             type="number"
//                             name="requisitionId"
//                             value={editFormData.requisitionId}
//                             onChange={handleEditInputChange}
//                             fullWidth
//                             margin="normal"
//                         />
//                     </form>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={() => setEditDialogOpen(false)} color="primary">
//                         Cancel
//                     </Button>
//                     <Button onClick={handleUpdateOrder} color="primary">
//                         Update
//                     </Button>
//                 </DialogActions>
//             </Dialog>

//             {/* Add dialog */}
//             <Dialog
//                 open={addDialogOpen}
//                 onClose={() => setAddDialogOpen(false)}
//             >
//                 <DialogTitle>Add New Purchase Order</DialogTitle>
//                 <DialogContent>
//                     <form>
//                         <TextField
//                             label="Order Date"
//                             type="date"
//                             name="orderDate"
//                             value={newOrderData.orderDate}
//                             onChange={handleAddInputChange}
//                             fullWidth
//                             margin="normal"
//                             InputLabelProps={{
//                                 shrink: true,
//                             }}
//                         />
//                         <TextField
//                             label="Total Amount"
//                             type="number"
//                             name="totalAmount"
//                             value={newOrderData.totalAmount}
//                             onChange={handleAddInputChange}
//                             fullWidth
//                             margin="normal"
//                         />
//                         <TextField
//                             label="Status"
//                             name="status"
//                             value={newOrderData.status}
//                             onChange={handleAddInputChange}
//                             fullWidth
//                             margin="normal"
//                         />
//                         <TextField
//                             label="Requisition ID"
//                             type="number"
//                             name="requisitionId"
//                             value={newOrderData.requisitionId}
//                             onChange={handleAddInputChange}
//                             fullWidth
//                             margin="normal"
//                         />
//                     </form>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={() => setAddDialogOpen(false)} color="primary">
//                         Cancel
//                     </Button>
//                     <Button onClick={handleAddOrder} color="primary">
//                         Add
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </div>
//     );
// };

// export default PurchaseOrderList;

import React, { useState, useEffect } from 'react';
import {
    getPurchaseOrders,
    addPurchaseOrder,
    deletePurchaseOrder,
    updatePurchaseOrder
} from '../../services/purchase/purchaseOrderApiService';
import { getPurchaseRequisitions } from '../../services/purchase/purchaseRequisitionApiService'; // Import the service for purchase requisitions
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import TablePagination from '@mui/material/TablePagination';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DialogContentText from '@mui/material/DialogContentText';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const PurchaseOrderList = () => {
    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [purchaseRequisitions, setPurchaseRequisitions] = useState([]); // State to store purchase requisitions
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // State to manage snackbar severity
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editFormData, setEditFormData] = useState({
        id: '',
        orderDate: '',
        totalAmount: '',
        status: '',
        requisitionId: ''
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [newOrderData, setNewOrderData] = useState({
        orderDate: '',
        totalAmount: '',
        status: '',
        requisitionId: ''
    });

    const statusOptions = ['Draft', 'Approved', 'Rejected', 'Completed'];

    // Pagination states
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        const fetchPurchaseOrders = async () => {
            try {
                const data = await getPurchaseOrders();
                setPurchaseOrders(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchPurchaseRequisitions = async () => {
            try {
                const data = await getPurchaseRequisitions();
                setPurchaseRequisitions(data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchPurchaseOrders();
        fetchPurchaseRequisitions();
    }, []);

    const handleDelete = (order) => {
        setOrderToDelete(order);
        setDeleteConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (orderToDelete) {
            try {
                await deletePurchaseOrder(orderToDelete.id);
                setSnackbarMessage('Purchase deleted successfully!');
                setSnackbarSeverity('success');
                setPurchaseOrders(purchaseOrders.filter(order => order.id !== orderToDelete.id));
            } catch (error) {
                setSnackbarMessage('Failed to delete purchase.');
                setSnackbarSeverity('error');
            } finally {
                setSnackbarOpen(true);
                setDeleteConfirmOpen(false);
                setOrderToDelete(null);
            }
        }
    };

    const cancelDelete = () => {
        setDeleteConfirmOpen(false);
        setOrderToDelete(null);
    };

    const openEditDialog = (order) => {
        setSelectedOrder(order);
        setEditFormData({
            id: order.id,
            orderDate: new Date(order.orderDate).toISOString().split('T')[0],
            totalAmount: order.totalAmount,
            status: order.status,
            requisitionId: order.requisition.id
        });
        setEditDialogOpen(true);
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({ ...editFormData, [name]: value });
    };

    const handleUpdateOrder = async () => {
        try {
            const updatedOrder = {
                ...selectedOrder,
                orderDate: editFormData.orderDate,
                totalAmount: parseFloat(editFormData.totalAmount),
                status: editFormData.status,
                requisition: { id: editFormData.requisitionId }
            };

            await updatePurchaseOrder(updatedOrder.id, updatedOrder);
            setSnackbarMessage('Purchase updated successfully!');
            setSnackbarSeverity('success');
            setPurchaseOrders(purchaseOrders.map(o => (o.id === updatedOrder.id ? updatedOrder : o)));
            setEditDialogOpen(false);
        } catch (error) {
            setSnackbarMessage('Failed to update purchase.');
            setSnackbarSeverity('error');
        } finally {
            setSnackbarOpen(true);
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleAddInputChange = (e) => {
        const { name, value } = e.target;
        setNewOrderData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };
          

    const handleAddOrder = async () => {
        if (!newOrderData.orderDate || !newOrderData.totalAmount || !newOrderData.status || !newOrderData.requisitionId) {
            setSnackbarMessage('Please fill out all required fields.');
            setSnackbarOpen(true);
            return;
        }
    
        const newOrder = {
            orderDate: newOrderData.orderDate,
            totalAmount: parseFloat(newOrderData.totalAmount),
            status: newOrderData.status,
            requisition: { id: parseInt(newOrderData.requisitionId, 10) }
        };
    
        try {
            await addPurchaseOrder(newOrder);
            setSnackbarMessage('Purchase added successfully!');
            setSnackbarOpen(true);
            setAddDialogOpen(false);
            const data = await getPurchaseOrders();
            setPurchaseOrders(data);
        } catch (error) {
            setSnackbarMessage('Failed to add purchase.');
            setSnackbarOpen(true);
        }
    };
    
    

    const filteredOrders = purchaseOrders.filter(order =>
        order.id.toString().includes(searchQuery) ||
        new Date(order.orderDate).toLocaleDateString().includes(searchQuery) ||
        order.totalAmount.toString().includes(searchQuery) ||
        order.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.requisition.id.toString().includes(searchQuery)
    );

    const paginatedOrders = filteredOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
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
                <Tooltip title="Add Order">
                    <IconButton onClick={() => setAddDialogOpen(true)}>
                        <AddIcon />
                    </IconButton>
                </Tooltip>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            {!loading && !error && (
                <div>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Order Date</TableCell>
                                    <TableCell>Total Amount</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Requisition ID</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedOrders.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">
                                            No data available
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginatedOrders.map(order => (
                                        <TableRow key={order.id}>
                                            <TableCell>{order.id}</TableCell>
                                            <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                                            <TableCell>{order.totalAmount.toFixed(2)}</TableCell>
                                            <TableCell>{order.status}</TableCell>
                                            <TableCell>{order.requisition.id}</TableCell>
                                            <TableCell>
                                                <Tooltip title="Edit">
                                                    <IconButton onClick={() => openEditDialog(order)}>
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete">
                                                    <IconButton onClick={() => handleDelete(order)}>
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
                        component="div"
                        count={filteredOrders.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[5, 10, 25]}
                    />
                </div>
            )}

            {/* Add Order Dialog */}
            <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
                <DialogTitle>Add Purchase Order</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please fill in the details for the new purchase order.
                    </DialogContentText>
                    <TextField
                        margin="dense"
                        label="Order Date"
                        type="date"
                        name="orderDate"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={newOrderData.orderDate}
                        onChange={handleAddInputChange}
                    />
                    <TextField
                        margin="dense"
                        label="Total Amount"
                        type="number"
                        name="totalAmount"
                        fullWidth
                        value={newOrderData.totalAmount}
                        onChange={handleAddInputChange}
                    />
                    <TextField
                        margin="dense"
                        label="Status"
                        name="status"
                        fullWidth
                        select
                        value={newOrderData.status}
                        onChange={handleAddInputChange}
                    >
                        {statusOptions.map(status => (
                            <MenuItem key={status} value={status}>
                                {status}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        margin="dense"
                        label="Requisition ID"
                        name="requisitionId"
                        fullWidth
                        select
                        value={newOrderData.requisitionId}
                        onChange={handleAddInputChange}
                    >
                        {purchaseRequisitions.map(requisition => (
                            <MenuItem key={requisition.id} value={requisition.id}>
                                {requisition.id}
                            </MenuItem>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddOrder} variant="contained" color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>



            {/* Edit Order Dialog */}
            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
                <DialogTitle>Edit Purchase Order</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please edit the details for the purchase order.
                    </DialogContentText>
                    <TextField
                        margin="dense"
                        label="Order Date"
                        type="date"
                        name="orderDate"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={editFormData.orderDate}
                        onChange={handleEditInputChange}
                    />
                    <TextField
                        margin="dense"
                        label="Total Amount"
                        type="number"
                        name="totalAmount"
                        fullWidth
                        value={editFormData.totalAmount}
                        onChange={handleEditInputChange}
                    />
                    <TextField
                        margin="dense"
                        label="Status"
                        name="status"
                        fullWidth
                        select
                        value={editFormData.status}
                        onChange={handleEditInputChange}
                    >
                        {statusOptions.map(status => (
                            <MenuItem key={status} value={status}>
                                {status}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        margin="dense"
                        label="Requisition ID"
                        name="requisitionId"
                        fullWidth
                        select
                        value={editFormData.requisitionId}
                        onChange={handleEditInputChange}
                    >
                        {purchaseRequisitions.map(requisition => (
                            <MenuItem key={requisition.id} value={requisition.id}>
                                {requisition.id}
                            </MenuItem>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleUpdateOrder} variant="contained" color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>


            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteConfirmOpen} onClose={cancelDelete}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this purchase order?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelDelete}>Cancel</Button>
                    <Button onClick={confirmDelete} variant="contained" color="secondary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} variant="filled">
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default PurchaseOrderList;
