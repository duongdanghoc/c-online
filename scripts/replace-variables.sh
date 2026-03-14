#!/bin/sh

# Get all NEXT_PUBLIC environment variables
VARIABLES=$(env | grep -o "^NEXT_PUBLIC_[A-Z0-9_]*" | xargs)

# Check if each variable is set
for VAR in $VARIABLES; do
    eval VAL=\$$VAR
    if [ -z "$VAL" ]; then
        echo "$VAR is not set. Please set it and rerun the script."
        exit 1
    fi
done

# Find and replace BAKED values with real values
find /app/public /app/.next -type f -name "*.js" |
while read file; do
    for VAR in $VARIABLES; do
        eval VAL=\$$VAR
        sed -i "s|$VAR|$VAL|g" "$file"
    done
done