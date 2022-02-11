import * as tasksGateway from './tasks.gateaway';
import { tasksListSelector } from './tasks.selectors';

export const TASKS_LIST_RECIEVED = 'TASKS_LIST_RECIEVED';
export const UPDATE_TASKS_LIST = 'UPDATE_TASKS_LIST';
export const DELETE_TASK_ITEM = 'DELETE_TASK_ITEM';
export const CREATE_TASK_ITEM = 'CREATE_TASK_ITEM';

export const tasksListRecieved = (tasksList) => {
  return {
    type: TASKS_LIST_RECIEVED,
    payload: {
      tasksList,
    },
  };
};

export const updateTaskAction = (task) => {
  return {
    type: UPDATE_TASKS_LIST,
    payload: {
      task,
    },
  };
};

export const deleteTaskAction = (taskId) => {
  return {
    type: DELETE_TASK_ITEM,
    payload: {
      taskId,
    },
  };
};

export const createTaskAction = (task) => {
  return {
    type: CREATE_TASK_ITEM,
    payload: {
      task,
    },
  };
};

export const getTasksList = () => {
  return function (dispatch) {
    tasksGateway
      .fetchTasksList()
      .then((tasksList) => dispatch(tasksListRecieved(tasksList)));
  };
};

export const updateTask = (taskId) => {
  return function (dispatch, getState) {
    const state = getState();
    const tasksList = tasksListSelector(state);
    const task = tasksList.find((task) => task.id === taskId);
    const updatedTasks = {
      ...task,
      done: !task.done,
    };
    tasksGateway
      .updateTask(taskId, updatedTasks)
      .then(() => dispatch(updateTaskAction(updatedTasks)));
  };
};

export const deleteTask = (taskId) => {
  return function (dispatch) {
    tasksGateway
      .deleteTask(taskId)
      .then(() => dispatch(deleteTaskAction(taskId)));
  };
};

export const createTask = (text) => {
  return function (dispatch) {
    const taskData = {
      text,
      done: false,
      createdDate: new Date().toISOString(),
    };

    tasksGateway
      .createTask(taskData)
      .then((task) => dispatch(createTaskAction(task)));
  };
};
