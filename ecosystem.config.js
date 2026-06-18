const path = require('path');

// __dirname is always this file's own directory (repo root), so every path
// below resolves correctly regardless of where `pm2 start` is invoked from.
module.exports = {
  apps: [
    {
      name: 'dishquest',
      script: 'bin/www',
      cwd: path.join(__dirname, 'server'),
      interpreter: 'node',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '400M',
      error_file: path.join(__dirname, 'logs', 'pm2-error.log'),
      out_file: path.join(__dirname, 'logs', 'pm2-out.log'),
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        // Secrets (DB_USER, DB_PWD, JWT_SECRET, API_ID, API_KEY) come from
        // server/.env on the droplet — never stored here.
      },
    },
  ],
};
