# Informe tecnico del flujo completo

## 1. Objetivo

Implementar y demostrar optimizaciones de rendimiento en una API NestJS + Prisma + PostgreSQL, manteniendo la estructura existente del proyecto y documentando evidencias reproducibles.

## 2. Arquitectura

- Frontend: Ionic/Angular en `nedetel-frontend`.
- Backend: NestJS en `nedetel-backend/nedetel_api/nedetel-api`.
- Base de datos: PostgreSQL (gestionada con pgAdmin4) mediante Prisma ORM.
- Modulo de rendimiento: `src/performance` integrado en `src/app.module.ts`.

### Componentes del modulo de rendimiento

- `query-cache.service.ts`: cache en memoria con TTL e invalidacion por prefijo.
- `order-dataloader.service.ts`: batching para evitar patron N+1.
- `jobs-queue.service.ts`: encolado de tareas asincronas (Redis opcional con fallback local).
- `performance.service.ts`: logica de catalogo, ordenes, jobs y lazy-loading.
- `performance.controller.ts`: endpoints HTTP para pruebas/evidencias.

## 3. Decisiones tecnicas

### 3.1 Cache (TTL + invalidacion)

- TTL configurable con `PERF_CACHE_TTL_MS` (valor por defecto 45000 ms).
- Claves de cache basadas en firma de consulta (`limit`, `offset`, `include`).
- Invalidacion por prefijo (`products:`) despues de crear productos.
- Justificacion: reducir latencia y carga de base de datos en consultas repetidas.

### 3.2 Batching (DataLoader)

- Version naive: 1 consulta de ordenes + N consultas de items por cada orden.
- Version batched: 1 consulta de ordenes + 1 consulta agrupada de items (`IN (...)`).
- Medicion: `meta.queryCount` y `meta.tookMs` expuestos por la API.
- Justificacion: eliminar sobrecosto de consultas N+1.

### 3.3 Job queue

- Encolado de reportes (`catalog-report`, `orders-report`) y seguimiento por ID.
- Estados: `PENDING`, `PROCESSING`, `COMPLETED`, `FAILED`.
- Justificacion: desacoplar tareas pesadas del ciclo de respuesta HTTP.

### 3.4 Lazy-loading

- Soporte para includes condicionales en endpoints (`include=category`, `include=items`, `include=items.product`).
- Paginacion con `limit/offset` para controlar volumen de datos.
- Justificacion: balancear tiempo de respuesta y tamano de payload.

## 4. Endpoints implementados

- `POST /api/performance/seed`
- `GET /api/performance/catalog/categories?limit&offset`
- `GET /api/performance/catalog/products?limit&offset&include=category`
- `POST /api/performance/catalog/products`
- `GET /api/performance/orders/naive?limit&offset&include=items|items.product`
- `GET /api/performance/orders/batched?limit&offset&include=items|items.product`
- `POST /api/performance/jobs/reports`
- `GET /api/performance/jobs/:id`

## 5. Flujo completo de ejecucion

1. Configurar variables de entorno del backend (`.env`) con `DATABASE_URL` y `JWT_SECRET`.
2. Instalar dependencias:
   - Backend: `npm install` en `nedetel-backend/nedetel_api/nedetel-api`
   - Frontend: `npm install` en `nedetel-frontend`
3. Preparar base de datos:
   - `npx prisma migrate dev`
   - `npx prisma generate`
4. Iniciar backend: `npm run start:dev`
5. Iniciar frontend: `npm run start`
6. Generar evidencias de rendimiento:
   - `./scripts/generate-performance-evidence.ps1`

## 6. Evidencias

- Archivo generado: `nedetel-backend/nedetel_api/nedetel-api/docs/evidencias/evidencias_20260308_184452.md`
- Cobertura demostrada:
  - Cache: comparacion de primera vs segunda consulta (sin/con cache).
  - N+1: diferencia de `queryCount` y `tookMs` entre naive y batched.
  - Queue: creacion de job y consulta de estado hasta `COMPLETED`.
  - Lazy-loading: comparacion de payload y tiempo con/sin include.

## 7. Resultado

Se implementaron las cuatro optimizaciones solicitadas (cache, DataLoader, queue, lazy-loading) sin romper la arquitectura base del proyecto. El flujo queda documentado, reproducible y respaldado por evidencias en el repositorio.
