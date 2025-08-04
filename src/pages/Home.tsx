
import './Home.css';
import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonCheckbox,
  IonToast,
  IonCard,
  IonCardContent,
} from '@ionic/react';

import {
  initDB,
  getTodos as getLocalTodos,
  saveTodo,
  updateTodo,
  deleteTodo as deleteLocalTodo,
  toggleComplete as toggleLocalComplete,
} from '../services/localStorage';
import { isOnline } from '../services/networkService';
import { fullSync } from '../services/syncService';

interface Todo {
  id: number;
  task: string;
  completed: number;
  synced: number;
}

const Home: React.FC = () => {
  const [task, setTask] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [showToast, setShowToast] = useState(false);

useEffect(() => {
  let syncInterval: NodeJS.Timeout;

  const init = async () => {
    await initDB();
    const online = await isOnline();

    if (online) {
      await fullSync();
    }

    const local = await getLocalTodos();
    setTodos(local);
  };

  const trySync = async () => {
    const online = await isOnline();
    if (!online) return;

    try {
      await fullSync();
      const updated = await getLocalTodos();
      setTodos(updated);
      console.log('[SYNC] Sincronización exitosa');
    } catch (err) {
      console.warn('[SYNC] Error al sincronizar:', err);
    }
  };

  // Ejecutar al montar
  init();

  // Iniciar intervalo de sincronización cada 30 segundos
  // eslint-disable-next-line prefer-const
  syncInterval = setInterval(trySync, 30000); // 30000ms = 30s

  // Limpiar al desmontar
  return () => {
    if (syncInterval) {
      clearInterval(syncInterval);
    }
  };
}, []);

  const handleCreate = async () => {
    if (!task.trim()) return;
    try {
      await saveTodo(task);
      setTask('');
      setShowToast(true);
      const local = await getLocalTodos();
      setTodos(local);
    } catch (e) {
      console.error('Error al guardar tarea local', e);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteLocalTodo(id);
      const local = await getLocalTodos();
      setTodos(local);
    } catch (e) {
      console.error('Error al eliminar tarea local', e);
    }
  };

  const handleToggleComplete = async (id: number, completed: number) => {
    try {
      await toggleLocalComplete(id, completed !== 1);
      const local = await getLocalTodos();
      setTodos(local);
    } catch (e) {
      console.error('Error al marcar completado local', e);
    }
  };

  const handleEdit = async (id: number) => {
    const current = todos.find(t => t.id === id);
    if (!current) return;
    const newText = prompt('Editar tarea', current.task);
    if (!newText?.trim()) return;

    try {
      await updateTodo(id, newText, false); // synced = false
      const local = await getLocalTodos();
      setTodos(local);
    } catch (e) {
      console.error('Error al editar tarea local', e);
    }
  };

  const handleForceSync = async () => {
    const online = await isOnline();
    if (!online) {
      alert('No hay conexión a internet para sincronizar.');
      return;
    }

    await fullSync();
    const updated = await getLocalTodos();
    setTodos(updated);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="toolbar-custom">
          <IonTitle>Mis Tareas</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="content-custom">
        <form
          className="form-container"
          onSubmit={e => {
            e.preventDefault();
            handleCreate();
          }}
        >
          <IonList lines="full">
            <IonItem className="item-custom">
              <IonLabel position="stacked">Nueva Tarea</IonLabel>
              <IonInput
                placeholder="Escribe tu tarea..."
                value={task}
                onIonChange={e => setTask(e.detail.value!)}
                maxlength={255}
                required
              />
            </IonItem>
          </IonList>
          <div className="button-container">
            <IonButton expand="block" type="submit">
              Añadir
            </IonButton>
            <IonButton expand="block" color="medium" onClick={handleForceSync}>
              Sincronizar Manualmente
            </IonButton>
          </div>
        </form>

        <IonToast
          isOpen={showToast}
          message="¡Tarea añadida!"
          duration={2000}
          onDidDismiss={() => setShowToast(false)}
        />

        <IonList className="todo-list">
          {todos.length === 0 ? null : todos.map(todo => (
            <IonCard key={todo.id} className="todo-card">
              <IonCardContent className="todo-card-content">
                <div className="todo-item">
                  <span className={`todo-text ${todo.completed === 1 ? 'completed' : ''}`}>
                    {todo.task}
                  </span>
                  <div className="actions">
                    <IonCheckbox
                      checked={todo.completed === 1}
                      onIonChange={() =>
                        handleToggleComplete(todo.id, todo.completed)
                      }
                    />
                    <IonButton size="small" fill="clear" onClick={() => handleEdit(todo.id)}>
                      ✏️
                    </IonButton>
                    <IonButton size="small" fill="clear" onClick={() => handleDelete(todo.id)}>
                      🗑️
                    </IonButton>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Home;
