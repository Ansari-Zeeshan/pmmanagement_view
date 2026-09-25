#!/bin/bash
set -e

PROJECT_ID="pmmainview"
REGION="asia-south1"
CLUSTER_NAME="pmmanagement-cluster"

echo "=========================================================="
echo "🚀 GKE Deployment Script for Project: ${PROJECT_ID}"
echo "=========================================================="

# 1. Enable Required GCP APIs
echo "📦 1. Enabling GCP Container, Artifact Registry & Compute APIs..."
gcloud services enable container.googleapis.com artifactregistry.googleapis.com compute.googleapis.com --project=${PROJECT_ID}

# 2. Configure GCP Project & Docker Authentication
echo "🔐 2. Configuring GCP Project & Docker Auth..."
gcloud config set project ${PROJECT_ID}
gcloud auth configure-docker

# 3. Check / Create GKE Cluster
echo "☸️ 3. Checking GKE Cluster '${CLUSTER_NAME}'..."
if ! gcloud container clusters describe ${CLUSTER_NAME} --zone=${REGION}-a --project=${PROJECT_ID} >/dev/null 2>&1; then
    echo "Creating new GKE Cluster '${CLUSTER_NAME}' in ${REGION}-a (2 nodes)..."
    gcloud container clusters create ${CLUSTER_NAME} \
        --zone=${REGION}-a \
        --num-nodes=2 \
        --machine-type=e2-medium \
        --project=${PROJECT_ID}
fi

# 4. Get GKE Credentials for kubectl
echo "🔑 4. Fetching GKE Cluster Credentials..."
gcloud container clusters get-credentials ${CLUSTER_NAME} --zone=${REGION}-a --project=${PROJECT_ID}

# 5. Build & Push Docker Container Images
echo "🐳 5. Building & Pushing Docker Images to gcr.io/${PROJECT_ID}..."
docker build -t gcr.io/${PROJECT_ID}/pmmanagement-backend:latest ./backend
docker push gcr.io/${PROJECT_ID}/pmmainview/pmmanagement-backend:latest || docker push gcr.io/${PROJECT_ID}/pmmanagement-backend:latest

docker build -t gcr.io/${PROJECT_ID}/pmmanagement-frontend:latest ./frontend
docker push gcr.io/${PROJECT_ID}/pmmanagement-frontend:latest

# 6. Apply Kubernetes Manifests to GKE
echo "☸️ 6. Applying Kubernetes Deployment Manifests..."
kubectl apply -f gke/backend-deployment.yaml
kubectl apply -f gke/frontend-deployment.yaml
kubectl apply -f gke/ingress.yaml

echo "=========================================================="
echo "🎉 GKE Deployment Finished Successfully!"
echo "Run 'kubectl get svc frontend-service' to view your Live Public IP."
echo "=========================================================="
