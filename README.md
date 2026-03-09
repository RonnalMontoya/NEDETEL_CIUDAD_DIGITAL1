# NEDETEL CIUDAD DIGITAL

Repositorio de entrega del proyecto con frontend (Ionic/Angular) y backend (NestJS + Prisma + PostgreSQL).

## Estructura

- `nedetel-backend/`: API y configuracion del servidor.
- `nedetel-frontend/`: Aplicacion cliente Ionic/Angular.

## Requisitos

- Node.js 18+
- npm 9+
- PostgreSQL 14+ (gestionado con pgAdmin4)

## 1) Ejecutar Backend (API)

```bash
cd nedetel-backend/nedetel_api/nedetel-api
npm install
```

Configurar variables de entorno en `.env` (ejemplo minimo):

```env
DATABASE_URL="postgresql://usuario:clave@localhost:5432/nedetel_db?schema=public"
JWT_SECRET="cambia_este_valor"
PORT=3000
# Opcional para cola de jobs con Redis
# REDIS_URL="redis://127.0.0.1:6379"
```

Aplicar migraciones y generar cliente Prisma:

```bash
npx prisma migrate dev
npx prisma generate
```

Iniciar API:

```bash
npm run start:dev
```

La API quedara disponible en `http://localhost:3000`.

## 2) Ejecutar Frontend (Ionic)

```bash
cd nedetel-frontend
npm install
npm run start
```

Abrir en navegador: `http://localhost:8100`.

## 3) Build de verificacion

Backend:

```bash
cd nedetel-backend/nedetel_api/nedetel-api
npm run build
```

Frontend:

```bash
cd nedetel-frontend
npm run build
```

## Notas

- El backend incluye endpoints de optimizacion de rendimiento (cache, DataLoader, cola de jobs y lazy-loading) en el modulo `performance`.
- Si no se configura `REDIS_URL`, la cola funciona en modo local para pruebas.
