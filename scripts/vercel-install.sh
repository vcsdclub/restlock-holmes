#!/bin/sh
set -eu
node scripts/install-secure-node.mjs /tmp/restlock-secure-node
export PATH="/tmp/restlock-secure-node/bin:$PATH"
npm ci --no-audit --no-fund
