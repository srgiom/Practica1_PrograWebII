# Practica1 PrograWebII

Proyecto fullstack para gestion de productos y usuarios con autenticacion JWT y roles.

- Backend: Node.js + Express + MongoDB + JWT + Swagger + (Redis opcional)
- Frontend: Svelte 5 + Vite (SPA sin SvelteKit)

## 1) Objetivo del proyecto
Construir una app web con:
- CRUD completo de productos (acciones de escritura restringidas a admin)
- CRUD completo de usuarios (solo admin)
- Login con JWT
- Navegacion SPA y proteccion de vistas privadas
- Estado global en frontend con runes de Svelte 5 (`$state`, `$derived`, `$effect`, `$props`)
- Filtros avanzados y paginacion en productos

## 2) Estructura del repositorio
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
│  ├─ index.html
│  ├─ vite.config.js
│  ├─ svelte.config.js
│  └─ package.json
└─ README.md
```

## 3) Requisitos previos
- Node.js 20+
- npm 10+
- MongoDB corriendo en local o remoto
- Redis opcional (el backend puede funcionar sin Redis)

## 4) Variables de entorno
### Backend (`backend/.env`)
Valores sugeridos:
```env
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/productos
REDIS_URL=redis://localhost:6379
REDIS_DISABLED=true
JWT_SECRET=Clave
```

Notas:
- `MONGO_URI` es obligatoria para que arranque la API.
- Si `REDIS_DISABLED=true`, la API funciona sin cache Redis.
- Si `REDIS_DISABLED=false`, intenta conectar a `REDIS_URL`.

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## 5) Instalacion y ejecucion
### 5.1 Backend
```bash
cd backend
npm install
npm run seed
npm run dev
```

Servidor esperado:
- API REST: `http://localhost:3000/api`
- Swagger: `http://localhost:3000/api-docs`
- Uploads: `http://localhost:3000/uploads/<archivo>`

### 5.2 Frontend
En otra terminal:
```bash
cd frontend
npm install
npm run dev
```

App esperada:
- `http://localhost:5173`

## 6) Credenciales iniciales (seed)
`npm run seed` crea:
- admin: `admin` / `admin123`
- usuario normal: `user` / `user123`

## 7) Scripts disponibles
### Backend
- `npm run start` -> inicia en modo normal
- `npm run dev` -> inicia con nodemon
- `npm run seed` -> crea usuarios base
- `npm run test` -> tests con Jest
- `npm run lint` / `lint:fix` / `format`

### Frontend
- `npm run dev` -> servidor Vite
- `npm run build` -> build de produccion
- `npm run preview` -> servir build

## 8) Backend: arquitectura tecnica
- `server.js`:
  - Carga `.env`
  - Conexion Redis (opcional)
  - Conexion MongoDB
  - Arranque en `PORT`
- `src/app.js`:
  - Middlewares (`helmet`, `cors`, `morgan`, `express.json`)
  - Swagger
  - Rutas bajo `/api`
- `src/routes/*`:
  - `authRoutes`, `productRoutes`, `userRoutes`, `cartRoutes`
- `src/middleware/authMiddleware.js`:
  - Valida `Authorization: Bearer <token>`
  - Carga `req.user`
- `src/services/*`:
  - Logica de negocio y acceso a datos

## 9) Modelos de datos
### User
- `username: string` (unico)
- `password: string` (hash bcrypt)
- `role: 'admin' | 'user'`
- `cart: [{ productId, quantity }]`

### Producto
- `nombre: string`
- `precio: number`
- `categoria: string` (default `General`)
- `activo: boolean` (default `true`)
- `imagen: string | null`

## 10) API REST principal
Base URL: `http://localhost:3000/api`

### Auth
- `POST /login`
  - body: `{ username, password }`
  - 200: `{ token }`
- `POST /register`
  - body: `{ username, password }`

### Productos
- `GET /productos`
  - publico en este backend
  - query opcional:
    - `name` (texto)
    - `categoria` (exacta)
    - `minPrecio` (numero)
    - `maxPrecio` (numero)
    - `page` (entero)
    - `limit` (entero)
- `POST /productos` (admin)
  - auth requerida
  - `multipart/form-data`
  - campos: `nombre`, `precio`, `categoria`, `activo`, `imagen`
- `PUT /productos/:id` (admin)
  - auth requerida
  - body JSON parcial: `nombre`, `precio`, `categoria`, `activo`
- `DELETE /productos/:id` (admin)
  - auth requerida

### Usuarios (solo admin)
- `GET /users`
- `POST /users`
- `PUT /users/:id`
- `DELETE /users/:id`

### Carrito
- `GET /cart` (auth)
- `POST /cart/add` (auth) body `{ productId }`
- `DELETE /cart/:productId` (auth)

### Extras
- `GET /sitemap.xml`
- Swagger en `/api-docs`
- GraphQL demo independiente en `backend/graphqlserver.mjs` (`http://localhost:4000/graphql`)

## 11) Frontend: arquitectura tecnica
Frontend en `frontend/`, construido como SPA con router propio (sin SvelteKit).

### Estado global
- `src/state/auth.svelte.js`
  - token, user, persistencia localStorage, restore al recargar
- `src/state/products.svelte.js`
  - productos, filtros, paginacion, producto seleccionado
- `src/state/users.svelte.js`
  - estado de gestion de usuarios
- `src/state/ui.svelte.js`
  - flash global (exito/error)
- `src/state/router.svelte.js`
  - navegacion SPA

### Paginas
- `LoginPage`
- `ProductsPage`
- `ProfilePage`
- `UsersPage` (admin)

### Componentes clave
- `NavBar` (resalta ruta activa)
- `ProductCard`, `ProductForm`, `ProductDetailModal`
- `UserForm`, `UserTable`
- `Modal`, `FlashMessage`

## 12) Funcionalidad implementada en frontend
### Autenticacion y roles
- Login JWT
- Guard de rutas privadas
- Logout con limpieza completa
- Render condicional por rol (admin/user)

### Productos
- Listado con nombre, precio, categoria, estado
- Detalle en modal
- CRUD por rol
- Filtros combinados:
  - nombre
  - categoria
  - rango de precio
- Paginacion local configurable (6/12/24)

### Usuarios
- Panel admin de CRUD usuarios
- Cambio de rol
- Restricciones de acciones segun permisos

### UX
- Mensajes globales de error/exito (toast)
- Estados de carga
- Confirmacion antes de borrar
- Responsive en movil

## 13) Uso de runes (Svelte 5)
- `$state()` para estado principal global y local
- `$derived()` para valores derivados (filtros, contadores, rutas, etiquetas)
- `$effect()` para side effects (guards, recarga de datos, expiracion de sesion)
- `$props()` y callbacks para comunicacion hijo->padre

## 14) Rubrica (resumen de cobertura)
### Minimos obligatorios
- Estructura Vite + Svelte 5: completo
- Auth JWT + proteccion de pantallas: completo
- CRUD productos con detalle: completo
- Navegacion SPA + ruta activa: completo
- Estilos y responsive: completo

### Bloque runes
- Estado/derivados/efectos/props-callbacks: completo

### Opcionales avanzados
- Gestion usuarios y roles: completo
- Persistencia de sesion: completo
- Filtros + busqueda + paginacion: completo
- Formularios avanzados: completo
- UX mejorada: completo

## 15) Validaciones realizadas
- Build frontend correcto:
```bash
npm --prefix frontend run build
```
- Sintaxis backend verificada en archivos clave con `node --check`.

## 16) Troubleshooting
### "No se puede conectar con el backend" en login
1. Verifica backend corriendo en `http://localhost:3000`
2. Verifica `frontend/.env` -> `VITE_API_BASE_URL=http://localhost:3000/api`
3. Verifica MongoDB activo y `MONGO_URI` valida
4. Ejecuta seed para tener usuarios iniciales

### Error de npm ENOENT en raiz
El proyecto tiene dos `package.json` separados (`backend/` y `frontend/`).
Ejecuta npm dentro de cada carpeta o con `--prefix`.

### Redis no disponible
- Deja `REDIS_DISABLED=true` para desarrollo local sin Redis.

## 17) Comandos utiles rapidos
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

## 18) Licencia
Uso academico para practica universitaria.
