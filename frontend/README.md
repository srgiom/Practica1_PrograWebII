# Frontend Svelte 5 - Practica1

Frontend SPA en **Svelte 5 + Vite** para consumir el backend de la práctica.

## Requisitos
- Node.js 20+
- Backend ejecutándose (por defecto en `http://localhost:3000`)

## Configuración
1. Copia variables de entorno:
```bash
cp .env.example .env
```
2. Instala dependencias:
```bash
npm install
```

## Ejecutar
```bash
npm run dev
```

## Build producción
```bash
npm run build
npm run preview
```

## Pantallas
- `/login`
- `/productos`
- `/perfil`
- `/usuarios` (solo admin)

## Notas de implementación
- JWT en memoria + persistencia en `localStorage`.
- Rutas protegidas y navegación SPA.
- CRUD productos (según rol).
- CRUD usuarios para admin.
- Filtros combinados de productos por nombre, categoría y rango de precio.
- Paginación local configurable (6/12/24) sobre resultados filtrados.
- Estado global y derivados usando runes (`$state`, `$derived`, `$effect`, `$props`).
