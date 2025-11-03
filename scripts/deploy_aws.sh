#!/usr/bin/env bash
set -e
if [ -z "$AWS_ACCOUNT_ID" ] || [ -z "$AWS_REGION" ] || [ -z "$DOCKERHUB" ]; then
  echo "Set AWS_ACCOUNT_ID, AWS_REGION and DOCKERHUB env vars"
  exit 1
fi
SERVICES=(auth product cart order)
for s in "${SERVICES[@]}"; do
  REPO=$s-service
  aws ecr describe-repositories --repository-names $REPO --region $AWS_REGION >/dev/null 2>&1 || \
    aws ecr create-repository --repository-name $REPO --region $AWS_REGION
  ECR_URI=$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$REPO:latest
  docker build -t $REPO ./$s-service
  aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
  docker tag $REPO:latest $ECR_URI
  docker push $ECR_URI
done
echo "Images pushed to ECR. Now you can launch EC2/EKS and update k8s manifests to use ECR URIs."
