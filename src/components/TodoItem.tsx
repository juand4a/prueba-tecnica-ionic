import './TodoItem.css';
import React from 'react';
import { IonItem, IonLabel, IonCheckbox, IonButton } from '@ionic/react';


interface TodoItemProps {
  todo: { id: number; task: string; completed: boolean };
  onToggleComplete: (id: number, completed: boolean) => void;
  onEdit: (id: number, newTask: string) => void;
  onDelete: (id: number) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggleComplete, onEdit, onDelete }) => {
  return (
    <IonItem detail={false} className={`card ${todo.completed ? 'completed' : ''}`}>
      <IonLabel>{todo.task}</IonLabel>
      <IonCheckbox
        checked={todo.completed}
        onIonChange={() => onToggleComplete(todo.id, todo.completed)}
      />
      <IonButton onClick={() => onEdit(todo.id, todo.task)}>
        Edit
      </IonButton>
      <IonButton color="danger" onClick={() => onDelete(todo.id)}>
        Delete
      </IonButton>
    </IonItem>
  );
};

export default TodoItem;
