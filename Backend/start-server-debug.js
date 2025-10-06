#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Radiant Bloom Backend Server with Debug Logging...');
console.log('📁 Working directory:', process.cwd());
console.log('📄 Server file:', path.join(__dirname, 'server.js'));

const server = spawn('node', ['server.js'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

server.on('error', (error) => {
  console.error('❌ Failed to start server:', error);
});

server.on('close', (code) => {
  console.log(`🔄 Server process exited with code ${code}`);
  if (code !== 0) {
    console.log('🔄 Restarting server in 3 seconds...');
    setTimeout(() => {
      console.log('🔄 Restarting...');
      const newServer = spawn('node', ['server.js'], {
        cwd: __dirname,
        stdio: 'inherit',
        shell: true
      });
    }, 3000);
  }
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  server.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down server...');
  server.kill('SIGTERM');
  process.exit(0);
});

console.log('✅ Server started. Press Ctrl+C to stop.');
