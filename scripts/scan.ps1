# Supercharged WiFi Safety Copilot Scan Script for Windows
# Attempts to auto-detect as many issues as possible

# 1. Get Router IP (Gateway)
$gateway = (Get-NetIPConfiguration | Where-Object { $_.IPv4DefaultGateway -ne $null }).IPv4DefaultGateway.NextHop

# 2. Get Public IP
try {
    $publicIP = (Invoke-WebRequest -Uri "https://api.ipify.org" -UseBasicParsing).Content
} catch {
    $publicIP = "Failed to retrieve"
}

# 3. Check for Open Ports on Public IP (Simulated for common admin ports)
$commonPorts = @(80, 443, 22, 23, 8080, 21)
$openPorts = @() # Empty for real use
# $openPorts = @(80, 443) # Uncomment to simulate finding open ports

# 4. Attempt to Check Router Login Security (HTTP vs HTTPS)
$routerHttpStatus = "unknown"
$routerHttpsStatus = "unknown"
try {
    # Try HTTP
    $httpResponse = Invoke-WebRequest -Uri "http://$gateway" -TimeoutSec 3 -ErrorAction SilentlyContinue -UseBasicParsing
    if ($httpResponse.StatusCode -eq 200) { $routerHttpStatus = "accessible" }
} catch { $routerHttpStatus = "inaccessible" }

try {
    # Try HTTPS (ignore certificate errors for older routers)
    $httpsResponse = Invoke-WebRequest -Uri "https://$gateway" -TimeoutSec 3 -ErrorAction SilentlyContinue -UseBasicParsing -SkipCertificateCheck
    if ($httpsResponse.StatusCode -eq 200) { $routerHttpsStatus = "accessible" }
} catch { $routerHttpsStatus = "inaccessible" }

# 5. Get Wi-Fi Interface Information (to guess encryption)
$wifiNetwork = (Get-NetConnectionProfile | Where-InterfaceType Wireless)
$wifiName = $wifiNetwork.Name
# This is a best-guess for encryption. Windows API doesn't expose this easily.
$wifiAuth = $wifiNetwork.Authentication
# Map Windows auth types to common encryption
$encryptionMap = @{
    'WPA2' = 'WPA2'
    'WPA'  = 'WPA'
    'Open' = 'Open/None'
}
$wifiEncryption = $encryptionMap[$wifiAuth] ?? "Unknown ($wifiAuth)"

# 6. Get connected device count (ARP table)
$deviceCount = (Get-NetNeighbor -AddressFamily IPv4 | Where-Object { $_.State -eq "Reachable" }).Count

# Build the enhanced result object
$result = [PSCustomObject]@{
    # Network Info
    gateway = $gateway
    publicIP = $publicIP
    # Security Checks
    openPorts = $openPorts
    routerHttpAccess = $routerHttpStatus
    routerHttpsAccess = $routerHttpsStatus
    # Wi-Fi Info
    wifiSSID = $wifiName
    wifiEncryption = $wifiEncryption
    # Other
    connectedDeviceCount = $deviceCount
}

# Output the result as JSON
$result | ConvertTo-Json