# Enhanced WiFi Safety Copilot Scan Script for Windows
# Save this as scan.ps1 in your 'scripts' folder on GitHub

# Function to get the default gateway (router IP)
$gateway = (Get-NetIPConfiguration | Where-Object { $_.IPv4DefaultGateway -ne $null }).IPv4DefaultGateway.NextHop

# Function to get the public IP address
try {
    $publicIP = (Invoke-WebRequest -Uri "https://api.ipify.org" -UseBasicParsing).Content
} catch {
    $publicIP = "Failed to retrieve"
}

# Function to get a list of connected devices (via ARP table)
$devices = Get-NetNeighbor -AddressFamily IPv4 | Where-Object { $_.State -eq "Reachable" } | Select-Object IPAddress, LinkLayerAddress, State

# Function to check if common router admin ports are open on the public IP (SIMULATION - See Note below)
# Note: Actual port scanning from a web-served script is slow, complex, and often blocked. We simulate it.
$commonPorts = @(80, 443, 22, 23, 8080, 21)
$openPorts = @() # Empty array for real use
# $openPorts = @(80, 443) # Uncomment this line to simulate finding open ports for testing

# Function to get Network Profile type (Public/Private) which affects firewall rules
$networkProfile = (Get-NetConnectionProfile | Where-Object { $_.IPv4Connectivity -eq "Internet" }).Name

# Build the result object
$result = [PSCustomObject]@{
    gateway = $gateway
    publicIP = $publicIP
    networkProfile = $networkProfile
    openPorts = $openPorts
    # deviceCount = $devices.Count
    # For simplicity, we'll just send the count. Sending all MAC addresses could be a privacy concern.
    connectedDeviceCount = $devices.Count
}

# Output the result as JSON
$result | ConvertTo-Json

# Note: A full port scan is not performed due to technical and ethical constraints.
# This script is designed for safety and user education.