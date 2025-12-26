module.exports = {
  apps: [
    {
      name: 'lonescore_backend_server',
      script: 'index.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || 5000
      }
    }
  ]
};
