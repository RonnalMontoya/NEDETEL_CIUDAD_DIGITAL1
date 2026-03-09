# Performance Workshop Guide (NestJS + Prisma + PostgreSQL)

## 1) Start backend

```powershell
Set-Location "c:\Users\usuario\Desktop\UNIVERSIDAD ESTATAL AMAZONICA\5TO SEMESTRE\APLICACIONES MOVILES\APLICACION PROYECTO IONIC\nedetel_ciudad_digital\nedetel-backend\nedetel_api\nedetel-api"
npm run start:dev
```

Base URL:

```text
http://localhost:3000/api/performance
```

## 2) Seed data

```powershell
$base='http://localhost:3000/api/performance'
Invoke-RestMethod -Method Post -Uri "$base/seed" | ConvertTo-Json -Depth 5
```

## 3) Cache evidence (same endpoint twice)

```powershell
$base='http://localhost:3000/api/performance'
$r1=Invoke-RestMethod -Method Get -Uri "$base/catalog/categories?limit=50&offset=0"
$r2=Invoke-RestMethod -Method Get -Uri "$base/catalog/categories?limit=50&offset=0"
"first_cacheHit=$($r1.meta.cacheHit) first_tookMs=$($r1.meta.tookMs)"
"second_cacheHit=$($r2.meta.cacheHit) second_tookMs=$($r2.meta.tookMs)"
```

Expected:
- First call can be slower.
- Second call should show `cacheHit=True` and lower `tookMs`.

## 4) N+1 evidence (naive vs batched/DataLoader)

```powershell
$base='http://localhost:3000/api/performance'
$n=Invoke-RestMethod -Method Get -Uri "$base/orders/naive?limit=40&offset=0&include=items.product"
$b=Invoke-RestMethod -Method Get -Uri "$base/orders/batched?limit=40&offset=0&include=items.product"
"naive_tookMs=$($n.meta.tookMs)"
"batched_tookMs=$($b.meta.tookMs)"
```

Expected:
- `naive_tookMs` > `batched_tookMs` in most runs.

## 5) Queue evidence (create and poll job)

```powershell
$base='http://localhost:3000/api/performance'
$job=Invoke-RestMethod -Method Post -Uri "$base/jobs/reports" -ContentType 'application/json' -Body '{"type":"orders-report"}'
"created_id=$($job.id) status=$($job.status)"

for($i=1;$i -le 10;$i++){
	$st=Invoke-RestMethod -Method Get -Uri "$base/jobs/$($job.id)"
	"attempt=$i status=$($st.status) hasResult=$([bool]$st.result)"
	if($st.status -eq 'COMPLETED'){ break }
	Start-Sleep -Seconds 1
}
```

Expected:
- First status can be `PENDING`/`PROCESSING`.
- Then status should become `COMPLETED` with `hasResult=True`.

## 6) Optional lazy-loading evidence

```powershell
$base='http://localhost:3000/api/performance'
Invoke-RestMethod -Method Get -Uri "$base/catalog/products?limit=5&offset=0" | ConvertTo-Json -Depth 5
Invoke-RestMethod -Method Get -Uri "$base/catalog/products?limit=5&offset=0&include=category" | ConvertTo-Json -Depth 5
```

Use this to show:
- Pagination via `limit/offset`.
- Conditional relations via `include=category`.

