import PropTypes from 'prop-types';
import React from 'react';

const Filter = ({ filterText, setValue, count }) => {
  return (
    <div className="filter">
      <span className="filter__count">{count}</span>
      <input
        type="text"
        className="filter__input"
        value={filterText}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};

Filter.propTypes = {
  filterText: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  count: PropTypes.number.isRequired,
};

export default Filter;
