# 🚀 Google Kubernetes Engine (GKE) Deployment Guide

**GCP Project ID**: `pmmainview`  
**GCP Project Number**: `929959382758`

---

## 📋 Overview

The project has been fully configured for Google Cloud & GKE multi-container deployment:
- **`backend/Dockerfile`** $\rightarrow$ Builds production Node.js/Express API container (`gcr.io/pmmainview/pmmanagement-backend:latest`).
- **`frontend/Dockerfile`** $\rightarrow$ Multi-stage React + Vite compile into production Nginx container (`gcr.io/pmmainview/pmmanagement-frontend:latest`).
- **`gke/backend-deployment.yaml`** $\rightarrow$ GKE Deployment & Service for backend API.
- **`gke/frontend-deployment.yaml`** $\rightarrow$ GKE Deployment & LoadBalancer Service for public frontend access.
- **`gke/ingress.yaml`** $\rightarrow$ Ingress controller routing rules.

---

## 💻 Method A: Deploy using Google Cloud Shell (Easiest - 1 Click)

1. Open your browser in Google Cloud Console: **https://console.cloud.google.com/welcome?project=pmmainview**
2. Click the **Activate Cloud Shell** icon `>_` at the top right header.
3. In Cloud Shell, run:
```bash
# Clone or upload project repository to Cloud Shell, then navigate to root
cd pmmanagement_view

# Run automated deployment script
chmod +x gke/deploy-to-gke.sh
./gke/deploy-to-gke.sh
```

---

## 🛠️ Method B: Deploy from Local Terminal (Step-by-Step)

### Step 1: Enable GCP APIs
```bash
gcloud services enable container.googleapis.com artifactregistry.googleapis.com compute.googleapis.com --project=pmmainview
```

### Step 2: Configure GCP Project & Docker Authentication
```bash
gcloud config set project pmmainview
gcloud auth configure-docker
```

### Step 3: Create GKE Cluster
```bash
gcloud container clusters create pmmanagement-cluster \
    --zone=asia-south1-a \
    --num-nodes=2 \
    --machine-type=e2-medium \
    --project=pmmainview
```

### Step 4: Get GKE Cluster Credentials
```bash
gcloud container clusters get-credentials pmmanagement-cluster --zone=asia-south1-a --project=pmmainview
```

### Step 5: Build & Push Images to Container Registry
```bash
# Build & Push Backend
docker build -t gcr.io/pmmainview/pmmanagement-backend:latest ./backend
docker push gcr.io/pmmainview/pmmanagement-backend:latest

# Build & Push Frontend
docker build -t gcr.io/pmmainview/pmmanagement-frontend:latest ./frontend
docker push gcr.io/pmmainview/pmmanagement-frontend:latest
```

### Step 6: Deploy Manifests to GKE
```bash
kubectl apply -f gke/backend-deployment.yaml
kubectl apply -f gke/frontend-deployment.yaml
kubectl apply -f gke/ingress.yaml
```

---

## 🌐 Step 7: Verify Live Application & Get Public IP

```bash
# View LoadBalancer external IP for frontend
kubectl get svc frontend-service

# Check running pods status
kubectl get pods
```

Once `EXTERNAL-IP` is assigned by Google Cloud, open `http://<EXTERNAL-IP>` in your browser!
