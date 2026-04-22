#!/usr/bin/env bash
set -e
cd client
npm install --include=dev
npm run build
