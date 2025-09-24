// PM2 Ecosystem Configuration for Rezge Islamic Marriage Platform
// إعدادات PM2 لمنصة رزقي للزواج الإسلامي

module.exports = {
    apps: [{
            // Application name
            name: 'rezgee-app',

            // Script to run
            script: 'npm',
            args: 'run preview',

            // Working directory
            cwd: '/var/www/rezgee',

            // Number of instances (1 for VPS, more for load balancing)
            instances: 1,

            // Auto restart on crash
            autorestart: true,

            // Watch for file changes (disabled in production)
            watch: false,

            // Max memory before restart
            max_memory_restart: '1G',

            // Environment variables
            env: {
                NODE_ENV: 'production',
                PORT: 3000,
                HOST: '0.0.0.0'
            },

            // Production environment
            env_production: {
                NODE_ENV: 'production',
                PORT: 3000,
                HOST: '0.0.0.0'
            },

            // Log files
            error_file: '/var/log/pm2/rezgee-error.log',
            out_file: '/var/log/pm2/rezgee-out.log',
            log_file: '/var/log/pm2/rezgee-combined.log',

            // Log rotation
            log_date_format: 'YYYY-MM-DD HH:mm:ss Z',

            // Time format
            time: true,

            // Merge logs
            merge_logs: true,

            // Kill timeout
            kill_timeout: 5000,

            // Wait ready
            wait_ready: true,

            // Listen timeout
            listen_timeout: 10000,

            // Restart delay
            restart_delay: 4000,

            // Max restarts
            max_restarts: 10,

            // Min uptime
            min_uptime: '10s'
        },

        // SMTP Server (if running locally)
        {
            name: 'rezgee-smtp',
            script: 'node',
            args: 'simple-smtp-server.cjs',
            cwd: '/var/www/rezgee',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '512M',
            env: {
                NODE_ENV: 'production',
                PORT: 3001,
                VITE_SMTP_HOST: 'smtp.hostinger.com',
                VITE_SMTP_PORT: '465',
                VITE_SMTP_USER: 'noreply@rezgee.com',
                VITE_SMTP_PASS: 'R3zG89&Secure'
            },
            error_file: '/var/log/pm2/rezgee-smtp-error.log',
            out_file: '/var/log/pm2/rezgee-smtp-out.log',
            log_file: '/var/log/pm2/rezgee-smtp-combined.log',
            log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
            time: true,
            merge_logs: true
        }
    ],

    // Deployment configuration
    deploy: {
        production: {
            user: 'root',
            host: '148.230.112.17',
            ref: 'origin/main',
            repo: 'https://github.com/kareemxamged/rezgee.git',
            path: '/var/www/rezgee',
            'pre-deploy-local': '',
            'post-deploy': 'npm ci --only=production && npm run build && pm2 reload ecosystem.config.js --env production',
            'pre-setup': ''
        }
    }
};