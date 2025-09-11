#!/usr/bin/env bash
# wait-for-it.sh: espera um host:porta ficar disponível

set -e

host="$1"
shift
port="$1"
shift

while ! nc -z "$host" "$port"; do
  echo "Aguardando $host:$port..."
  sleep 2
done

exec "$@"
