#!/bin/bash
set -exu -o pipefail

# Build frontend
(cd frontend && \
    npm install &&
    npm run-script build)

# Build back-end
(export FLASK_APP=application.py && \
    cd backend && \
    python3 -m venv venv && \
    ./venv/bin/pip install -r requirements.txt && \
    ./venv/bin/flask db init && \
    ./venv/bin/flask db migrate && \
    ./venv/bin/flask db upgrade)

# Run locally (docker/kubernetes steps removed for now)
# eval $(minikube docker-env)
# docker build -t bring-a-plate:0.0.1 .
# kubectl apply -f deployment.yml

