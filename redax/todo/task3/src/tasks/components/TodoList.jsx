import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import * as tasksAction from '../tasks.actions';
import { sortedTasksListSelector } from '../tasks.selectors';
import CreateTaskInput from './CreateTaskInput';
import TasksList from './TasksList';

const TodoList = ({
  getTasksList,
  createTask,
  tasks,
  updateTask,
  deleteTask,
}) => {
  useEffect(() => {
    getTasksList();
  }, []);

  return (
    <>
      <h1 className="title">Todo List</h1>
      <main className="todo-list">
        <CreateTaskInput onCreate={createTask} />
        <TasksList
          tasks={tasks}
          handleTaskStatusChange={updateTask}
          handleTaskDelete={deleteTask}
        />
      </main>
    </>
  );
};

TodoList.propTypes = {
  getTasksList: PropTypes.func.isRequired,
  createTask: PropTypes.func.isRequired,
  updateTask: PropTypes.func.isRequired,
  deleteTask: PropTypes.func.isRequired,
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      done: PropTypes.bool,
      id: PropTypes.string,
      createDate: PropTypes.string,
    })
  ),
};

const mapState = (state) => {
  return {
    tasks: sortedTasksListSelector(state),
  };
};

const mapDispatch = {
  getTasksList: tasksAction.getTasksList,
  updateTask: tasksAction.updateTask,
  deleteTask: tasksAction.deleteTask,
  createTask: tasksAction.createTask,
};

export default connect(mapState, mapDispatch)(TodoList);
