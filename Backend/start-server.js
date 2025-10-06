#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const path = require('path');

console.log('🧹 Cleaning up any existing processes...');

// Function to kill processes on port 5000
function killPort5000() {
  return new Promise((resolve) => {
    exec('netstat -ano | findstr :5000', (error, stdout) => {
      if (stdout) {
        const lines = stdout.split('\n').filter(line => line.trim());
        const pids = lines.map(line => {
          const parts = line.trim().split(/\s+/);
          return parts[parts.length - 1];
        }).filter(pid => pid && !isNaN(pid));

        if (pids.length > 0) {
          console.log(`🔄 Killing processes on port 5000: ${pids.join(', ')}`);
          pids.forEach(pid => {
            exec(`taskkill /PID ${pid} /F`, (killError) => {
              if (killError) {
                console.log(`⚠️  Could not kill process ${pid}`);
              } else {
                console.log(`✅ Killed process ${pid}`);
              }
            });
          });
        }
      }
      setTimeout(resolve, 2000); // Wait 2 seconds for cleanup
    });
  });
}

// Function to start the server
async function startServer() {
  await killPort5000();
  
  console.log('🚀 Starting Radiant Bloom Backend Server...');
  console.log('📁 Working directory:', __dirname);

  const nodemon = spawn('npx', ['nodemon', 'server.js'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true
  });

  nodemon.on('error', (error) => {
    console.error('❌ Failed to start nodemon:', error);
  });

  nodemon.on('close', (code) => {
    console.log(`🔄 Nodemon process exited with code ${code}`);
    if (code !== 0) {
      console.log('🔄 Restarting in 3 seconds...');
      setTimeout(startServer, 3000);
    }
  });

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    nodemon.kill('SIGINT');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down server...');
    nodemon.kill('SIGTERM');
    process.exit(0);
  });
}

// Start the server
startServer().catch(console.error);
