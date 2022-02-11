import {
  CREATE_TASK_ITEM,
  DELETE_TASK_ITEM,
  TASKS_LIST_RECIEVED,
  UPDATE_TASKS_LIST,
} from './tasks.actions';

const initialState = {
  tasksList: [],
};

const tasksReducer = (state = initialState, action) => {
  switch (action.type) {
    case TASKS_LIST_RECIEVED: {
      return {
        ...state,
        tasksList: action.payload.tasksList,
      };
    }

    case CREATE_TASK_ITEM: {
      return {
        ...state,
        tasksList: state.tasksList.concat(action.payload.task),
      };
    }

    case UPDATE_TASKS_LIST: {
      const newTasks = state.tasksList.map((task) =>
        task.id === action.payload.task.id ? action.payload.task : task
      );
      return {
        ...state,
        tasksList: newTasks,
      };
    }
    case DELETE_TASK_ITEM: {
      const newTasks = state.tasksList.filter(
        (task) => task.id !== action.payload.taskId
      );
      return {
        ...state,
        tasksList: newTasks,
      };
    }

    default:
      return state;
  }
};

export default tasksReducer;
