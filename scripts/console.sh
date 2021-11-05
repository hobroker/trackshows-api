#!/usr/bin/env bash

set -e

execConsole() {
  if [ "$NODE_ENV" == "production" ]; then
    npm run console "$@"
  else
    npm run console:dev "$@"
  fi
}

execConsole "$@"
