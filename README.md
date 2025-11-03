# ecommerce-microservices

Complete mini eCommerce microservices project for a CCD mini project.

## Quick local run

1. Enable Kubernetes in Docker Desktop.

2. Set DOCKERHUB env var:
   export DOCKERHUB=mydockerhubusername

3. Build & run locally with Docker Compose (quick smoke test):
   docker-compose up --build

4. Or run the automated local deploy (build, push to Docker Hub, deploy to k8s, install monitoring):
   chmod +x scripts/*.sh
   ./scripts/deploy_local.sh

## OpenFaaS (local serverless)

- Install OpenFaaS on your cluster (arkade/faas-cli recommended).
- Build the payment function in /openfaas/payment and deploy with faas-cli.

## AWS Lambda (cloud serverless)

- Use /lambda/paymentFunction.js for the Lambda implementation and create an API Gateway trigger.

## Notes
- Update k8s manifests with your Docker image repo (scripts attempt to replace ${DOCKERHUB}).
- Jenkinsfile is in /jenkins/Jenkinsfile and assumes a Jenkins instance with Docker & kubectl access.
