#!/usr/bin/env bash
set -euo pipefail

echo "1) Kong Admin API"
curl -fsS http://localhost:8001/status | head -c 200
echo

echo "2) Konga UI (HTTP 200/3xx)"
curl -I http://localhost:1337 | head -n 1
echo

echo "3) Gateway routes"
curl -I http://localhost:8000/users | head -n 1
curl -I http://localhost:8000/products | head -n 1
curl -I http://localhost:8000/orders | head -n 1
echo

echo "OK"

