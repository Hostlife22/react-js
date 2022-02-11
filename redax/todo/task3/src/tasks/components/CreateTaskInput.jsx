import PropTypes from 'prop-types';
import React, { useState } from 'react';

const CreateTaskInput = ({ onCreate }) => {
  const [value, setValue] = useState('');

  const handleTaskCreate = () => {
    onCreate(value);
    setValue('');
  };

  return (
    <div className="create-task">
      <input
        type="text"
        value={value}
        className="create-task__input"
        onChange={(e) => setValue(e.target.value)}
      />
      <button className="create-task__btn btn" onClick={handleTaskCreate}>
        Create
      </button>
    </div>
  );
};

CreateTaskInput.propTypes = {
  onCreate: PropTypes.func.isRequired,
};

export default CreateTaskInput;
