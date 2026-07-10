#!/usr/bin/env bash
# Zad Academy production deploy — pulls latest main and rebuilds both apps.
# Usage:  sudo bash /var/www/zadacademy/deploy.sh
set -euo pipefail
export COMPOSER_ALLOW_SUPERUSER=1

REPO=/var/www/zadacademy
cd "$REPO"

echo "→ Pulling latest main…"
git fetch --all
git reset --hard origin/main

echo "→ Backend…"
cd "$REPO/backend"
composer install --no-dev --optimize-autoloader --no-interaction
php artisan down --retry=15 || true
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache
systemctl restart zad-queue
php artisan up

echo "→ Frontend…"
cd "$REPO/frontend"
export NODE_OPTIONS=--max_old_space_size=1536
# pnpm 11 exits non-zero on the harmless "ignored build scripts" warning; the
# install still populates node_modules, so don't let it abort the deploy.
pnpm install --frozen-lockfile || echo "pnpm install exit $? (ignored-builds warning is non-fatal)"
# Build via the Next binary directly — `pnpm build` runs a deps-status pre-check
# that also trips on the ignored-builds warning and never reaches next build.
node node_modules/next/dist/bin/next build
# startOrReload re-reads ecosystem.config.js so bind/arg changes take effect
# (a plain `pm2 restart zad-web` keeps the args the process was first started with).
pm2 startOrReload "$REPO/ecosystem.config.js" --update-env

echo "✓ Deploy complete."
