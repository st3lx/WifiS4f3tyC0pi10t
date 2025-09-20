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
$httpResponse = Invoke-WebRequest -Uri "http://$gateway" -TimeoutSec 5 -ErrorAction SilentlyContinue -UseBasicParsing
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

# 5. Get DNS Servers
$dnsServers = "Unknown"
try {
$dnsConfig = Get-DnsClientServerAddress -AddressFamily IPv4 | Where-Object { $_.ServerAddresses.Count -gt 0 }
$dnsServers = ($dnsConfig.ServerAddresses -join ",")
} catch {
$dnsServers = "Error retrieving"
}

# 6.Get network interface information
$macAddress = "Unknown"
$ipAddress = "Unknown"
$connectionType = "Unknown"
try {
$adapter = Get-NetAdapter | Where-Object { $_.Status -eq "Up" } | Select-Object -First 1
$macAddress = $adapter.MacAddress
$ipAddress = (Get-NetIPAddress -InterfaceIndex $adapter.ifIndex -AddressFamily IPv4).IPAddress
$connectionType = $adapter.InterfaceDescription
if ($connectionType -like "Wi-Fi" -or $connectionType -like "Wireless") {
$connectionType = "WiFi"
} elseif ($connectionType -like "Ethernet" -or $connectionType -like "LAN") {
$connectionType = "Ethernet"
}
} catch {
# If above fails, try alternative method
try {
$ipAddress = (Test-Connection -ComputerName $env:COMPUTERNAME -Count 1).IPV4Address.IPAddressToString
} catch {
$ipAddress = "Unknown"
}
}

# 7. Check for common open ports on router
$openPorts = @()
if ($gateway -and $gateway -notmatch "Not found|Error") {
    $commonPorts = 80, 443, 22, 23, 21, 8080, 8443
    foreach ($port in $commonPorts) {
        try {
            $tcpClient = New-Object System.Net.Sockets.TcpClient
            $result = $tcpClient.BeginConnect($gateway, $port, $null, $null)
            $success = $result.AsyncWaitHandle.WaitOne(500, $false)
            if ($success) {
                $openPorts += $port
                $tcpClient.EndConnect($result)
            }
            $tcpClient.Close()
        } catch {
            # Port is closed or unreachable
        }
    }
}

# Format open ports as JSON array
$openPortsJson = if ($openPorts.Count -gt 0) { 
    ($openPorts | ConvertTo-Json -Compress)
} else { 
    "[]" 
}

# 8. Get system information
$os = "Unknown"
$osVersion = "Unknown"
try {
    $osInfo = Get-WmiObject -Class Win32_OperatingSystem
    $os = $osInfo.Caption
    $osVersion = $osInfo.Version
} catch {
    # If WMI fails, try CIM
    try {
        $osInfo = Get-CimInstance -ClassName Win32_OperatingSystem
        $os = $osInfo.Caption
        $osVersion = $osInfo.Version
    } catch {
        # If both methods fail, leave as "Unknown"
    }
}

# Build Result Object
$result = [PSCustomObject]@{
    # Network Info
    gateway = $gateway
    publicIP = $publicIP
    
    # Security Checks
    routerHttpAccess = $routerHttpStatus
    routerHttpsAccess = $routerHttpsStatus
    openPorts = $openPortsJson
    
    # Network Configuration
    dnsServers = $dnsServers
    macAddress = $macAddress
    ipAddress = $ipAddress
    connectionType = $connectionType
    connectedDeviceCount = $deviceCount
    
    # System Info
    operatingSystem = $os
    osVersion = $osVersion
}

# Output the result as JSON
$result | ConvertTo-Json

# Note: Wi-Fi SSID and Encryption removed as they're unreliable in this context
