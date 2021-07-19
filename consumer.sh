#!/bin/bash
echo "submodule update"
git submodule update --init

cd consumers-face-service
docker-compose up
