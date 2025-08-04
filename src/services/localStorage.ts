import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from '@capacitor-community/sqlite';

export interface Todo {
  id: number;
  task: string;
  completed: number;
  synced: number;
}

const sqliteConn = new SQLiteConnection(CapacitorSQLite);
let db: SQLiteDBConnection | undefined;
const DB_NAME = 'tasksDB';

/**
 * Inicializa la base de datos y la conexión SQLite
 */
export async function initDB(): Promise<SQLiteDBConnection> {
  if (db) {
    return db;
  }

  await sqliteConn.checkConnectionsConsistency();

  const isConn = (await sqliteConn.isConnection(DB_NAME, false)).result;
  db = isConn
    ? await sqliteConn.retrieveConnection(DB_NAME, false)
    : await sqliteConn.createConnection(DB_NAME, false, 'no-encryption', 1, false);

  await db.open();

  const createStmt = `
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY NOT NULL,
      task TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0,
      synced INTEGER NOT NULL DEFAULT 0
    );
  `;

  await db.execute(createStmt);

  return db;
}

/**
 * Guarda una tarea nueva (no sincronizada)
 */
export async function saveTodo(task: string): Promise<number> {
  const database = await initDB();
  const stmt = 'INSERT INTO tasks (task, completed, synced) VALUES (?, ?, ?);';
  const values = [task, 0, 0];
  const res = await database.run(stmt, values);
  return res.changes?.lastId ?? -1;
}

/**
 * Devuelve todas las tareas almacenadas localmente
 */
export async function getTodos(): Promise<Todo[]> {
  const database = await initDB();
  const stmt = 'SELECT * FROM tasks ORDER BY id DESC;';
  const res = await database.query(stmt);
  return res.values as Todo[];
}

/**
 * Devuelve solo las tareas no sincronizadas (para enviar al backend)
 */
export async function getUnsyncedTodos(): Promise<Todo[]> {
  const database = await initDB();
  const stmt = 'SELECT * FROM tasks WHERE synced = 0;';
  const res = await database.query(stmt);
  return res.values as Todo[];
}

/**
 * Marca una tarea como sincronizada después de enviarla al backend
 */
export async function markTodoAsSynced(id: number): Promise<void> {
  const database = await initDB();
  const stmt = 'UPDATE tasks SET synced = 1 WHERE id = ?;';
  await database.run(stmt, [id]);
}

/**
 * Actualiza el texto de una tarea y la marca como no sincronizada
 */
export async function updateTodo(
  id: number,
  task: string,
  synced: boolean = false
): Promise<void> {
  const database = await initDB();
  const stmt = 'UPDATE tasks SET task = ?, synced = ? WHERE id = ?;';
  const values = [task, synced ? 1 : 0, id];
  await database.run(stmt, values);
}

/**
 * Elimina una tarea local por ID
 */
export async function deleteTodo(id: number): Promise<void> {
  const database = await initDB();
  const stmt = 'DELETE FROM tasks WHERE id = ?;';
  await database.run(stmt, [id]);
}

/**
 * Cambia el estado completado de una tarea
 */
export async function toggleComplete(id: number, completed: boolean): Promise<void> {
  const database = await initDB();
  const stmt = 'UPDATE tasks SET completed = ?, synced = 0 WHERE id = ?;';
  const values = [completed ? 1 : 0, id];
  await database.run(stmt, values);
}

/**
 * Elimina todas las tareas locales (usado para sobrescribir desde el backend)
 */
export async function clearLocalTodos(): Promise<void> {
  const database = await initDB();
  await database.execute('DELETE FROM tasks');
}

/**
 * Sobrescribe todas las tareas locales con las tareas del backend
 */
export async function overwriteLocalTasks(todos: Todo[]): Promise<void> {
  const database = await initDB();
  await clearLocalTodos();
  for (const todo of todos) {
    await database.run(
      'INSERT INTO tasks (id, task, completed, synced) VALUES (?, ?, ?, ?);',
      [todo.id, todo.task, todo.completed, 1]
    );
  }
}
