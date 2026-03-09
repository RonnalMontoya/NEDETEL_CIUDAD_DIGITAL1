# 📖 Guía de Contribución - NEDETEL Data Center

## Bienvenida

Gracias por tu interés en contribuir a NEDETEL. Este documento proporciona directrices para contribuir de manera efectiva.

## 📋 Antes de Comenzar

- Lee el [README.md](README.md) completo
- Revisa los [Issues abiertos](https://github.com/nedetel/issues)
- Familiarízate con la estructura del proyecto
- Asegúrate de tener Node.js 18+ instalado

## 🔄 Proceso de Contribución

### 1. Fork y Clone

```bash
# Fork en GitHub
git clone https://github.com/tu-usuario/nedetel_ciudad_digital.git
cd nedetel_ciudad_digital

# Configura upstream
git remote add upstream https://github.com/original/nedetel_ciudad_digital.git
```

### 2. Crea una Rama

```bash
# Actualiza main
git fetch upstream
git checkout main
git merge upstream/main

# Crea rama feature
git checkout -b feature/descripcion-corta
# O para bugs:
git checkout -b fix/descripcion-corta
```

### 3. Desarrollo

```bash
# Instala dependencias
npm install

# Inicia servidor de desarrollo
npm start

# En otra terminal, inicia API
cd nedetel_api/nedetel-api
npm run dev
```

### 4. Testing

```bash
# Pruebas unitarias
npm run test

# Lint
npm run lint

# Build
npm run build
```

### 5. Commit y Push

```bash
# Commits semánticos
git add .
git commit -m "feat: descripción clara del cambio"
# Tipos: feat, fix, docs, style, refactor, perf, test, chore

# Push a tu rama
git push origin feature/descripcion-corta
```

### 6. Pull Request

1. Ve a GitHub y abre un PR
2. Usa el template de PR
3. Describe cambios claramente
4. Vincula issues relacionados (#123)
5. Espera review

## 📝 Guías de Estilo

### TypeScript/Angular

```typescript
// ✅ BIEN
export class EquiposService {
  constructor(private http: HttpClient) {}

  obtenerEquipos(): Observable<Equipo[]> {
    return this.http.get<Equipo[]>('/api/equipos');
  }
}

// ❌ MAL
export class equiposService {
  constructor(http) {
    this.http = http;
  }
  
  getEquipos() {
    return this.http.get('/api/equipos');
  }
}
```

### HTML/Template

```html
<!-- ✅ BIEN -->
<div class="equipos-list">
  <ion-card *ngFor="let equipo of equipos">
    <ion-card-header>
      <ion-card-title>{{ equipo.nombre }}</ion-card-title>
    </ion-card-header>
  </ion-card>
</div>

<!-- ❌ MAL -->
<div>
  <card *ngFor="let e of eq">
    <h1>{{e.n}}</h1>
  </card>
</div>
```

### SCSS

```scss
// ✅ BIEN
.equipos-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  padding: 16px;

  .equipo-card {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    }
  }
}

// ❌ MAL
.equipos {
  margin: 10px;
}

.equipos card {
  padding: 5px;
}

.equipos card:hover {
  background: blue;
}
```

## 🎯 Estándares de Código

### Nombres

- Clases: `PascalCase` - `EquiposComponent`, `AuthService`
- Funciones/métodos: `camelCase` - `obtenerEquipos()`, `crearEquipo()`
- Constantes: `UPPER_SNAKE_CASE` - `MAX_EQUIPOS = 1000`
- Variables: `camelCase` - `equiposList`, `isLoading`
- Directorios: `kebab-case` - `equipos-list/`, `auth-guard/`

### Documentación

```typescript
/**
 * Obtiene la lista de todos los equipos del data center
 * 
 * @returns Observable<Equipo[]> - Lista de equipos
 * @throws HttpErrorResponse si falla la llamada API
 * 
 * @example
 * this.equiposService.obtenerEquipos().subscribe(
 *   equipos => console.log(equipos)
 * );
 */
obtenerEquipos(): Observable<Equipo[]> {
  return this.http.get<Equipo[]>(`${this.apiUrl}/equipos`);
}
```

### Imports

```typescript
// ✅ BIEN - Organizado por tipo
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';

import { EquiposService } from '@services/equipos.service';
import { Equipo } from '@models/equipo.model';

// ❌ MAL
import { Component } from '@angular/core';
import { EquiposService } from '@services/equipos.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { OnInit } from '@angular/core';
```

## 🧪 Testing

Todo cambio debe incluir tests:

```typescript
describe('EquiposService', () => {
  let service: EquiposService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EquiposService]
    });
    service = TestBed.inject(EquiposService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería obtener equipos', () => {
    const mockEquipos: Equipo[] = [
      { id: 1, nombre: 'Servidor 1' }
    ];

    service.obtenerEquipos().subscribe(equipos => {
      expect(equipos).toEqual(mockEquipos);
    });

    const req = httpMock.expectOne('/api/equipos');
    expect(req.request.method).toBe('GET');
    req.flush(mockEquipos);
  });
});
```

## 🔍 Checklist para Pull Requests

- [ ] Código sigue la guía de estilo
- [ ] Tests añadidos/actualizados
- [ ] Documentation actualizada
- [ ] No hay breaking changes (o documentado)
- [ ] Build y tests pasan (`npm run build`, `npm test`)
- [ ] Commits son atómicos y descriptivos
- [ ] PR está enlazado con issues relacionados

## 📚 Recursos Útiles

- [Documentación Angular](https://angular.io/docs)
- [Documentación Ionic](https://ionicframework.com/docs)
- [RxJS Documentation](https://rxjs.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Material Design Guidelines](https://material.io/design)

## 🐛 Reportar Bugs

Usa el template de bug:

```markdown
## Descripción del Bug
[Descripción clara y concisa]

## Pasos para Reproducir
1. Ir a...
2. Hacer clic en...
3. Ver error...

## Comportamiento Esperado
[Qué debería ocurrir]

## Capturas de Pantalla
[Si aplica]

## Entorno
- OS: [Windows/macOS/Linux]
- Versión del Navegador: [Chrome/Safari/Firefox]
- Versión de Angular: 20.x
- Versión de Ionic: 7.x

## Logs/Errores
[Copiar logs de consola]
```

## 💡 Sugerencias de Features

Usa el template de feature:

```markdown
## Descripción
[Descripción clara de la feature]

## Caso de Uso
[Por qué es útil]

## Solución Propuesta
[Cómo implementarla]

## Alternativas Consideradas
[Otras opciones]

## Contexto Adicional
[Información extra]
```

## ❓ Preguntas?

- 📧 Email: soporte@nedetel.com
- 💬 Discussions: GitHub Discussions
- 📞 Issues: Para bugs específicos

---

**¡Gracias por contribuir a NEDETEL! 🚀**