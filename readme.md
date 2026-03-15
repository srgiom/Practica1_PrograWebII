# Practica 1 - Programación Web II

Frontend + backend para gestion de productos y usuarios con autenticacion JWT y roles.

- Backend: Node.js, Express, MongoDB, JWT, Swagger, Redis (opcional)
- Frontend: Svelte 5 + Vite

---

## Tabla de contenido
1. [Objetivo](#objetivo)
2. [Stack y estructura](#stack-y-estructura)
3. [Instalacion y ejecucion (paso a paso)](#instalacion-y-ejecucion-paso-a-paso)
4. [Backend utilizado: endpoints principales y roles](#backend-utilizado-endpoints-principales-y-roles)
5. [Runas Svelte 5 usadas (con ubicacion por archivo)](#runas-svelte-5-usadas-con-ubicacion-por-archivo)
6. [Funcionalidad implementada en frontend](#funcionalidad-implementada-en-frontend)
7. [Variables de entorno](#variables-de-entorno)
8. [Scripts disponibles](#scripts-disponibles)
9. [Comandos rapidos](#comandos-rapidos)
10. [Troubleshooting](#troubleshooting)

---

## Objetivo
Construir una aplicacion con:
- Login JWT
- CRUD de productos (crear/editar/borrar solo admin)
- CRUD de usuarios (solo admin)
- Navegacion SPA con proteccion de rutas
- Estado global con runes Svelte 5
- Filtros avanzados y paginacion en productos

---

## Stack y estructura

```text
Practica1_PrograWebII/
├─ backend/
│  ├─ src/
│  │  ├─ config/
│  │  ├─ controllers/
│  │  ├─ middleware/
│  │  ├─ models/
│  │  ├─ routes/
│  │  └─ services/
│  ├─ uploads/
│  ├─ tests/
│  ├─ server.js
│  ├─ seed.js
│  └─ package.json
├─ frontend/
│  ├─ src/
│  │  ├─ components/
│  │  ├─ pages/
│  │  ├─ services/
│  │  ├─ state/
│  │  └─ utils/
│  ├─ vite.config.js
│  ├─ svelte.config.js
│  └─ package.json
└─ README.md
```

---

## Instalacion y ejecucion (paso a paso)

### Requisitos previos
- Node.js 20+
- npm 10+
- MongoDB activo
- Redis opcional (para lecturas repetidas más rápidas)

### 1) Backend
```bash
cd backend
npm install
npm run seed
npm run dev
```

Backend esperado:
- API REST: `http://localhost:3000/api`
- Swagger: `http://localhost:3000/api-docs`
- Uploads: `http://localhost:3000/uploads/<archivo>`

### 2) Frontend
En otra terminal:
```bash
cd frontend
npm install
npm run dev
```

Frontend esperado:
- `http://localhost:5173`

### Credenciales de prueba
- admin: `admin / admin123`
- user: `user / user123`

---

## Backend utilizado: endpoints principales y roles

Base URL: `http://localhost:3000/api`

### Auth
- `POST /login` -> publica
- `POST /register` -> publica

### Productos
- `GET /productos` -> publico
- `POST /productos` -> **admin**
- `PUT /productos/:id` -> **admin**
- `DELETE /productos/:id` -> **admin**

Query soportada en `GET /productos`:
- `name`
- `categoria`
- `minPrecio`
- `maxPrecio`
- `page`
- `limit`

### Usuarios (solo admin)
- `GET /users` -> **admin**
- `POST /users` -> **admin**
- `PUT /users/:id` -> **admin**
- `DELETE /users/:id` -> **admin**

### Carrito (autenticado)
- `GET /cart`
- `POST /cart/add`
- `DELETE /cart/:productId`

### Extras backend
- `GET /sitemap.xml`
- Swagger: `/api-docs`
- GraphQL demo: `backend/graphqlserver.mjs` (puerto 4000)

---

## Runas Svelte 5 usadas (con ubicacion por archivo)

### `$state()`
Estado principal de autenticacion, productos, usuarios, router, UI:
- `frontend/src/state/auth.svelte.js`
- `frontend/src/state/products.svelte.js`
- `frontend/src/state/users.svelte.js`
- `frontend/src/state/router.svelte.js`
- `frontend/src/state/ui.svelte.js`

### `$derived()`
Derivados para filtros, contadores, rol, rutas activas, etc:
- `frontend/src/App.svelte`
- `frontend/src/pages/ProductsPage.svelte`
- `frontend/src/pages/UsersPage.svelte`
- `frontend/src/components/layout/NavBar.svelte`
- `frontend/src/components/products/ProductCard.svelte`

### `$effect()`
Side effects (guards, recarga de datos, sincronizacion, expiracion):
- `frontend/src/App.svelte`
- `frontend/src/pages/ProductsPage.svelte`
- `frontend/src/pages/UsersPage.svelte`
- `frontend/src/components/products/ProductForm.svelte`
- `frontend/src/components/users/UserForm.svelte`

### `$props()` + callbacks hijo->padre
Comunicacion por callbacks (`onSave`, `onDelete`, `onEdit`, etc):
- `frontend/src/components/products/ProductForm.svelte`
- `frontend/src/components/products/ProductCard.svelte`
- `frontend/src/components/users/UserForm.svelte`
- `frontend/src/components/users/UserTable.svelte`
- `frontend/src/components/layout/NavBar.svelte`

No se usa `createEventDispatcher`; se usa patron de callbacks como pide la rubrica.

---

## Funcionalidad implementada en frontend

### Autenticacion
- Login con JWT
- Persistencia en `localStorage`
- Restauracion de sesion al recargar
- Logout con limpieza de estado + almacenamiento
- Bloqueo de vistas privadas sin sesion

### Productos
- Listado con nombre, precio, categoria, estado
- Detalle en modal
- CRUD por rol
- Filtros combinados:
  - nombre
  - categoria
  - precio minimo/maximo
- Paginacion local configurable (6/12/24)

### Usuarios
- Vista de administracion
- Listado de usuarios
- Crear usuario
- Editar usuario y rol
- Borrar usuario (con restricciones)

### UX
- Carga y errores visibles
- Toast global de exito/error
- Confirmaciones antes de borrado
- Responsive en movil

---

## Variables de entorno

### Backend (`backend/.env`)
```env
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/productos
REDIS_URL=redis://localhost:6379
REDIS_DISABLED=true
JWT_SECRET=Clave
```

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

---

## Scripts disponibles

### Backend
- `npm run start`
- `npm run dev`
- `npm run seed`
- `npm run test`
- `npm run lint`
- `npm run lint:fix`
- `npm run format`

### Frontend
- `npm run dev`
- `npm run build`
- `npm run preview`

---

## Comandos rapidos

```bash
# Backend
npm --prefix backend install
npm --prefix backend run seed
npm --prefix backend run dev

# Frontend
npm --prefix frontend install
npm --prefix frontend run dev

# Build frontend
npm --prefix frontend run build
```

---

## Troubleshooting

### "No se puede conectar con el backend" en login
1. Verifica backend corriendo en `http://localhost:3000`
2. Verifica `frontend/.env` con `VITE_API_BASE_URL=http://localhost:3000/api`
3. Verifica MongoDB activo y `MONGO_URI` valida
4. Ejecuta `npm run seed` en backend

### Error `ENOENT` en la raiz al hacer `npm run dev`
Este repo tiene 2 proyectos separados (`backend/` y `frontend/`).
Ejecuta npm dentro de cada carpeta o usa `--prefix`.

### Redis no disponible
Mantener `REDIS_DISABLED=true` en desarrollo local.