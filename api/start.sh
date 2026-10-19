#!/bin/sh
set -e
node /app/merge-seed.js
exec json-server --host 0.0.0.0 --port 3000 --no-gzip /data/db.json
