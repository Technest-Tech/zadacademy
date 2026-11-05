module.exports = {
  apps: [{
    name: 'zad-web',
    cwd: '/var/www/zadacademy/frontend',
    script: 'node_modules/next/dist/bin/next',
    // Bind to `localhost` (not 127.0.0.1) so Next's own resolved origin matches
    // the `localhost` origin its proxy/middleware uses for internal rewrites.
    // With a 127.0.0.1 bind the origins differ, so Next treats every rewrite
    // (e.g. the `/fr` locale prefix) as *external* and proxy-fetches it — which
    // dies with EPROTO when X-Forwarded-Proto=https points the fetch at the
    // plaintext loopback. `localhost` listens on [::1]; nginx upstreams [::1]:3001.
    //
    // 3001, not 3000: this server also hosts azharyfr.com, whose Next.js process
    // holds port 3000. deploy.sh re-reads this file, so a wrong port here takes
    // the site down with EADDRINUSE on the next deploy.
    args: 'start -H localhost -p 3001',
    instances: 1,
    exec_mode: 'fork',
    env: { NODE_ENV: 'production' },
    max_memory_restart: '700M',
  }],
}
