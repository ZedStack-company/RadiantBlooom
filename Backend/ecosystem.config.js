module.exports = {
  apps: [{
    name: 'radiant-bloom-api',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
      PORT: 5000,
      HOST: 'localhost'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000,
      HOST: '0.0.0.0',
      MONGODB_URI: 'mongodb+srv://falak:dxsHJSsjJUtZLs6Z@cluster0.psvhihm.mongodb.net/RadiantBloom?retryWrites=true&w=majority&appName=Cluster0',
      JWT_SECRET: 'your-super-secure-jwt-secret-key-change-this-in-production',
      JWT_EXPIRE: '7d',
      CLOUDINARY_CLOUD_NAME: 'your-cloudinary-cloud-name',
      CLOUDINARY_API_KEY: 'your-cloudinary-api-key',
      CLOUDINARY_API_SECRET: 'your-cloudinary-api-secret'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
};
