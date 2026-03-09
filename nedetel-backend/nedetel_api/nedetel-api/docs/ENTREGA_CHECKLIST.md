# Checklist de entrega

## Evidencias requeridas
- [x] Logs comparando sin cache vs con cache (misma consulta)
- [x] Logs de reduccion de consultas con DataLoader (N+1)
- [x] Log de encolado y procesamiento de tarea en job queue
- [x] Logs comparando lazy-loading (payload/tiempo)
- [x] Informe tecnico del flujo completo
- [x] Bibliografia

## Archivos clave
- Evidencias: `docs/evidencias/evidencias_20260308_004544.md`
- Informe tecnico: `docs/INFORME_TECNICO_PERFORMANCE.md`
- Bibliografia: `docs/BIBLIOGRAFIA.md`
- Guia de pruebas: `PERFORMANCE_WORKSHOP_GUIDE.md`
- Script auto-evidencias: `scripts/generate-performance-evidence.ps1`

## Publicacion en GitHub (API + configuracion)
1. Verificar cambios:
   - `git status`
2. Agregar cambios:
   - `git add .`
3. Crear commit:
   - `git commit -m "feat: performance optimization workshop evidence and report"`
4. Subir a rama remota:
   - `git push origin <tu-rama>`

## README (pasos de ejecucion)
Asegura que el README incluya:
- Requisitos (`Node`, `PostgreSQL`, variables de entorno)
- `npm install`
- `npx prisma migrate dev`
- `npm run start:dev`
- `./scripts/generate-performance-evidence.ps1`
