import PropTypes from 'prop-types';
import React from 'react';
import Task from './Task';

const TasksList = ({ tasks, handleTaskStatusChange, handleTaskDelete }) => {
  return (
    <ul className="list">
      {tasks.map((task) => (
        <Task
          key={task.id}
          {...task}
          onChange={handleTaskStatusChange}
          onDelete={handleTaskDelete}
        />
      ))}
    </ul>
  );
};

TasksList.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      done: PropTypes.bool,
      id: PropTypes.string,
    })
  ).isRequired,
};

export default TasksList;
