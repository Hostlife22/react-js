const baseUrl = 'https://61c8c4dcadee460017260de8.mockapi.io/api/v1/tasks';

export const createTask = (taskData) => {
  return fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(taskData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error();
      }
    })
    .catch((e) => {
      alert('Faild to create task');
      console.error(e);
    });
};

export const getTasksList = () => {
  return fetch(baseUrl)
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
      throw new Error();
    })
    .catch((e) => {
      alert('Faild to get taskList');
      console.error(e);
    });
};

export const updateTask = (taskId, taskData) => {
  return fetch(`${baseUrl}/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(taskData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error();
      }
    })
    .catch((e) => {
      alert('Faild to update task');
      console.error(e);
    });
};

export const deleteTask = (taskId) => {
  return fetch(`${baseUrl}/${taskId}`, {
    method: 'DELETE',
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error();
      }
    })
    .catch((e) => {
      alert('Failed to delete task');
      console.error(e);
    });
};
