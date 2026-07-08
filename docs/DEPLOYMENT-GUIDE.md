# Deployment Guide

Zad Academy runs as a **single DigitalOcean droplet** that hosts everything:
the Next.js app (marketing + admin console), the Laravel API, MySQL, and Nginx.

| Thing | Value |
|---|---|
| Droplet IP | `137.184.71.164` (Ubuntu 24.04, 2 GB RAM + 2 GB swap) |
| Repo | `git@github.com:Technest-Tech/zadacademy.git` |
| Code path | `/var/www/zadacademy` |
| Marketing site | `https://zadacademiq.com` → Next.js |
| Admin console | `https://system.zadacademiq.com` → Next.js (host-split in `frontend/src/middleware.ts`) |
| Laravel API | `https://system.zadacademiq.com/api` (same origin as the admin console) |

The two hosts are served by **one** Next.js process; `middleware.ts` decides
marketing vs. admin from the `Host` header (`NEXT_PUBLIC_APP_HOST` =
`system.zadacademiq.com`, `NEXT_PUBLIC_SITE_HOST` = `zadacademiq.com`).

First-time provisioning is documented in [SERVER-SETUP.md](SERVER-SETUP.md).
This page covers **routine deploys**.

---

## Routine deploy

Everything is wrapped in `/var/www/zadacademy/deploy.sh` (also tracked in the
repo root). SSH in and run it:

```bash
ssh root@137.184.71.164
bash /var/www/zadacademy/deploy.sh
```

It does, in order:

```bash
cd /var/www/zadacademy
git fetch --all && git reset --hard origin/main     # pull latest main

# Backend
cd backend
composer install --no-dev --optimize-autoloader --no-interaction
php artisan down --retry=15
php artisan migrate --force
php artisan config:cache route:cache view:cache event:cache   # (run separately)
chown -R www-data:www-data storage bootstrap/cache
systemctl restart zad-queue
php artisan up

# Frontend
cd ../frontend
pnpm install --frozen-lockfile || true          # pnpm 11 exits non-zero on the ignored-builds warning
node node_modules/next/dist/bin/next build       # NOT `pnpm build` — see note
pm2 restart zad-web --update-env
```

> **Why not `pnpm build`?** This pnpm version runs a deps-status pre-check
> before any script that errors on the (harmless) "ignored build scripts"
> warning, so `pnpm build` never reaches `next build`. Calling the Next binary
> directly sidesteps it. `deploy.sh` already does this.

> The droplet pulls from GitHub using the deploy key at `/root/.ssh/zad_deploy`.
> Its **public** key must be added to the repo's **Settings → Deploy keys**
> (read-only is fine). See [SERVER-SETUP.md](SERVER-SETUP.md#deploy-key).

### Deploying only one side

- **Backend only:** run the backend block above.
- **Frontend only:** `cd frontend && pnpm install --frozen-lockfile || true; node node_modules/next/dist/bin/next build && pm2 restart zad-web`.

---

## Rollback

```bash
cd /var/www/zadacademy
git log --oneline -10            # find the SHA before the bad deploy
git reset --hard <good-sha>
bash deploy.sh                   # rebuilds both apps at that SHA
# If a migration was the problem:
cd backend && php artisan migrate:rollback
```

---

## Pre-deploy checklist

- [ ] Tests pass (`pnpm test` in `frontend`, `php artisan test` in `backend`)
- [ ] No `console.log` / `dd()` left in code
- [ ] Env vars set on the droplet (`backend/.env`, `frontend/.env.production`)
- [ ] `dig +short zadacademiq.com` and `dig +short system.zadacademiq.com` both → `137.184.71.164`
- [ ] WhatsApp number / prices verified in the frontend config

---

## Post-deploy smoke test

```bash
# Marketing (Next.js)
curl -I https://zadacademiq.com/            | head -1     # 200
curl -I https://zadacademiq.com/pricing     | head -1     # 200

# Admin console (Next.js on the system host)
curl -I https://system.zadacademiq.com/login | head -1    # 200

# Laravel API
curl https://system.zadacademiq.com/up                    # 200 health page
curl -X POST https://system.zadacademiq.com/api/v1/contacts \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","message":"smoke test"}'
# 201 + reference
```

---

## Services on the box

| Concern | Managed by | Command |
|---|---|---|
| Next.js app | PM2 (`zad-web`) | `pm2 status`, `pm2 logs zad-web`, `pm2 restart zad-web` |
| Laravel queue | systemd (`zad-queue`) | `systemctl status zad-queue`, `journalctl -u zad-queue -f` |
| Laravel scheduler | cron (`/etc/cron.d/zad-scheduler`) | runs `schedule:run` every minute |
| Web server | systemd (`nginx`) | `nginx -t && systemctl reload nginx` |
| PHP | systemd (`php8.3-fpm`) | `systemctl restart php8.3-fpm` |
| Database | systemd (`mysql`) | `systemctl status mysql` |
| TLS certs | certbot timer (auto-renew) | `certbot renew --dry-run` |

---

## Monitoring (recommended)

- **UptimeRobot:** `https://zadacademiq.com/` and `https://system.zadacademiq.com/up`, 5-min interval.
- **Server health:** `htop`, `df -h`, `free -h` (watch memory — 2 GB box).
