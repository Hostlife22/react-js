import React from 'react';
import {
  createTask,
  deleteTask,
  getTasksList,
  updateTask,
} from '../tasks.gateaway';
import CreateTaskInput from './CreateTaskInput';
import TasksList from './TasksList';

class TodoList extends React.Component {
  state = {
    tasks: [],
  };

  componentDidMount() {
    this.fetchTasksList();
  }

  fetchTasksList = () => {
    getTasksList().then((tasksList) => {
      this.setState({
        tasks: tasksList,
      });
    });
  };

  handleTaskStatusChange = (id) => {
    const { tasks } = this.state;
    const { done, text, createDate } = tasks.find((task) => task.id === id);
    const updatedTasks = {
      text,
      createDate,
      done: !done,
    };

    updateTask(id, updatedTasks).then(this.fetchTasksList);
  };

  handleTaskDelete = (id) => {
    deleteTask(id).then(this.fetchTasksList);
  };

  handleTaskCreate = (text) => {
    createTask({
      text,
      done: false,
      createdDate: new Date().toISOString(),
    }).then(this.fetchTasksList);
  };

  render() {
    return (
      <>
        <h1 className="title">Todo List</h1>
        <main className="todo-list">
          <CreateTaskInput onCreate={this.handleTaskCreate} />
          <TasksList
            tasks={this.state.tasks}
            handleTaskStatusChange={this.handleTaskStatusChange}
            handleTaskDelete={this.handleTaskDelete}
          />
        </main>
      </>
    );
  }
}

export default TodoList;
