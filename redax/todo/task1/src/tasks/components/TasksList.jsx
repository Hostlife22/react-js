import PropTypes from 'prop-types';
import React from 'react';
import Task from './Task';

const TasksList = ({ tasks, handleTaskStatusChange, handleTaskDelete }) => {
  const sortedList = tasks.slice().sort((a, b) => a.done - b.done);

  return (
    <ul className="list">
      {sortedList.map((task) => (
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
