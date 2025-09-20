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

# 6. Get DNS Servers
DNS_SERVERS=$(cat /etc/resolv.conf | grep 'nameserver' | awk '{print $2}' | tr '\n' ',' | sed 's/,$//')
if [ -z "$DNS_SERVERS" ]; then DNS_SERVERS="Unknown"; fi

# 7. Check for common open ports on router
check_port() {
local port=$1
if nc -z -w 2 $GATEWAY $port 2>/dev/null; then
echo $port
fi
}

OPEN_PORTS="["
for port in 80 443 22 23 21 8080 8443; do
result=$(check_port $port)
if [ ! -z "$result" ]; then
OPEN_PORTS="$OPEN_PORTS$result,"
fi
done
OPEN_PORTS=$(echo $OPEN_PORTS | sed 's/,$//')
OPEN_PORTS="$OPEN_PORTS]"

#Get network interface information
INTERFACE=$(route get default 2>/dev/null | grep interface | awk '{print $2}')
if [ ! -z "$INTERFACE" ]; then
MAC_ADDRESS=$(ifconfig $INTERFACE 2>/dev/null | grep ether | awk '{print $2}')
IP_ADDRESS=$(ipconfig getifaddr $INTERFACE 2>/dev/null)
else
MAC_ADDRESS="Unknown"
IP_ADDRESS="Unknown"
fi

# 9. Check if WIFI or Ethernet
CONNECTION_TYPE="Unknown"
if [ ! -z "$SSID" ] && [ "$SSID" != "Unknown" ]; then
CONNECTION_TYPE="WiFi"
else
CONNECTION_TYPE="Ethernet"
fi

# Check for WPS status (if available)
WPS_STATUS="Unknown"
if command -v iw &> /dev/null; then
    WPS_STATUS=$(iw dev 2>/dev/null | grep -i wps | head -1 | xargs || echo "Not detectable")
fi

# Check for UPnP status
UPNP_STATUS="Unknown"
if command -v upnpc &> /dev/null; then
    UPNP_STATUS=$(upnpc -l 2>&1 | head -5 | grep -i "upnp" || echo "Not detectable")
fi

# Check for Guest Network (Mac-specific)
GUEST_NETWORK="Unknown"
if [ "$(uname)" = "Darwin" ]; then
    GUEST_NETWORK=$(networksetup -listallhardwareports 2>/dev/null | grep -i "guest" || echo "Not detectable")
fi
# Get System Information
OS=$(sw_vers -productName 2>/dev/null || uname -s)
OS_VERSION=$(sw_vers -productVersion 2>/dev/null || uname -r)

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
"connectedDeviceCount": $DEVICE_COUNT,
"dnsServers": "$DNS_SERVERS",
"macAddress": "$MAC_ADDRESS",
"ipAddress": "$IP_ADDRESS",
"connectionType": "$CONNECTION_TYPE",
"operatingSystem": "$OS",
"osVersion": "$OS_VERSION"
 "wpsStatus": "$WPS_STATUS",
  "upnpStatus": "$UPNP_STATUS",
  "guestNetworkDetected": "$GUEST_NETWORK",
  "timestamp": "$(date +%Y-%m-%d_%H:%M:%S)"
}
EOF