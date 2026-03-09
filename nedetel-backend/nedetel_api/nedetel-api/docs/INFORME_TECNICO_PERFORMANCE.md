# Informe tecnico del flujo completo

## 1. Objetivo
Implementar y demostrar optimizaciones de rendimiento en una API NestJS + Prisma + PostgreSQL sin romper la estructura existente del proyecto.

## 2. Arquitectura implementada
- API: NestJS (`PerformanceModule`) integrado en `AppModule`.
- Acceso a datos: Prisma + PostgreSQL.
- Cache: servicio en memoria con TTL e invalidacion por prefijo.
- N+1: comparacion entre estrategia naive y estrategia batched con DataLoader.
- Job queue: encolado de reportes con estado persistido en `ReportJob`.
- Lazy-loading: carga condicional de relaciones con `include` y paginacion `limit/offset`.

## 3. Decisiones tecnicas
### 3.1 Cache (TTL e invalidation)
- TTL configurable con `PERF_CACHE_TTL_MS` (default 45000 ms).
- Claves de cache por firma de consulta (limit, offset, include).
- Invalidation por prefijo al crear productos (`products:`).
- Beneficio: reduce latencia en consultas repetidas y evita recalculo innecesario.

### 3.2 Batching con DataLoader
- Endpoint naive: 1 consulta de ordenes + N consultas de items por orden.
- Endpoint batched: 1 consulta de ordenes + 1 consulta batched de items con `where in (...)`.
- Evidencia directa en `meta.queryCount`.

### 3.3 Job queue
- Encola tareas de reporte (`catalog-report`, `orders-report`).
- Estados esperados: `PENDING` -> `PROCESSING` -> `COMPLETED` o `FAILED`.
- Beneficio: desacopla trabajo pesado de la respuesta HTTP inmediata.

### 3.4 Lazy-loading
- Sin include: payload minimo y menor costo de serializacion.
- Con include: payload enriquecido (por ejemplo `category`) cuando el cliente lo solicita.
- Beneficio: control fino entre tiempo de respuesta y cantidad de datos.

## 4. Endpoints implementados
- `POST /api/performance/seed`
- `GET /api/performance/catalog/categories?limit&offset`
- `GET /api/performance/catalog/products?limit&offset&include=category`
- `POST /api/performance/catalog/products`
- `GET /api/performance/orders/naive?limit&offset&include=items|items.product`
- `GET /api/performance/orders/batched?limit&offset&include=items|items.product`
- `POST /api/performance/jobs/reports`
- `GET /api/performance/jobs/:id`

## 5. Evidencias
Las evidencias auto-generadas estan en:
- `docs/evidencias/evidencias_20260308_004544.md`

Cobertura de evidencias:
- Cache: misma consulta con comparacion sin/con cache.
- DataLoader (N+1): comparacion de `queryCount` y `tookMs` entre naive y batched.
- Queue: encolado + polling hasta `COMPLETED`.
- Lazy-loading: comparacion de `payload_bytes` y `tookMs` con/sin include.

## 6. Flujo de ejecucion reproducible
1. Ejecutar migraciones de base de datos.
2. Levantar API (`npm run start:dev`).
3. Ejecutar script de evidencias:
   - `./scripts/generate-performance-evidence.ps1`
4. Adjuntar el archivo generado de `docs/evidencias/` al informe final.

## 7. Riesgos y mitigaciones
- Cache stale data:
  - Mitigacion: TTL corto + invalidacion por prefijo al mutar catalogo.
- Sobrecarga por payload grande:
  - Mitigacion: lazy-loading y paginacion.
- Trabajo pesado bloqueando requests:
  - Mitigacion: procesamiento asincrono via queue.

## 8. Conclusion
La implementacion cumple los objetivos del taller, muestra reduccion de latencia y consultas, y mantiene la arquitectura del proyecto sin afectar modulos existentes.
