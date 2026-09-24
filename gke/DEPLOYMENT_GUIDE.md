# Deploying to Google Kubernetes Engine (GKE)

This document provides step-by-step instructions to build, push, and deploy the **Frontend** and **Backend** microservices to Google Kubernetes Engine (GKE).

---

## 🏗️ Project Architecture

```
pmmanagement_view/
├── frontend/               # React + Vite application & static UI assets
│   ├── Dockerfile          # Multi-stage production build (Node + Nginx)
│   ├── nginx.conf          # Nginx routing & API proxy configuration
│   └── src/                # React source code
├── backend/                # Node.js + Express backend service
│   ├── Dockerfile          # Production Node.js server image
│   └── src/                # Express controllers, models, routes & sockets
├── common/                 # Shared resources & Postman API Collection
├── gke/                    # Kubernetes manifests for GKE deployment
│   ├── frontend-deployment.yaml
│   ├── backend-deployment.yaml
│   └── ingress.yaml
└── docker-compose.yml      # Local multi-container orchestrator
```

---

## 🚀 Step 1: Set Up Google Cloud SDK & Authenticate

```bash
# 1. Login to Google Cloud
gcloud auth login

# 2. Set your GCP Project ID
gcloud config set project YOUR_GCP_PROJECT_ID

# 3. Authenticate Docker with GCP Artifact Registry / GCR
gcloud auth configure-docker
```

---

## 📦 Step 2: Build & Push Container Images to GCP

```bash
# Define your GCP Project ID variable
export PROJECT_ID="YOUR_GCP_PROJECT_ID"

# Build & Tag Frontend Image
docker build -t gcr.io/${PROJECT_ID}/pmmanagement-frontend:latest ./frontend
docker push gcr.io/${PROJECT_ID}/pmmanagement-frontend:latest

# Build & Tag Backend Image
docker build -t gcr.io/${PROJECT_ID}/pmmanagement-backend:latest ./backend
docker push gcr.io/${PROJECT_ID}/pmmanagement-backend:latest
```

---

## ☸️ Step 3: Connect to your GKE Cluster & Deploy

```bash
# Get GKE cluster credentials
gcloud container clusters get-credentials YOUR_CLUSTER_NAME --zone YOUR_CLUSTER_ZONE --project ${PROJECT_ID}

# Update image URLs in gke/frontend-deployment.yaml and gke/backend-deployment.yaml with your PROJECT_ID

# Deploy Backend & Frontend services to GKE
kubectl apply -f gke/backend-deployment.yaml
kubectl apply -f gke/frontend-deployment.yaml
kubectl apply -f gke/ingress.yaml
```

---

## 🔍 Step 4: Verify Deployment

```bash
# Check running pods
kubectl get pods

# Check services and external IP
kubectl get services

# Check GKE ingress status
kubectl get ingress
```
