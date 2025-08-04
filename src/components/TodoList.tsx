import React from 'react';
import { IonList, IonItem, IonLabel } from '@ionic/react';
import TodoItem from './TodoItem';
import './TodoList.css';

interface TodoListProps {
  todos: { id: number; task: string; completed: boolean }[];
  onToggleComplete: (id: number, completed: boolean) => void;
  onEdit: (id: number, newTask: string) => void;
  onDelete: (id: number) => void;
}

const TodoList: React.FC<TodoListProps> = ({
  todos,
  onToggleComplete,
  onEdit,
  onDelete
}) => {
  return (
    <IonList className="todo-list">
      {todos.length === 0 && (
        <IonItem className="empty">
          <IonLabel>No hay tareas</IonLabel>
        </IonItem>
      )}
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </IonList>
  );
};

export default TodoList;
