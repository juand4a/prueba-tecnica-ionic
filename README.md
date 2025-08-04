# 📱 Tareas Offline con Ionic + SQLite + Sincronización

Este proyecto es una aplicación de tareas desarrollada con **Ionic React**, con soporte **offline-first** mediante **SQLite local**, que se sincroniza automáticamente con un backend REST API cuando hay conexión a internet.

---

## 🚀 Características

- ✔️ Agregar, editar, completar y eliminar tareas.
- 🔌 Funciona completamente **sin conexión**.
- 🔄 Sincronización automática cada 30 segundos cuando hay internet.
- ☁️ Sincronización manual disponible desde el botón en la interfaz.
- 📚 Cola de acciones (`sync_queue`) para asegurar integridad al reconectarse.

---

## 🧩 Tecnologías

- **Ionic React** (UI + mobile)
- **Capacitor SQLite** (`@capacitor-community/sqlite`)
- **Axios** (peticiones HTTP)
- **Backend API REST** (Node.js o cualquier compatible)
- **Capacitor Network** (detección de conexión)

---

## 📦 Instalación

### 1. Clona el repositorio

### 1. cambia la url de la api por tu ip
en todoservice.ts const API_URL = 'http://192.168.1.58:3000/api/task';

ajecuta  > ionic cap sync android
ionic cap open android
recuerda que debes tener android studio

y recuerda corred npm i para instalar las dependencias
