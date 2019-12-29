#!/bin/bash
set -exu -o pipefail

# Build frontend
(cd frontend && \
    npm install &&
    npm run-script build)

# Build back-end
(cd backend && \
    python3 -m venv venv && \
    ./venv/bin/pip3 install -r requirements.txt)

# Run locally (docker/kubernetes steps removed for now)
# eval $(minikube docker-env)
# docker build -t bring-a-plate:0.0.1 .
# kubectl apply -f deployment.yml

