import React from 'react';
import PropTypes from 'prop-types';

const Table = ({ data, columns, renderRow }) => {
  return (
    <table className="table">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.header}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>{data.map(renderRow)}</tbody>
    </table>
  );
};

Table.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string.isRequired,
      accessor: PropTypes.string.isRequired,
    })
  ).isRequired,
  renderRow: PropTypes.func.isRequired,
};

export default Table;
