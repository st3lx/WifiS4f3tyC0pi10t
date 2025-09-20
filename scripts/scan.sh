#!/bin/bash

# Supercharged WiFi Safety Copilot Scan Script for Mac and Linux

# 1. Get Router IP
GATEWAY=$(netstat -rn | grep -E 'default|0.0.0.0' | grep -E 'UG|UHL' | head -n 1 | awk '{print $2}' | grep -E '([0-9]{1,3}\.){3}[0-9]{1,3}')

# 2. Get Public IP
PUBLIC_IP=$(curl -s https://api.ipify.org)
if [ -z "$PUBLIC_IP" ]; then PUBLIC_IP="Failed to retrieve"; fi

# 3. Check Router Login Security (HTTP vs HTTPS)
check_router_access() {
    local url=$1
    if curl --max-time 3 --silent --output /dev/null "$url"; then
        echo "accessible"
    else
        echo "inaccessible"
    fi
}
HTTP_STATUS=$(check_router_access "http://$GATEWAY")
HTTPS_STATUS=$(check_router_access "https://$GATEWAY")

# 4. Get Wi-Fi Information (Mac focus)
SSID=$(networksetup -getairportnetwork en0 2>/dev/null | cut -d : -f 2 | xargs)
if [ -z "$SSID" ]; then SSID="Unknown"; fi

# Try to get Wi-Fi Encryption (works on Mac)
ENCRYPTION=$(system_profiler SPAirPortDataType 2>/dev/null | grep "Security" | head -1 | awk '{print $2}')
if [ -z "$ENCRYPTION" ]; then ENCRYPTION="Unknown"; fi

# 5. Get connected device count
DEVICE_COUNT=$(arp -a | grep -E '([0-9]{1,3}\.){3}[0-9]{1,3}' | wc -l | tr -d ' ')

# 6. Simulated open ports (for demo)
OPEN_PORTS="[]"
# OPEN_PORTS="[80, 443]" # Uncomment to simulate open ports

# Build the enhanced result JSON
cat <<EOF
{
  "gateway": "$GATEWAY",
  "publicIP": "$PUBLIC_IP",
  "openPorts": $OPEN_PORTS,
  "routerHttpAccess": "$HTTP_STATUS",
  "routerHttpsAccess": "$HTTPS_STATUS",
  "wifiSSID": "$SSID",
  "wifiEncryption": "$ENCRYPTION",
  "connectedDeviceCount": $DEVICE_COUNT
}
EOF