# 📱 Tareas Offline con Ionic + SQLite + Sincronización

Aplicación móvil de tareas desarrollada con **Ionic React**, diseñada para funcionar completamente **offline** gracias a **SQLite local**, y con capacidad de sincronizar automáticamente con un backend cuando haya conexión a internet.

---

## 🚀 Características

- ✅ Crear, editar, completar y eliminar tareas.
- 📴 Funciona completamente sin conexión (offline-first).
- 🔄 Sincronización automática cada 30 segundos al detectar conexión.
- 🔘 Botón para forzar sincronización manual desde la interfaz.
- 📥 Cola de sincronización (`sync_queue`) para manejar tareas pendientes.

---

## 🧰 Tecnologías utilizadas

- **Ionic React** – Framework para apps híbridas.
- **@capacitor-community/sqlite** – Base de datos local persistente.
- **Axios** – Cliente HTTP para sincronizar con el backend.
- **Capacitor Network** – Para detectar el estado de conexión.
- **Backend REST API** – Compatible con Node.js/Express o cualquier stack similar.

---

## 📦 Instalación y configuración

### 1. Clona el repositorio

```bash
git clone https://tu-repo.git
cd nombre-del-proyecto
2. Instala las dependencias

npm install
3. Configura la URL del backend
Edita el archivo services/todoService.ts y reemplaza la IP por la de tu servidor local:

const API_URL = 'http://TU_IP_LOCAL:3000/api/task';
Ejemplo:


const API_URL = 'http://192.168.1.58:3000/api/task';
Asegúrate de que tu backend esté corriendo en esa IP y puerto (por ejemplo con npm run dev en Express).

4. Sincroniza Capacitor con Android

ionic build
npx cap sync android
5. Abre el proyecto en Android Studio

npx cap open android
