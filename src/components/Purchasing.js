import React, { useState, useEffect } from 'react';
import { getPurchases, addPurchase, updatePurchase, deletePurchase } from '../services/apiService';
import './Purchasing.css';
import { Modal, Button, Form, Table } from 'react-bootstrap';

const Purchasing = () => {
  const [purchases, setPurchases] = useState([]);
  const [filteredPurchases, setFilteredPurchases] = useState([]);
  const [show, setShow] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false); // New state for delete confirmation
  const [item, setItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [currentId, setCurrentId] = useState(null);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null); // New state for delete ID

  useEffect(() => {
    fetchPurchases();
  }, []);

  useEffect(() => {
    filterPurchases();
  }, [purchases, search]);

  const fetchPurchases = async () => {
    try {
      const response = await getPurchases();
      if (response && Array.isArray(response.data)) {
        setPurchases(response.data);
      } else {
        console.error('Unexpected data format:', response);
        setPurchases([]);
      }
    } catch (error) {
      console.error('Error fetching purchases:', error);
      setPurchases([]);
    }
  };

  const filterPurchases = () => {
    if (search.trim() === '') {
      setFilteredPurchases(purchases);
    } else {
      setFilteredPurchases(
        purchases.filter((purchase) =>
          purchase.item.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const newPurchase = { item, quantity: parseInt(quantity), price: parseFloat(price) };
      await addPurchase(newPurchase);
      setItem('');
      setQuantity('');
      setPrice('');
      setShow(false); // Close modal
      fetchPurchases(); // Refresh the list
    } catch (error) {
      console.error('Error adding purchase:', error);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedPurchase = { item, quantity: parseInt(quantity), price: parseFloat(price) };
      await updatePurchase(currentId, updatedPurchase);
      setItem('');
      setQuantity('');
      setPrice('');
      setShowUpdate(false); // Close modal
      fetchPurchases(); // Refresh the list
    } catch (error) {
      console.error('Error updating purchase:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePurchase(deleteId);
      setDeleteId(null); // Clear delete ID
      setShowConfirmDelete(false); // Close confirmation modal
      fetchPurchases(); // Refresh the list
    } catch (error) {
      console.error('Error deleting purchase:', error);
    }
  };

  const handleUpdateClick = (purchase) => {
    setCurrentId(purchase.id);
    setItem(purchase.item);
    setQuantity(purchase.quantity);
    setPrice(purchase.price);
    setShowUpdate(true);
  };

  const openConfirmDelete = (id) => {
    setDeleteId(id);
    setShowConfirmDelete(true);
  };

  return (
    <div className="purchasing-container">
      <h1>Purchases List</h1>
      <div className="header-row">
        <div className="search-container">
          <Form.Control
            type="text"
            placeholder="Search by item"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="button-container">
          <Button variant="primary" onClick={() => setShow(true)}>
            Add Purchase
          </Button>
        </div>
      </div>
      <Table striped bordered hover className="purchasing-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Item</th>
            <th>Quantity</th>
            <th>Price</th>
            <th className="actions-column">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(filteredPurchases) && filteredPurchases.length > 0 ? (
            filteredPurchases.map((purchase) => (
              <tr key={purchase.id}>
                <td>{purchase.id}</td>
                <td>{purchase.item}</td>
                <td>{purchase.quantity}</td>
                <td>{purchase.price}</td>
                <td className="actions-column">
                  <Button variant="link" onClick={() => handleUpdateClick(purchase)}>
                    <i className="fas fa-edit"></i>
                  </Button>
                  <Button variant="link" onClick={() => openConfirmDelete(purchase.id)} className="delete-btn">
                    <i className="fas fa-trash"></i>
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No purchases available.</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Modal for adding new purchase */}
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Purchase</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddSubmit}>
            <Form.Group controlId="formItem">
              <Form.Label>Item</Form.Label>
              <Form.Control
                type="text"
                value={item}
                onChange={(e) => setItem(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formQuantity">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </Form.Group>
            <div className="modal-buttons">
              <Button variant="secondary" onClick={() => setShow(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Add Purchase
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal for updating purchase */}
      <Modal show={showUpdate} onHide={() => setShowUpdate(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Purchase</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateSubmit}>
            <Form.Group controlId="formItem">
              <Form.Label>Item</Form.Label>
              <Form.Control
                type="text"
                value={item}
                onChange={(e) => setItem(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formQuantity">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </Form.Group>
            <div className="modal-buttons">
              <Button variant="secondary" onClick={() => setShowUpdate(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Update Purchase
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal for confirming delete */}
      <Modal show={showConfirmDelete} onHide={() => setShowConfirmDelete(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this purchase?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmDelete(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Purchasing;
