import React, { Component } from 'react';
import CreateTaskInput from './CreateTaskInput';
import Task from './Task';
import {
  createTask,
  deleteTask,
  fetchTasksList,
  updateTask,
} from './tasksGateaway';

class TasksList extends Component {
  state = {
    tasks: [],
  };

  componentDidMount() {
    this.fetchTasks();
  }

  fetchTasks = () => {
    fetchTasksList().then((tasksList) => {
      this.setState({
        tasks: tasksList,
      });
    });
  };

  onCreate = (text) => {
    const newTask = {
      text,
      done: false,
      createdDate: new Date().toISOString(),
    };

    createTask(newTask).then(() => this.fetchTasks());
  };

  handleTaskStatusChange = (id) => {
    const { done, text, createDate } = this.state.tasks.find(
      (task) => task.id === id
    );
    const finishDate = !done ? new Date().toISOString() : null;

    const updatedTasks = {
      text,
      createDate,
      finishDate,
      done: !done,
    };

    updateTask(id, updatedTasks).then(() => this.fetchTasks());
  };

  handleTaskDelete = (id) => {
    deleteTask(id).then(() => this.fetchTasks());
  };

  compareTasks = (a, b) => {
    if (a.done - b.done !== 0) {
      return a.done - b.done;
    }
    if (a.done) {
      return new Date(b.finishDate) - new Date(a.finishDate);
    }
    return new Date(b.createdDate) - new Date(a.createdDate);
  };

  render() {
    const sortedList = this.state.tasks.slice().sort(this.compareTasks);

    return (
      <div className="todo-list">
        <CreateTaskInput onCreate={this.onCreate} />
        <ul className="list">
          {sortedList.map((task) => (
            <Task
              key={task.id}
              {...task}
              onChange={this.handleTaskStatusChange}
              onDelete={this.handleTaskDelete}
            />
          ))}
        </ul>
      </div>
    );
  }
}

export default TasksList;
