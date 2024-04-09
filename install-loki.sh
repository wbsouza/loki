#!/bin/bash

sudo curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
echo "deb https://apt.kubernetes.io/ kubernetes-$(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/kubernetes.list

apt install kubectl

go install sigs.k8s.io/kind@v0.22.0

kind create cluster --name k8s-playground --config kind-config.yaml


helm install minio bitnami/minio --namespace loki -f minio-values.yml

helm install memcached bitnami/memcached --namespace loki -f memcached-values.yml

helm upgrade --install loki grafana/loki-stack --namespace loki --set loki.useTestSchema=true


kubectl port-forward svc/loki 3100:3100 -n loki



