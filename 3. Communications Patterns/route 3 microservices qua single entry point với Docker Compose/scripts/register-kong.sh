#!/usr/bin/env bash
set -euo pipefail

KONG_ADMIN_URL="${KONG_ADMIN_URL:-http://localhost:8001}"

wait_for_kong() {
  echo "Waiting for Kong Admin API at ${KONG_ADMIN_URL} ..."
  for _ in {1..60}; do
    if curl -fsS "${KONG_ADMIN_URL}/status" >/dev/null 2>&1; then
      echo "Kong is ready."
      return 0
    fi
    sleep 2
  done
  echo "Kong is not ready after timeout."
  return 1
}

upsert_service() {
  local name="$1"
  local url="$2"

  curl -fsS -X PUT "${KONG_ADMIN_URL}/services/${name}" \
    --data "name=${name}" \
    --data "url=${url}" >/dev/null
}

upsert_route() {
  local service="$1"
  local route="$2"
  local path="$3"

  curl -fsS -X PUT "${KONG_ADMIN_URL}/services/${service}/routes/${route}" \
    --data "name=${route}" \
    --data "paths[]=${path}" \
    --data "strip_path=false" \
    --data "preserve_host=false" >/dev/null
}

main() {
  wait_for_kong

  echo "Register services..."
  upsert_service "user-service" "http://user-service:3001"
  upsert_service "product-service" "http://product-service:3002"
  upsert_service "order-service" "http://order-service:3000"

  echo "Register routes..."
  upsert_route "user-service" "user-route" "/users"
  upsert_route "product-service" "product-route" "/products"
  upsert_route "order-service" "order-route" "/orders"

  echo "Done."
  echo "Try:"
  echo "  curl -i http://localhost:8000/users"
  echo "  curl -i http://localhost:8000/products"
  echo "  curl -i http://localhost:8000/orders"
}

main "$@"

