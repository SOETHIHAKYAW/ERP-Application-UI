import React from 'react';
import PropTypes from 'prop-types';

const Input = ({ label, type = 'text', name, value, onChange, required = false }) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="form-control"
      />
    </div>
  );
};

Input.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
};

export default Input;
