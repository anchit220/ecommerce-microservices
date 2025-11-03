#!/usr/bin/env bash
set -e
if [ -z "$DOCKERHUB" ]; then echo "Set DOCKERHUB env var"; exit 1; fi
SERVICES=(auth product cart order)
for s in "${SERVICES[@]}"; do
  echo "Building $s-service..."
  docker build -t $DOCKERHUB/$s-service:latest ./$s-service
  echo "Pushing $s-service..."
  aws ecr describe-repositories --repository-names $s-service >/dev/null 2>&1 || true
  # attempt push (user may use docker hub)
  docker push $DOCKERHUB/$s-service:latest || echo "Push failed - check credentials"
done
