#!/usr/bin/env bash
set -e
if [ -z "$DOCKERHUB" ]; then echo "Set DOCKERHUB env var (export DOCKERHUB=yourname)"; exit 1; fi
./scripts/build_and_push.sh
for f in k8s/*.yaml; do
  sed -i.bak "s|\${DOCKERHUB}|$DOCKERHUB|g" $f
done
kubectl apply -f k8s/
# install prometheus+grafana via helm if not present
if ! helm status monitoring >/dev/null 2>&1; then
  helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
  helm repo update
  helm install monitoring prometheus-community/kube-prometheus-stack --namespace monitoring --create-namespace
fi
echo "To access Grafana run: kubectl port-forward svc/monitoring-grafana -n monitoring 3000:80"
