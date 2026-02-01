#!/usr/bin/env bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INDEX_FILE="$SCRIPT_DIR/index.html"
SCRIPT_TAG='<script src="./custom-attachment-download.js"></script>'

if [[ ! -f "$INDEX_FILE" ]]; then
    echo "Error: $INDEX_FILE does not exist"
    exit 1
fi

if grep -q "custom-attachment-download.js" "$INDEX_FILE"; then
    echo "Script tag already exists in $INDEX_FILE. Skipping."
else
    sed -i "s|</body>|$SCRIPT_TAG\n</body>|" "$INDEX_FILE"
    echo "Successfully added script tag to $INDEX_FILE"
fi
