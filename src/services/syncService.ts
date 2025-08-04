import {
  getSyncQueue,
  clearSyncQueue,
  markTodoAsSynced,
  overwriteLocalTasks,
} from './localStorage';

import {
  createTodo as createTodoAPI,
  updateTodo as updateTodoAPI,
  deleteTodo as deleteTodoAPI,
  toggleComplete as toggleCompleteAPI,
  getTodos as getTodosAPI,
} from './todoService';

/**
 * Procesa cada entrada en la tabla sync_queue y realiza llamadas al backend según la acción
 */
export const syncLocalToRemote = async () => {
  const queue = await getSyncQueue();

  for (const entry of queue) {
    const { action, task_id, task, completed } = entry;

    try {
      switch (action) {
        case 'create':
          await createTodoAPI(task);
          await markTodoAsSynced(task_id);
          break;
        case 'update':
          await updateTodoAPI(task_id, task);
          await markTodoAsSynced(task_id);
          break;
        case 'delete':
          await deleteTodoAPI(task_id);
          break;
        case 'toggle':
          await toggleCompleteAPI(task_id, completed === 1);
          await markTodoAsSynced(task_id);
          break;
        default:
          console.warn(`Acción desconocida en sync_queue: ${action}`);
      }
    } catch (err) {
      console.error(`Error al sincronizar acción '${action}' para tarea ${task_id}`, err);
    }
  }

  await clearSyncQueue();
};

/**
 * Trae las tareas del backend y reemplaza las locales
 */
export const syncRemoteToLocal = async () => {
  try {
    const response = await getTodosAPI();
    const tareas = Array.isArray(response.tasks) ? response.tasks : [];
    await overwriteLocalTasks(tareas);
  } catch (e) {
    console.error('Error al sincronizar desde backend', e);
  }
};

/**
 * Sincronización completa: sube y luego baja
 */
export const fullSync = async () => {
  await syncLocalToRemote();
  await syncRemoteToLocal();
};
