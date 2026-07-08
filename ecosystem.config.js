module.exports = {
  apps: [{
    name: 'zad-web',
    cwd: '/var/www/zadacademy/frontend',
    script: 'node_modules/next/dist/bin/next',
    args: 'start -H 127.0.0.1 -p 3000',
    instances: 1,
    exec_mode: 'fork',
    env: { NODE_ENV: 'production' },
    max_memory_restart: '700M',
  }],
}
