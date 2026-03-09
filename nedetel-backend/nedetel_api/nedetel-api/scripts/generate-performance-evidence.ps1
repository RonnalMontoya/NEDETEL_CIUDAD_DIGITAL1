$ErrorActionPreference = 'Stop'

$base = 'http://localhost:3000/api/performance'
$stamp = Get-Date -Format 'yyyyMMdd_HHmmss'
$outDir = Join-Path $PSScriptRoot "..\docs\evidencias"
$outDir = (Resolve-Path $outDir).Path
$reportPath = Join-Path $outDir "evidencias_$stamp.md"

function Write-Section($title) {
  Add-Content -Path $reportPath -Value "`n## $title`n"
}

function Write-CodeBlock($text) {
  Add-Content -Path $reportPath -Value ("-----`n" + $text + "`n-----")
}

# Header
Set-Content -Path $reportPath -Value "# Evidencias de rendimiento`n`nFecha: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')`n`nBase URL: $base`n"

# Seed (idempotente)
$seed = Invoke-RestMethod -Method Post -Uri "$base/seed"
Write-Section 'Seed data'
Write-CodeBlock (($seed | ConvertTo-Json -Depth 8))

# 1) Cache evidence (mismo endpoint, clave nueva para ver false -> true)
$cacheKeyLimit = Get-Random -Minimum 51 -Maximum 120
$c1 = Invoke-RestMethod -Method Get -Uri "$base/catalog/categories?limit=$cacheKeyLimit&offset=0"
$c2 = Invoke-RestMethod -Method Get -Uri "$base/catalog/categories?limit=$cacheKeyLimit&offset=0"

Write-Section 'Cache: sin cache vs con cache (misma consulta)'
$cacheSummary = @(
  "limit=$cacheKeyLimit",
  "first_cacheHit=$($c1.meta.cacheHit)",
  "first_tookMs=$($c1.meta.tookMs)",
  "second_cacheHit=$($c2.meta.cacheHit)",
  "second_tookMs=$($c2.meta.tookMs)"
) -join "`n"
Write-CodeBlock $cacheSummary

# 2) DataLoader evidence (N+1)
$n = Invoke-RestMethod -Method Get -Uri "$base/orders/naive?limit=40&offset=0&include=items.product"
$b = Invoke-RestMethod -Method Get -Uri "$base/orders/batched?limit=40&offset=0&include=items.product"

Write-Section 'DataLoader: reduccion de consultas (N+1)'
$dataloaderSummary = @(
  "naive_strategy=$($n.meta.strategy)",
  "naive_queryCount=$($n.meta.queryCount)",
  "naive_tookMs=$($n.meta.tookMs)",
  "batched_strategy=$($b.meta.strategy)",
  "batched_queryCount=$($b.meta.queryCount)",
  "batched_tookMs=$($b.meta.tookMs)"
) -join "`n"
Write-CodeBlock $dataloaderSummary

# 3) Queue evidence
$job = Invoke-RestMethod -Method Post -Uri "$base/jobs/reports" -ContentType 'application/json' -Body '{"type":"orders-report"}'
$pollLog = @()
$pollLog += "created_id=$($job.id) initial_status=$($job.status)"

$final = $null
for ($i = 1; $i -le 15; $i++) {
  $st = Invoke-RestMethod -Method Get -Uri "$base/jobs/$($job.id)"
  $pollLog += "attempt=$i status=$($st.status) hasResult=$([bool]$st.result)"
  if ($st.status -eq 'COMPLETED' -or $st.status -eq 'FAILED') {
    $final = $st
    break
  }
  Start-Sleep -Seconds 1
}

Write-Section 'Job queue: encolado y procesamiento'
Write-CodeBlock ($pollLog -join "`n")
if ($final) {
  Write-CodeBlock (($final | ConvertTo-Json -Depth 10))
}

# 4) Lazy-loading evidence (payload + tiempo)
$lz1 = Invoke-RestMethod -Method Get -Uri "$base/catalog/products?limit=5&offset=0"
$lz2 = Invoke-RestMethod -Method Get -Uri "$base/catalog/products?limit=5&offset=0&include=category"

$json1 = $lz1 | ConvertTo-Json -Depth 10
$json2 = $lz2 | ConvertTo-Json -Depth 10
$bytes1 = [System.Text.Encoding]::UTF8.GetByteCount($json1)
$bytes2 = [System.Text.Encoding]::UTF8.GetByteCount($json2)

Write-Section 'Lazy-loading: sin include vs include=category'
$lazySummary = @(
  "without_include_tookMs=$($lz1.meta.tookMs)",
  "without_include_payload_bytes=$bytes1",
  "with_include_tookMs=$($lz2.meta.tookMs)",
  "with_include_payload_bytes=$bytes2"
) -join "`n"
Write-CodeBlock $lazySummary

Write-Section 'Ruta del archivo generado'
Write-CodeBlock $reportPath

Write-Output "Evidence file generated: $reportPath"
