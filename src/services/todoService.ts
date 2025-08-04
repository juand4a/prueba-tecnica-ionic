import axios from 'axios';

const API_URL = 'http://192.168.1.58:3000/api/task';

export const getTodos = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching todos:', error);
  }
};

export const createTodo = async (task: string) => {
  try {
    const response = await axios.post(API_URL, { task });
    return response.data;
  } catch (error) {
    console.error('Error creating todo:', error);
  }
};

export const updateTodo = async (id: number, task: string) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, { task });
    return response.data;
  } catch (error) {
    console.error('Error updating todo:', error);
  }
};

export const deleteTodo = async (id: number) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error('Error deleting todo:', error);
  }
};

export const toggleComplete = async (id: number, completed: boolean) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, { completed });
    return response.data;
  } catch (error) {
    console.error('Error toggling completion:', error);
  }
};
