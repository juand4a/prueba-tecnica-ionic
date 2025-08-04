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

export async function initDB(): Promise<SQLiteDBConnection> {
  if (db) return db;

  await sqliteConn.checkConnectionsConsistency();

  const isConn = (await sqliteConn.isConnection(DB_NAME, false)).result;
  db = isConn
    ? await sqliteConn.retrieveConnection(DB_NAME, false)
    : await sqliteConn.createConnection(DB_NAME, false, 'no-encryption', 1, false);

  await db.open();

  const createTasksTable = `
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY NOT NULL,
      task TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0,
      synced INTEGER NOT NULL DEFAULT 0
    );`;

  const createSyncTable = `
    CREATE TABLE IF NOT EXISTS sync_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      task_id INTEGER,
      task TEXT,
      completed INTEGER
    );`;

  await db.execute(createTasksTable);
  await db.execute(createSyncTable);

  return db;
}

export async function saveTodo(task: string): Promise<number> {
  const database = await initDB();
  const stmt = 'INSERT INTO tasks (task, completed, synced) VALUES (?, ?, ?);';
  const values = [task, 0, 0];
  const res = await database.run(stmt, values);

  const newId = res.changes?.lastId ?? -1;
  await database.run(
    'INSERT INTO sync_queue (action, task_id, task, completed) VALUES (?, ?, ?, ?);',
    ['create', newId, task, 0]
  );

  return newId;
}

export async function getTodos(): Promise<Todo[]> {
  const database = await initDB();
  const res = await database.query('SELECT * FROM tasks ORDER BY id DESC;');
  return res.values as Todo[];
}

export async function getUnsyncedTodos(): Promise<Todo[]> {
  const database = await initDB();
  const res = await database.query('SELECT * FROM tasks WHERE synced = 0;');
  return res.values as Todo[];
}

export async function markTodoAsSynced(id: number): Promise<void> {
  const database = await initDB();
  await database.run('UPDATE tasks SET synced = 1 WHERE id = ?;', [id]);
}

export async function updateTodo(id: number, task: string, synced: boolean = false): Promise<void> {
  const database = await initDB();
  await database.run('UPDATE tasks SET task = ?, synced = ? WHERE id = ?;', [
    task,
    synced ? 1 : 0,
    id,
  ]);
  await database.run(
    'INSERT INTO sync_queue (action, task_id, task) VALUES (?, ?, ?);',
    ['update', id, task]
  );
}

export async function deleteTodo(id: number): Promise<void> {
  const database = await initDB();
  await database.run('DELETE FROM tasks WHERE id = ?;', [id]);
  await database.run(
    'INSERT INTO sync_queue (action, task_id) VALUES (?, ?);',
    ['delete', id]
  );
}

export async function toggleComplete(id: number, completed: boolean): Promise<void> {
  const database = await initDB();
  await database.run('UPDATE tasks SET completed = ?, synced = 0 WHERE id = ?;', [
    completed ? 1 : 0,
    id,
  ]);
  await database.run(
    'INSERT INTO sync_queue (action, task_id, completed) VALUES (?, ?, ?);',
    ['toggle', id, completed ? 1 : 0]
  );
}

export async function clearLocalTodos(): Promise<void> {
  const database = await initDB();
  await database.execute('DELETE FROM tasks');
}

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getSyncQueue(): Promise<any[]> {
  const database = await initDB();
  const res = await database.query('SELECT * FROM sync_queue ORDER BY id ASC');
  return res.values || [];
}

export async function clearSyncQueue(): Promise<void> {
  const database = await initDB();
  await database.execute('DELETE FROM sync_queue');
}
