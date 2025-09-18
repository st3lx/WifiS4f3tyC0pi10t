# Simple Windows script to get network info
Write-Host "{
  'gateway': '$((Get-NetIPConfiguration | Where-Object { $_.IPv4DefaultGateway -ne $null }).IPv4DefaultGateway.NextHop)',
  'openPorts': []
}"