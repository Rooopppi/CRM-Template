#!/bin/bash
cd ../backend
source .env
docker run --detach --name SPT-MariaDB --env MARIADB_USER="${DB_USER}" --env MARIADB_PASSWORD="${DB_PASSWORD}" --env MARIADB_ROOT_PASSWORD="${DB_ROOT_PASS}" -p 3306:3306  mariadb:latest
npm run bootstrap:dev