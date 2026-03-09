# 📱 Guía de Compilación Nativa - NEDETEL Data Center

## 🚀 Flujo rápido (Web y Android)

### 1) Levantar backend (API)

Desde `nedetel-backend/nedetel_api/nedetel-api`:

```bash
npm install
npx prisma generate
npm run start:dev
```

API: `http://localhost:3000/api`

### 2) Abrir y probar en Web

Desde `nedetel-frontend`:

```bash
npm install
npm start
```

Web: `http://localhost:4200`

### 3) Abrir en Android Studio

Desde `nedetel-frontend`:

```bash
npm run build
npx cap sync android
npx cap open android
```

Luego en Android Studio: `Run > Run 'app'` con el emulador encendido.

> Importante: cada cambio de frontend requiere `npm run build` + `npx cap sync android` antes de volver a ejecutar en Android Studio.

## Compilar para Dispositivos Reales

### Android

#### Requisitos Previos
- Android Studio instalado
- Java Development Kit (JDK) 11 o superior
- SDK de Android API 31+

#### Pasos

```bash
# 1. Compilar el proyecto Angular
npm run build

# 2. Agregar plataforma Android (primera vez)
ionic cap add android

# 3. Abrir en Android Studio
ionic cap open android

# 4. En Android Studio:
#    - Click en "Build" → "Generate Signed Bundle / APK"
#    - Seleccionar "APK"
#    - Crear keystore o usar existente
#    - Completar formulario
#    - Compilar
```

#### Testing en Emulador
```bash
# Después de abrir Android Studio:
# 1. Abre Android Virtual Device Manager
# 2. Crea o selecciona un emulador
# 3. Inicia el emulador
# 4. En Android Studio: Run > Run 'app'
```

#### Instalación en Dispositivo Físico
```bash
# 1. Conecta el dispositivo con USB
# 2. Habilita "Depuración USB" en desarrollo
# 3. En Android Studio: 
#    Run > Run 'app' 
#    Selecciona tu dispositivo
```

---

### iOS (Solo en macOS)

#### Requisitos Previos
- macOS 12 o superior
- Xcode 14+
- CocoaPods instalado
- Cuenta Apple Developer

#### Pasos

```bash
# 1. Compilar el proyecto Angular
npm run build

# 2. Agregar plataforma iOS (primera vez)
ionic cap add ios

# 3. Abrir en Xcode
ionic cap open ios

# 4. En Xcode:
#    - Seleccionar equipo (Team)
#    - Configurar firma de código
#    - Build & Run
```

#### Testing en Simulador
```bash
# En Xcode:
# 1. Arriba a la izquierda: selecciona simulador (iPhone 14, etc)
# 2. Click en Play o Cmd + R
```

#### Instalación en Dispositivo Físico
```bash
# 1. Conecta iPhone/iPad con Thunderbolt/USB-C
# 2. En Xcode: Window > Devices and Simulators
# 3. Selecciona tu dispositivo
# 4. Build & Run
```

---

## Web (Más Fácil para Demostración)

### Ejecución en Desarrollo
```bash
npm start
# Abre http://localhost:4200
```

### Build de Producción
```bash
npm run build
# Genera carpeta /www con archivos compilados
```

### Desplegar en GitHub Pages
```bash
npm run build:gh
npm run deploy:gh
# Disponible en: https://tu-usuario.github.io/NEDETEL_ciudad_digital/
```

---

## Consideraciones Importantes

### Permisos en Android
Edita `android/app/src/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

### Permisos en iOS
Edita `ios/App/App/Info.plist`:
```xml
<key>NSLocalNetworkUsageDescription</key>
<string>La aplicación necesita acceso a tu red local</string>
```

### Configuración de API
Actualiza las URLs según el entorno:
```typescript
// src/environments/environment.ts (desarrollo)
apiUrl: 'http://localhost:3000/api'

// src/environments/environment.prod.ts (producción)
apiUrl: 'https://api.nedetel.com/api'
```

---

## Versioning

### Actualizar Versión
```bash
# En package.json y capacitor.config.json
"version": "1.0.1"

# Luego sincronizar
ionic cap sync
```

---

## Distribución

### App Store (iOS)
1. Cuenta Apple Developer ($99/año)
2. Crear certificados de firma
3. Crear bundle identifier único
4. Build para producción en Xcode
5. Enviar a App Store Connect

### Google Play (Android)
1. Google Play Developer Account ($25 único)
2. Crear keystore para firma
3. Build APK/AAB firmado
4. Enviar a Google Play Console

---

## Testing en Dispositivos

### Lista de Dispositivos Conectados
```bash
# Android
adb devices

# iOS
xcrun xctrace list devices
```

### Debugging Remoto
```bash
# Android - Chrome DevTools
# 1. Abre Chrome
# 2. chrome://inspect
# 3. Selecciona tu dispositivo

# iOS - Safari Web Inspector
# 1. Abre Safari
# 2. Develop > [Dispositivo] > [App]
```

---

## Troubleshooting

### Android: "Gradle build failed"
```bash
# Limpiar gradle
cd android
./gradlew clean

# Volver y sincronizar
cd ..
ionic cap sync android
```

### iOS: "Pod install failed"
```bash
# Limpiar CocoaPods
cd ios/App
pod deintegrate
pod install
cd ../..
```

### Puertos en Conflicto
```bash
# Si el puerto 4200 está ocupado
ng serve --port 4300
```

---

## Monitoreo de Rendimiento

### Android Profiler
En Android Studio:
- View > Tool Windows > Profiler
- Monitorea: CPU, Memoria, Red, Battery

### Xcode Instruments
En Xcode:
- Product > Profile (Cmd + I)
- Selecciona el instrumento a usar
- Analiza rendimiento

---

## Logs en Dispositivos

### Android Logcat
```bash
# Ver todos los logs
adb logcat

# Filtrar por app
adb logcat | grep nedetel

# Limpiar logs
adb logcat -c
```

### iOS Console
```bash
# En Xcode: View > Debug Area > Show Console
# O en Terminal:
log stream --level debug --predicate 'process == "nedetel"'
```

---

## Ciclo de Desarrollo

```
1. npm start (desarrollo web)
   ↓
2. Verificar en navegador
   ↓
3. ionic cap sync (sincronizar cambios)
   ↓
4. ionic cap open android/ios (abrir nativo)
   ↓
5. Compilar y testear en emulador/dispositivo
   ↓
6. npm run build (build final)
   ↓
7. Distribuir en tiendas
```

---

## Documentación Oficial

- [Ionic Capacitor Docs](https://capacitorjs.com/docs)
- [Android Studio Guide](https://developer.android.com/studio)
- [Xcode Documentation](https://developer.apple.com/xcode/)
- [Angular CLI Docs](https://angular.io/cli)

---

## Checklist Pre-Compilación

- [ ] Código compilado sin errores: `npm run build`
- [ ] Tests pasando: `npm run test`
- [ ] Lint sin warnings: `npm run lint`
- [ ] Variables de entorno configuradas
- [ ] URLs de API correctas
- [ ] Versión actualizada
- [ ] Icono de app configurado
- [ ] Splash screen configurado
- [ ] Permisos declarados
- [ ] Certificados válidos (iOS)
- [ ] Keystore configurado (Android)

---

**Última actualización: 28 de enero de 2026**