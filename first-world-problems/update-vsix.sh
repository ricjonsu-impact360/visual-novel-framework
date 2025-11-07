#!/bin/bash

# CONFIG
EXTENSION_ID="vnscript"
LOCAL_VERSION_FILE="$HOME/.vscode-extension-version"
REMOTE_VERSION_URL="https://s3.ap-southeast-1.amazonaws.com/marketjs-visual-novel/vnscript/package.json"

# Fetch remote version info
REMOTE_JSON=$(curl -s "$REMOTE_VERSION_URL")
REMOTE_VERSION=$(echo "$REMOTE_JSON" | grep '"version"' | sed -E 's/.*"version": ?"([^"]+)".*/\1/')
VSIX_URL=$(echo "$REMOTE_JSON" | grep '"vsix_url"' | sed -E 's/.*"vsix_url": ?"([^"]+)".*/\1/')

# Read local version
if [ -f "$LOCAL_VERSION_FILE" ]; then
  LOCAL_VERSION=$(cat "$LOCAL_VERSION_FILE")
else
  LOCAL_VERSION="0.0.0"
fi

# Compare versions
if [ "$REMOTE_VERSION" != "$LOCAL_VERSION" ]; then
  echo "Updating $EXTENSION_ID from $LOCAL_VERSION to $REMOTE_VERSION..."

  # Download and install
  curl -o /tmp/extension.vsix "$VSIX_URL"
  code --install-extension /tmp/extension.vsix

  # Update local version
  echo "$REMOTE_VERSION" > "$LOCAL_VERSION_FILE"
  echo "Update complete."
else
  echo "Extension is up to date (version $LOCAL_VERSION)."
fi