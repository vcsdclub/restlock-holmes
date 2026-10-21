#!/bin/sh
set -eu
export PATH="/tmp/restlock-secure-node/bin:$PATH"
test "$(node --version)" = "v22.23.4"
npm run build
