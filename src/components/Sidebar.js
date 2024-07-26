import React from 'react';
import { Link } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CategoryIcon from '@mui/icons-material/Category';
import './Sidebar.css'; // Ensure you have CSS for sidebar
import { Dashboard } from '@mui/icons-material';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link to="/">
            <Dashboard /> Dashboard
          </Link>
        </li>
        <li>
          <Link to="/purchasing">
            <ShoppingCartIcon /> Purchasing
          </Link>
        </li>
        <li>
          <Link to="/sales">
            <ListAltIcon /> Sales
          </Link>
        </li>
        <li>
          <Link to="/manufacturing">
            <ReceiptIcon /> Manufacturing
          </Link>
        </li>
        <li>
          <Link to="/accounting">
            <CategoryIcon /> Accounting
          </Link>
        </li>
        <li>
          <Link to="/fixed-assets">
            <CategoryIcon /> Fixed Assets
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
