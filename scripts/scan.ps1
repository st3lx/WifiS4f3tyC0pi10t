# Ultra-Reliable WiFi Safety Copilot Scan Script for Windows
# Focuses on what can be reliably detected from any PowerShell session

# 1. Get Router IP (Gateway) - This usually works
$gateway = "Not found"
try {
    $gateway = (Get-NetIPConfiguration | Where-Object { $_.IPv4DefaultGateway -ne $null }).IPv4DefaultGateway.NextHop
} catch {
    # Try alternative method
    try {
        $gateway = (Get-NetRoute -DestinationPrefix "0.0.0.0/0" | Sort-Object RouteMetric | Select-Object -First 1).NextHop
    } catch {
        $gateway = "Error detecting"
    }
}

# 2. Get Public IP - This always works
try {
    $publicIP = (Invoke-WebRequest -Uri "https://api.ipify.org" -UseBasicParsing).Content
} catch {
    $publicIP = "Failed to retrieve"
}

# 3. Check Router Login Security (HTTP vs HTTPS) - Only if we found gateway
$routerHttpStatus = "unknown"
$routerHttpsStatus = "unknown"

if ($gateway -and $gateway -notmatch "Not found|Error") {
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
        [System.Net.ServicePointManager]::CertificatePolicy = $null
    }
}

# 4. Get connected device count (ARP table) - This usually works
$deviceCount = "Unknown"
try {
    $devices = Get-NetNeighbor -AddressFamily IPv4 | Where-Object { $_.State -eq "Reachable" }
    $deviceCount = $devices.Count
} catch {
    $deviceCount = "Error retrieving"
}

# Build the result object - ONLY including reliable data
$result = [PSCustomObject]@{
    # Network Info (RELIABLE)
    gateway = $gateway
    publicIP = $publicIP
    
    # Security Checks (RELIABLE if gateway found)
    routerHttpAccess = $routerHttpStatus
    routerHttpsAccess = $routerHttpsStatus
    
    # Other (RELIABLE)
    connectedDeviceCount = $deviceCount
}

# Output the result as JSON
$result | ConvertTo-Json

# Note: Wi-Fi SSID and Encryption removed as they're unreliable in this context