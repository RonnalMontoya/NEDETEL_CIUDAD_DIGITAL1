# 📁 Estructura del Proyecto - NEDETEL Data Center

## Árbol Completo del Proyecto

```
nedetel_ciudad_digital/
│
├── 📄 README.md                      # Documentación principal
├── 📄 CONTRIBUTING.md                # Guía de contribución
├── 📄 LICENSE                        # Licencia MIT
├── 📄 angular.json                   # Config de Angular CLI
├── 📄 ionic.config.json              # Config de Ionic
├── 📄 capacitor.config.json          # Config de Capacitor
├── 📄 package.json                   # Dependencias del proyecto
├── 📄 tsconfig.json                  # Config de TypeScript
├── 📄 karma.conf.js                  # Config de testing
│
├── 📁 src/                           # Código fuente
│   ├── 📄 main.ts                    # Punto de entrada
│   ├── 📄 index.html                 # HTML principal
│   ├── 📄 polyfills.ts               # Polyfills para navegadores
│   ├── 📄 test.ts                    # Setup de testing
│   │
│   ├── 📁 app/                       # Módulo principal
│   │   ├── 📄 app.module.ts          # Módulo raíz
│   │   ├── 📄 app.component.ts       # Componente raíz
│   │   ├── 📄 app.component.html     # Template raíz
│   │   ├── 📄 app.component.scss     # Estilos raíz
│   │   ├── 📄 app-routing.module.ts  # Rutas principales
│   │   │
│   │   ├── 📁 core/                  # Servicios y guards (singleton)
│   │   │   ├── 📁 guards/
│   │   │   │   ├── auth.guard.ts
│   │   │   │   ├── role.guard.ts
│   │   │   │   └── unsaved-changes.guard.ts
│   │   │   │
│   │   │   ├── 📁 interceptors/
│   │   │   │   ├── auth.interceptor.ts
│   │   │   │   ├── error.interceptor.ts
│   │   │   │   └── loading.interceptor.ts
│   │   │   │
│   │   │   └── 📁 services/
│   │   │       ├── auth.service.ts
│   │   │       ├── storage.service.ts
│   │   │       └── notification.service.ts
│   │   │
│   │   ├── 📁 home/                  # Página de inicio
│   │   │   ├── 📄 home.page.ts
│   │   │   ├── 📄 home.page.html
│   │   │   ├── 📄 home.page.scss
│   │   │   └── 📄 home.page.spec.ts
│   │   │
│   │   ├── 📁 pages/                 # Páginas de módulos
│   │   │   │
│   │   │   ├── 📁 dashboard/         # Dashboard principal
│   │   │   │   ├── 📄 dashboard.page.ts
│   │   │   │   ├── 📄 dashboard.page.html
│   │   │   │   ├── 📄 dashboard.page.scss
│   │   │   │   │
│   │   │   │   └── 📁 components/
│   │   │   │       ├── stats-card/
│   │   │   │       └── activity-log/
│   │   │   │
│   │   │   ├── 📁 equipos/           # Gestión de equipos
│   │   │   │   ├── 📄 equipos.page.ts
│   │   │   │   ├── 📄 equipos.page.html
│   │   │   │   ├── 📄 equipos.page.scss
│   │   │   │   │
│   │   │   │   ├── 📁 components/
│   │   │   │   │   ├── equipo-list/
│   │   │   │   │   ├── equipo-detail/
│   │   │   │   │   └── equipo-form/
│   │   │   │   │
│   │   │   │   └── 📁 services/
│   │   │   │       └── equipos.service.ts
│   │   │   │
│   │   │   ├── 📁 mantenimiento/     # Gestión de mantenimiento
│   │   │   │   ├── 📄 mantenimiento.page.ts
│   │   │   │   ├── 📄 mantenimiento.page.html
│   │   │   │   ├── 📄 mantenimiento.page.scss
│   │   │   │   │
│   │   │   │   ├── 📁 components/
│   │   │   │   │   ├── mantenimiento-list/
│   │   │   │   │   ├── mantenimiento-detail/
│   │   │   │   │   └── mantenimiento-form/
│   │   │   │   │
│   │   │   │   └── 📁 services/
│   │   │   │       └── mantenimiento.service.ts
│   │   │   │
│   │   │   ├── 📁 trabajos/          # Gestión de trabajos
│   │   │   │   ├── 📁 components/
│   │   │   │   └── 📁 services/
│   │   │   │
│   │   │   ├── 📁 reportes/          # Reportes y analytics
│   │   │   │   ├── 📁 components/
│   │   │   │   └── 📁 services/
│   │   │   │
│   │   │   ├── 📁 visitas/           # Gestión de visitas
│   │   │   │   ├── 📁 components/
│   │   │   │   └── 📁 services/
│   │   │   │
│   │   │   ├── 📁 limpieza/          # Gestión de limpieza
│   │   │   │   ├── 📁 components/
│   │   │   │   └── 📁 services/
│   │   │   │
│   │   │   ├── 📁 login/             # Autenticación
│   │   │   │   ├── 📄 login.page.ts
│   │   │   │   ├── 📄 login.page.html
│   │   │   │   └── 📄 login.page.scss
│   │   │   │
│   │   │   └── 📁 register/          # Registro de usuarios
│   │   │       ├── 📄 register.page.ts
│   │   │       ├── 📄 register.page.html
│   │   │       └── 📄 register.page.scss
│   │   │
│   │   ├── 📁 shared/                # Componentes compartidos
│   │   │   ├── 📁 components/
│   │   │   │   ├── header/
│   │   │   │   ├── footer/
│   │   │   │   ├── sidebar/
│   │   │   │   ├── modals/
│   │   │   │   └── dialogs/
│   │   │   │
│   │   │   ├── 📁 pipes/
│   │   │   │   ├── safe-html.pipe.ts
│   │   │   │   ├── date-format.pipe.ts
│   │   │   │   └── status.pipe.ts
│   │   │   │
│   │   │   └── 📁 directives/
│   │   │       ├── highlight.directive.ts
│   │   │       └── touch-ripple.directive.ts
│   │   │
│   │   └── 📁 services/              # Servicios globales
│   │       ├── api.service.ts
│   │       ├── cache.service.ts
│   │       ├── logger.service.ts
│   │       └── error-handler.service.ts
│   │
│   ├── 📁 assets/                    # Recursos estáticos
│   │   ├── 📁 icon/
│   │   │   ├── favicon.png
│   │   │   └── icon.png
│   │   │
│   │   ├── 📁 images/
│   │   │   ├── 📁 equipos/
│   │   │   ├── 📁 banners/
│   │   │   └── 📁 icons/
│   │   │
│   │   └── 📁 data/
│   │       ├── mock-equipos.json
│   │       └── mock-mantenimiento.json
│   │
│   ├── 📁 environments/              # Configuración por entorno
│   │   ├── environment.ts            # Desarrollo
│   │   └── environment.prod.ts       # Producción
│   │
│   ├── 📁 theme/                     # Tema global
│   │   ├── variables.scss            # Variables de color y tipografía
│   │   └── mixins.scss               # Mixins reutilizables
│   │
│   └── 📄 global.scss                # Estilos globales
│
├── 📁 www/                           # Archivos compilados (generado)
│   └── [archivos .js, .css, .html compilados]
│
├── 📁 android/                       # Código nativo Android
│   ├── 📁 app/
│   ├── 📁 gradle/
│   ├── build.gradle
│   ├── settings.gradle
│   └── local.properties
│
├── 📁 nedetel_api/                   # Backend API
│   └── 📁 nedetel-api/
│       ├── 📄 package.json
│       ├── 📄 tsconfig.json
│       │
│       ├── 📁 src/
│       │   ├── 📄 main.ts
│       │   │
│       │   ├── 📁 routes/
│       │   │   ├── 📄 equipos.routes.ts
│       │   │   ├── 📄 mantenimiento.routes.ts
│       │   │   └── ...
│       │   │
│       │   ├── 📁 controllers/
│       │   │   ├── 📄 equipos.controller.ts
│       │   │   ├── 📄 mantenimiento.controller.ts
│       │   │   └── ...
│       │   │
│       │   ├── 📁 services/
│       │   │   └── [lógica de negocio]
│       │   │
│       │   ├── 📁 middleware/
│       │   │   ├── 📄 auth.middleware.ts
│       │   │   └── 📄 error.middleware.ts
│       │   │
│       │   └── 📁 utils/
│       │       └── [funciones auxiliares]
│       │
│       ├── 📁 prisma/
│       │   ├── 📄 schema.prisma
│       │   └── 📁 migrations/
│       │
│       └── 📁 tests/
│           └── [tests del backend]
│
├── 📁 node_modules/                  # Dependencias (no incluir en git)
│
└── 📁 dist/                          # Build de producción (generado)
```

## 📊 Explicación de Módulos Principales

### Core Module (`src/app/core/`)
Contiene servicios singleton, guards e interceptores:
- **Guards**: Protegen rutas (autenticación, roles, cambios sin guardar)
- **Interceptors**: Interceptan llamadas HTTP (autenticación, manejo de errores)
- **Services**: Servicios de aplicación global (auth, storage, notificaciones)

### Pages Module (`src/app/pages/`)
Cada página tiene su propia estructura:
```
pagina/
├── pagina.page.ts           # Lógica del componente
├── pagina.page.html         # Plantilla
├── pagina.page.scss         # Estilos específicos
├── pagina.page.spec.ts      # Tests
├── components/              # Componentes de la página
└── services/                # Servicios de la página
```

### Shared Module (`src/app/shared/`)
Componentes, pipes y directivas compartidas entre módulos:
- **Components**: Header, Footer, Modales, Diálogos
- **Pipes**: Transformación de datos (formateo de fechas, estado)
- **Directives**: Comportamientos reutilizables

### Services (`src/app/services/`)
Servicios globales de la aplicación:
- **api.service.ts**: Llamadas HTTP centralizadas
- **cache.service.ts**: Gestión de caché
- **logger.service.ts**: Logging centralizado
- **error-handler.service.ts**: Manejo de errores global

## 🔄 Flujo de Datos

```
User Interaction
        ↓
Component (*.page.ts)
        ↓
Service (*.service.ts)
        ↓
API Service (api.service.ts)
        ↓
HTTP Interceptors
        ↓
Backend API
        ↓
Database
```

## 📦 Convenciones de Nombres

| Elemento | Patrón | Ejemplo |
|----------|--------|---------|
| Archivo de componente | `nombre.component.ts` | `equipo-list.component.ts` |
| Archivo de página | `nombre.page.ts` | `equipos.page.ts` |
| Archivo de servicio | `nombre.service.ts` | `equipos.service.ts` |
| Directorio | `kebab-case` | `equipo-list/`, `auth-guard/` |
| Clase | `PascalCase` | `EquipoListComponent`, `EquiposService` |
| Propiedades | `camelCase` | `equipoList`, `isLoading` |

## 🎯 Estructura de un Módulo Típico

```
modulo/
├── modulo.page.ts              # Componente principal
├── modulo.page.html            # Template
├── modulo.page.scss            # Estilos
├── modulo.page.spec.ts         # Tests
│
├── components/                 # Subcomponentes
│   ├── lista/                  
│   │   ├── lista.component.ts
│   │   ├── lista.component.html
│   │   ├── lista.component.scss
│   │   └── lista.component.spec.ts
│   │
│   └── detalle/
│       ├── detalle.component.ts
│       ├── detalle.component.html
│       ├── detalle.component.scss
│       └── detalle.component.spec.ts
│
├── models/                     # Interfaces/Tipos
│   └── modulo.model.ts
│
└── services/                   # Servicios específicos
    └── modulo.service.ts
```

## 🔗 Imports Relativos

Usa path aliases definidos en `tsconfig.json`:

```typescript
// ✅ BIEN
import { EquiposService } from '@services/equipos.service';
import { Equipo } from '@models/equipo.model';

// ❌ EVITA
import { EquiposService } from '../../../services/equipos.service';
import { Equipo } from '../../models/equipo.model';
```

---

**Mantén la estructura limpia y organizada para facilitar el desarrollo y mantenimiento.**