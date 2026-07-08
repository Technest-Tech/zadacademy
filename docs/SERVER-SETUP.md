# Server Setup

First-time provisioning of the **single droplet** that runs all of Zad Academy.
For routine deploys see [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md).

| | |
|---|---|
| Host | `137.184.71.164` — Ubuntu 24.04 LTS, 2 GB RAM |
| Stack | Nginx · PHP 8.3-FPM · MySQL 8 · Node 22 · PM2 · Composer · Certbot |
| Code | `/var/www/zadacademy` (cloned from `git@github.com:Technest-Tech/zadacademy.git`) |

### DNS (already configured)

| Type | Host | Value |
|---|---|---|
| A | `zadacademiq.com` | `137.184.71.164` |
| A | `system.zadacademiq.com` | `137.184.71.164` |

Both hosts resolve to the same box; Nginx + the Next.js middleware route them.

---

## 1. Base box

```bash
# Swap — the Next.js build needs more than 2 GB
fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
sysctl -w vm.swappiness=10

# Packages
apt-get update && apt-get install -y --no-install-recommends \
  nginx mysql-server unzip git curl ca-certificates \
  php8.3-fpm php8.3-cli php8.3-mysql php8.3-mbstring php8.3-xml \
  php8.3-curl php8.3-zip php8.3-gd php8.3-bcmath php8.3-intl \
  certbot python3-certbot-nginx

# Composer
curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Node 22 + pnpm + pm2
curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && apt-get install -y nodejs
npm install -g pnpm pm2

# Firewall
ufw allow OpenSSH && ufw allow 'Nginx Full' && ufw --force enable
```

---

## 2. Database

```bash
mysql -uroot <<'SQL'
CREATE DATABASE zad_prod CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'zad'@'localhost' IDENTIFIED BY '<db-password>';
GRANT ALL PRIVILEGES ON zad_prod.* TO 'zad'@'localhost';
FLUSH PRIVILEGES;
SQL
```

---

## 3. Deploy key

The droplet pulls from GitHub with a dedicated read-only deploy key.

```bash
ssh-keygen -t ed25519 -N "" -C "zad-droplet-deploy" -f /root/.ssh/zad_deploy
ssh-keyscan -t ed25519 github.com >> /root/.ssh/known_hosts
cat /root/.ssh/zad_deploy.pub     # → add to GitHub repo → Settings → Deploy keys
```

Then get the code and pin the key to this repo:

```bash
git clone git@github.com:Technest-Tech/zadacademy.git /var/www/zadacademy
cd /var/www/zadacademy
git config core.sshCommand "ssh -i /root/.ssh/zad_deploy -o IdentitiesOnly=yes"
```

> For the very first clone (before the deploy key is added to GitHub) you can
> forward your own agent: `ssh -A root@137.184.71.164` then clone.

---

## 4. Backend (Laravel)

```bash
cd /var/www/zadacademy/backend
# Put the .env in place (template below), then:
composer install --optimize-autoloader     # WITH dev deps if you want to run demo seeders
php artisan key:generate --force
php artisan migrate --force
php artisan db:seed --force                 # optional demo data — see note
composer install --no-dev --optimize-autoloader   # slim for production
php artisan storage:link
php artisan config:cache route:cache view:cache event:cache

chown www-data:www-data .env && chmod 640 .env
chown -R www-data:www-data storage bootstrap/cache && chmod -R 775 storage bootstrap/cache
```

> **Demo seeder note:** `RolePermissionSeeder`, the admin user, and the
> marketing content (blog / courses / teachers) seed cleanly. The operational
> demo seeders (`SystemDemoSeeder` and friends) currently fail — they reference
> a `phone` column that the `update_sys_students_for_guardians` migration
> removed. They are safe to skip; fix the seeder to the guardian model before
> re-enabling.

### `backend/.env` (production essentials)

```env
APP_NAME="Zad Academy API"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://system.zadacademiq.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_DATABASE=zad_prod
DB_USERNAME=zad
DB_PASSWORD=<db-password>

SESSION_DRIVER=cookie
SESSION_DOMAIN=.zadacademiq.com
QUEUE_CONNECTION=database
CACHE_STORE=file

SYSTEM_FRONTEND_URL=https://system.zadacademiq.com
CORS_ALLOWED_ORIGINS=https://zadacademiq.com,https://www.zadacademiq.com,https://system.zadacademiq.com
SANCTUM_STATEFUL_DOMAINS=zadacademiq.com,www.zadacademiq.com,system.zadacademiq.com

# Email is OFF until a Resend key is added — mail is written to the log.
MAIL_MAILER=log            # switch to "resend" once RESEND_API_KEY is set
RESEND_API_KEY=
MAIL_FROM_ADDRESS="info@zadacademiq.com"

NEXT_REVALIDATE_URL=https://zadacademiq.com/api/revalidate
NEXT_REVALIDATE_SECRET=<shared-with-frontend>
```

Integrations (Zoom, Wassender/WhatsApp, Paymob) are feature-flagged **off** by
default and don't block boot — set `*_ENABLED=true` + their keys to turn on.

**Captcha:** the contact / trial-booking forms use Cloudflare Turnstile, but it
is **optional** — with no `TURNSTILE_SECRET_KEY` (and no frontend
`NEXT_PUBLIC_TURNSTILE_SITE_KEY`) the forms work without a captcha. Set both
keys (free Turnstile widget in the Cloudflare dashboard) to enable bot
protection; verification then applies automatically.

---

## 5. Frontend (Next.js)

```bash
cd /var/www/zadacademy/frontend
# Put .env.production in place (below), then:
NODE_OPTIONS=--max_old_space_size=1536 pnpm install --frozen-lockfile || true
# Build via the Next binary directly (pnpm 11's script pre-check trips on the
# harmless ignored-builds warning and never reaches `next build`):
NODE_OPTIONS=--max_old_space_size=1536 node node_modules/next/dist/bin/next build
pm2 start /var/www/zadacademy/ecosystem.config.js   # runs `next start -H 127.0.0.1 -p 3000`
pm2 save
pm2 startup systemd -u root --hp /root
```

### `frontend/.env.production`

```env
NEXT_PUBLIC_API_URL=https://system.zadacademiq.com
NEXT_PUBLIC_SYSTEM_API_PREFIX=/api/system
NEXT_PUBLIC_APP_HOST=system.zadacademiq.com
NEXT_PUBLIC_SITE_HOST=zadacademiq.com
NEXT_PUBLIC_SITE_URL=https://zadacademiq.com
NEXT_PUBLIC_WHATSAPP=+201000000000        # replace with the real number
REVALIDATE_SECRET=<shared-with-backend>
```

---

## 6. Queue worker + scheduler

`/etc/systemd/system/zad-queue.service`:

```ini
[Unit]
Description=Zad Academy Queue Worker
After=network.target mysql.service
[Service]
User=www-data
Group=www-data
Restart=always
RestartSec=3
ExecStart=/usr/bin/php /var/www/zadacademy/backend/artisan queue:work --sleep=3 --tries=3 --max-time=3600
[Install]
WantedBy=multi-user.target
```

```bash
systemctl daemon-reload && systemctl enable --now zad-queue
```

`/etc/cron.d/zad-scheduler`:

```cron
* * * * * www-data cd /var/www/zadacademy/backend && /usr/bin/php artisan schedule:run >> /dev/null 2>&1
```

---

## 7. Nginx + TLS

The site config lives in `/etc/nginx/sites-available/zadacademy` (tracked in the
repo at `deploy/nginx/zadacademy`). Two server blocks:

- `zadacademiq.com` → everything proxied to Next.js (`127.0.0.1:3000`).
- `system.zadacademiq.com` → `/api`, `/up`, `/sanctum`, `/storage` to
  PHP-FPM (Laravel `backend/public`); everything else to Next.js.

```bash
ln -sf /etc/nginx/sites-available/zadacademy /etc/nginx/sites-enabled/zadacademy
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
certbot --nginx -d zadacademiq.com -d system.zadacademiq.com --redirect \
  --agree-tos -m <admin-email> --no-eff-email
```

`www.zadacademiq.com` is **not** configured (no DNS record). Add an A record and
re-run certbot with `-d www.zadacademiq.com` if you want it.

---

## 8. Backups (recommended, not yet automated)

| What | How | Frequency |
|---|---|---|
| MySQL | `mysqldump zad_prod` → off-site (Backblaze B2) | daily |
| Uploads | `rsync backend/storage/app/public` → B2 | daily |
| Code | GitHub | per push |
