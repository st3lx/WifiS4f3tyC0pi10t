#!/bin/bash

# Enhanced WiFi Safety Copilot Scan Script for Mac and Linux
# Save this as scan.sh in your 'scripts' folder on GitHub

# Function to get the default gateway (router IP)
GATEWAY=$(netstat -rn | grep -E 'default|0.0.0.0' | grep -E 'UG|UHL' | head -n 1 | awk '{print $2}' | grep -E '([0-9]{1,3}\.){3}[0-9]{1,3}')

# Function to get the public IP address
PUBLIC_IP=$(curl -s https://api.ipify.org)
if [ -z "$PUBLIC_IP" ]; then
    PUBLIC_IP="Failed to retrieve"
fi

# Function to get a list of connected devices (via ARP table)
# Get count of devices. 'arp -a' lists devices, grep for lines with IPs, count them.
# This is a rough estimate.
DEVICE_COUNT=$(arp -a | grep -E '([0-9]{1,3}\.){3}[0-9]{1,3}' | wc -l | tr -d ' ')

# Function to check if common router admin ports are open on the public IP (SIMULATION)
# Actual port scanning is complex for a cross-platform script. We return an empty list.
OPEN_PORTS="[]"
# OPEN_PORTS="[80, 443]" # Uncomment to simulate finding open ports for testing

# Get Wi-Fi network name (SSID) - Mac specific, may not work on all Linux
SSID=$(networksetup -getairportnetwork en0 2>/dev/null | cut -d : -f 2 | xargs)
if [ -z "$SSID" ]; then
    SSID="Unknown"
fi

# Build the result JSON manually
cat <<EOF
{
  "gateway": "$GATEWAY",
  "publicIP": "$PUBLIC_IP",
  "ssid": "$SSID",
  "openPorts": $OPEN_PORTS,
  "connectedDeviceCount": $DEVICE_COUNT
}
EOF