#!/bin/bash
# Simple Mac/Linux script to get network info
GATEWAY=$(netstat -rn | grep default | head -1 | awk '{print $2}')
echo "{
  \"gateway\": \"$GATEWAY\",
  \"openPorts\": []
}"