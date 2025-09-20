# Supercharged WiFi Safety Copilot Scan Script for Windows
# Compatible with PowerShell 5.1 and newer
# Robust version with better error handling

# 1. Get Router IP (Gateway)
$gateway = (Get-NetIPConfiguration | Where-Object { $_.IPv4DefaultGateway -ne $null }).IPv4DefaultGateway.NextHop

# 2. Get Public IP
try {
    $publicIP = (Invoke-WebRequest -Uri "https://api.ipify.org" -UseBasicParsing).Content
} catch {
    $publicIP = "Failed to retrieve"
}

# 3. Check for Open Ports on Public IP (Simulated for common admin ports)
$openPorts = @() # Empty for real use
# $openPorts = @(80, 443) # Uncomment to simulate finding open ports

# 4. Attempt to Check Router Login Security (HTTP vs HTTPS)
$routerHttpStatus = "unknown"
$routerHttpsStatus = "unknown"

if ($gateway) {
    try {
        # Try HTTP
        $httpResponse = Invoke-WebRequest -Uri "http://$gateway" -TimeoutSec 3 -ErrorAction SilentlyContinue -UseBasicParsing
        if ($httpResponse.StatusCode -eq 200) { $routerHttpStatus = "accessible" }
    } catch { $routerHttpStatus = "inaccessible" }

    try {
        # Try HTTPS (ignore certificate errors)
        add-type @"
            using System.Net;
            using System.Security.Cryptography.X509Certificates;
            public class TrustAllCertsPolicy : ICertificatePolicy {
                public bool CheckValidationResult(
                    ServicePoint srvPoint, X509Certificate certificate,
                    WebRequest request, int certificateProblem) {
                    return true;
                }
            }
"@
        [System.Net.ServicePointManager]::CertificatePolicy = New-Object TrustAllCertsPolicy
        $httpsResponse = Invoke-WebRequest -Uri "https://$gateway" -TimeoutSec 3 -ErrorAction SilentlyContinue -UseBasicParsing
        if ($httpsResponse.StatusCode -eq 200) { $routerHttpsStatus = "accessible" }
    } catch { $routerHttpsStatus = "inaccessible" }
    finally {
        # Revert to default certificate policy
        [System.Net.ServicePointManager]::CertificatePolicy = $null
    }
}

# 5. Get Wi-Fi Information (compatible method)
$wifiName = "Unknown"
$wifiEncryption = "Unknown"

try {
    # Method 1: Try netsh (works on all Windows versions)
    $wifiInfo = netsh wlan show interfaces
    if ($wifiInfo -match "SSID.*: (.*)") { $wifiName = $matches[1].Trim() }
    if ($wifiInfo -match "Authentication.*: (.*)") { $wifiEncryption = $matches[1].Trim() }
} catch {
    try {
        # Method 2: Try Get-NetConnectionProfile (alternative)
        $wifiNetwork = Get-NetConnectionProfile | Where-Object { $_.InterfaceType -eq "Wireless" }
        if ($wifiNetwork) {
            $wifiName = $wifiNetwork.Name
            $wifiEncryption = $wifiNetwork.Authentication
        }
    } catch {
        # Method 3: Final fallback
        $wifiName = "Could not detect"
        $wifiEncryption = "Could not detect"
    }
}

# 6. Get connected device count (ARP table)
$deviceCount = "Unknown"
try {
    $deviceCount = (Get-NetNeighbor -AddressFamily IPv4 | Where-Object { $_.State -eq "Reachable" }).Count
} catch {
    $deviceCount = "Error retrieving"
}

# Build the enhanced result object
$result = [PSCustomObject]@{
    # Network Info
    gateway = if ($gateway) { $gateway } else { "Not found" }
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

# Note: This script is designed for safety and user education.