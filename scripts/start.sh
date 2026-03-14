#!/bin/sh

# Replace runtime env vars and start next server
sh /app/scripts/replace-variables.sh && 
node server.js