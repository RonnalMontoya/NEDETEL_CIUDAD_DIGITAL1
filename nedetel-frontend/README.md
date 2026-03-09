# 🖥️ NEDETEL - Control Integral de Data Center

> **Sistema profesional de gestión y monitoreo de infraestructura de Data Center**

## 📋 Descripción

NEDETEL es una aplicación móvil desarrollada con **Ionic** y **Angular** que proporciona un sistema integral para la gestión, control y monitoreo de infraestructura en Data Centers. Diseñado para optimizar operaciones, registrar mantenimiento y administrar tareas de forma eficiente.

## ✨ Características Principales

### 📊 Módulos del Sistema

- **🖥️ Equipos** - Gestión completa de servidores y equipamiento
- **🔧 Mantenimiento** - Planificación y seguimiento de mantenimientos preventivos
- **📋 Trabajos** - Registro y asignación de tareas operativas
- **📈 Reportes** - Análisis de desempeño e informes detallados
- **📅 Visitas** - Control de visitas técnicas y asistencias
- **🧹 Limpieza** - Registro de procedimientos de limpieza y desinfección
- **🔐 Dashboard** - Panel de control centralizado
- **👤 Autenticación** - Sistema seguro de login y registro

### 🎯 Funcionalidades Destacadas

✅ Interfaz moderna y responsiva  
✅ Control en tiempo real de equipos  
✅ Historial completo de actividades  
✅ Reportes detallados y gráficos  
✅ Sistema de notificaciones  
✅ Base de datos relacional con Prisma  
✅ API RESTful robusta  
✅ Diseño mobile-first  

## 🛠️ Stack Tecnológico

### Frontend
- **Ionic Framework** 7.x
- **Angular** 20.x
- **TypeScript** 5.x
- **SCSS/CSS3**
- **RxJS** para manejo reactivo

### Backend
- **Node.js/Express**
- **Prisma ORM**
- **PostgreSQL/MySQL**
- **JWT Authentication**

### Herramientas
- **Capacitor** para acceso nativo
- **Karma/Jasmine** para testing
- **Angular CLI**

## 📦 Instalación

### Requisitos Previos
- Node.js 18+ y npm
- Angular CLI
- Ionic CLI
- Android Studio (opcional, para compilación nativa)

### Pasos de Instalación

```bash
# 1. Clonar el repositorio
git clone <tu-repositorio>
cd nedetel_ciudad_digital

# 2. Instalar dependencias del frontend
npm install

# 3. Instalar dependencias del backend
cd nedetel_api/nedetel-api
npm install

# 4. Configurar variables de entorno
# Crear archivo .env en nedetel_api/nedetel-api
# DATABASE_URL=tu_url_de_conexión
# JWT_SECRET=tu_secreto_jwt

# 5. Configurar base de datos
npx prisma migrate dev

# 6. Volver al directorio raíz
cd ../..
```

## 🚀 Ejecución

### Desarrollo Frontend
```bash
npm start
# La aplicación estará disponible en http://localhost:4200
```

### Desarrollo Backend
```bash
cd nedetel_api/nedetel-api
npm run dev
# API disponible en http://localhost:3000
```

### Build Producción
```bash
# Build web
npm run build

# Build Android
ionic build
ionic cap add android
ionic cap open android
```

## 📱 Estructura del Proyecto

```
nedetel_ciudad_digital/
├── src/
│   ├── app/
│   │   ├── core/              # Servicios y guards
│   │   ├── home/              # Página de inicio
│   │   ├── pages/             # Páginas de módulos
│   │   │   ├── dashboard/
│   │   │   ├── equipos/
│   │   │   ├── mantenimiento/
│   │   │   ├── trabajos/
│   │   │   ├── reportes/
│   │   │   ├── visitas/
│   │   │   ├── limpieza/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── services/          # Servicios compartidos
│   │   └── app.module.ts
│   ├── assets/                # Imágenes e iconos
│   ├── environments/          # Configuración por entorno
│   ├── theme/                 # Tema y colores
│   └── global.scss            # Estilos globales
├── nedetel_api/               # Backend API
├── android/                   # Proyecto Android nativo
├── package.json
├── angular.json
├── ionic.config.json
└── capacitor.config.json
```

## 🎨 Personalización

### Colores del Tema
Los colores principales están definidos en `src/global.scss`:

```scss
--ion-color-primary: #667eea;      // Azul gradiente
--ion-color-secondary: #764ba2;    // Púrpura
--ion-color-tertiary: #00bcd4;     // Cian
```

### Componentes Principales
- Ionic UI Components
- Material Design Icons
- Custom SCSS Modules

## 📚 Documentación de API

### Endpoints Principales

```
GET    /api/equipos           - Listar equipos
POST   /api/equipos           - Crear equipo
PUT    /api/equipos/:id       - Actualizar equipo
DELETE /api/equipos/:id       - Eliminar equipo

GET    /api/mantenimiento     - Listar mantenimientos
POST   /api/mantenimiento     - Crear mantenimiento

GET    /api/trabajos          - Listar trabajos
POST   /api/trabajos          - Crear trabajo

GET    /api/reportes          - Generar reportes
```

Para documentación completa de API, consultar Swagger en `/api-docs`

## 🧪 Testing

```bash
# Ejecutar pruebas unitarias
npm run test

# Pruebas con cobertura
npm run test:coverage

# Pruebas e2e
npm run e2e
```

## 🔐 Autenticación

El sistema utiliza **JWT (JSON Web Tokens)** para autenticación:

1. Usuario realiza login en página `/login`
2. Backend valida credenciales y emite JWT
3. Token se almacena en `localStorage`
4. Cada request incluye token en header `Authorization`
5. Guards protegen rutas autenticadas

## 📊 Base de Datos

### Modelo Relacional (Prisma)

```prisma
model Equipo {
  id          Int      @id @default(autoincrement())
  nombre      String
  tipo        String
  estado      String
  ubicacion   String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Mantenimiento {
  id          Int      @id @default(autoincrement())
  equipoId    Int
  tipo        String
  fecha       DateTime
  descripcion String
  createdAt   DateTime @default(now())
}

model Trabajo {
  id          Int      @id @default(autoincrement())
  titulo      String
  descripcion String
  estado      String
  prioridad   String
  asignado    String
  createdAt   DateTime @default(now())
  completado  DateTime?
}
```

## 🐛 Debugging

### Logs en Consola
```typescript
import { Logger } from '@angular/core';

export class MiServicio {
  private logger = new Logger('MiServicio');
  
  constructor() {
    this.logger.log('Mensaje de log');
    this.logger.warn('Advertencia');
    this.logger.error('Error');
  }
}
```

### DevTools
- Chrome DevTools para debugging frontend
- Network tab para inspeccionar API calls
- Angular DevTools extension

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la licencia MIT. Ver archivo [LICENSE](LICENSE) para más detalles.

## ✉️ Soporte

Para reportar problemas o sugerencias:
- 📧 Email: soporte@nedetel.com
- 🐛 Issues: [GitHub Issues](https://github.com/nedetel/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/nedetel/discussions)

## 🎓 Información Académica

**Proyecto:** NEDETEL Ciudad Digital  
**Asignatura:** Aplicaciones Móviles  
**Semestre:** 5to Semestre  
**Universidad:** Universidad Estatal Amazónica  
**Período:** 1er Parcial

---

**Desarrollado con ❤️ para optimizar la gestión de Data Centers**

*Última actualización: 28 de enero de 2026*