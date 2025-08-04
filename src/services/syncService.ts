import {
  getUnsyncedTodos,
  markTodoAsSynced,
  overwriteLocalTasks,
} from './localStorage';
import {
  createTodo as createTodoAPI,
  getTodos as getTodosAPI,
} from './todoService';

export const syncLocalToRemote = async () => {
  const unsynced = await getUnsyncedTodos();
  for (const todo of unsynced) {
    try {
      await createTodoAPI(todo.task); // Asumes que backend genera ID
      await markTodoAsSynced(todo.id);
    } catch (e) {
      console.error('Fallo al subir tarea:', todo.task, e);
    }
  }
};

export const syncRemoteToLocal = async () => {
  try {
    const response = await getTodosAPI();
    const tareas = Array.isArray(response.tasks) ? response.tasks : [];
    await overwriteLocalTasks(tareas);
  } catch (e) {
    console.error('Error al sincronizar desde backend', e);
  }
};

export const fullSync = async () => {
  await syncLocalToRemote();
  await syncRemoteToLocal();
};
