# Nodemon Crash Fix Guide

## Problem
Nodemon was crashing repeatedly with the error:
```
❌ Port 5000 is already in use. Please kill the process using this port or use a different port.
[nodemon] app crashed - waiting for file changes before starting...
```

## Root Causes
1. **Port Conflicts**: Multiple Node.js processes trying to use port 5000
2. **Incomplete Cleanup**: Nodemon not properly cleaning up when it crashes
3. **Configuration Issues**: Nodemon watching too many files and restarting unnecessarily
4. **Process Management**: No proper process cleanup before starting

## Complete Solution

### 1. Enhanced Server Error Handling
Updated `server.js` to detect port conflicts and provide clear error messages:
```javascript
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Please kill the process using this port or use a different port.`);
    console.error('💡 Try running: netstat -ano | findstr :5000');
    process.exit(1);
  } else {
    console.error('❌ Server error:', err);
    process.exit(1);
  }
});
```

### 2. Robust Startup Script
Created `start-server.js` that:
- Automatically kills any processes using port 5000
- Waits for cleanup to complete
- Starts nodemon with proper error handling
- Auto-restarts on crashes
- Handles graceful shutdown

### 3. Optimized Nodemon Configuration
Updated `nodemon.json` with:
- Longer delay (5000ms) to prevent rapid restarts
- Proper file watching (only essential directories)
- Ignore config files and scripts
- Kill timeout and max restarts limits
- Legacy watch mode for Windows compatibility

### 4. Multiple Startup Options
Updated `package.json` scripts:
- `npm run dev` - Uses robust startup script with cleanup
- `npm run dev-simple` - Direct nodemon (for testing)
- `npm start` - Production mode (no nodemon)

## Usage

### For Development (Recommended)
```bash
cd Backend
npm run dev
```

### For Clean Start
```bash
cd Backend
start-clean.bat  # Windows batch file
```

### For Simple Testing
```bash
cd Backend
npm run dev-simple
```

## Manual Port Cleanup (If Needed)
```bash
# Check what's using port 5000
netstat -ano | findstr :5000

# Kill specific process
taskkill /PID <PID_NUMBER> /F

# Kill all Node.js processes
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
```

## Features of the Solution
- ✅ **Automatic Port Cleanup**: Kills conflicting processes before starting
- ✅ **Error Recovery**: Auto-restarts on crashes
- ✅ **Stable Watching**: Only watches essential files
- ✅ **Clear Error Messages**: Helpful debugging information
- ✅ **Graceful Shutdown**: Proper cleanup on exit
- ✅ **Windows Compatible**: Works with PowerShell and CMD

## Current Status
- ✅ Server running on `http://localhost:5000`
- ✅ MongoDB connected successfully
- ✅ Categories API working (`/api/categories`)
- ✅ Products API working (`/api/products`)
- ✅ Nodemon stable with auto-restart
- ✅ No more port conflicts

## Troubleshooting
If you still encounter issues:

1. **Check for zombie processes**:
   ```bash
   netstat -ano | findstr :5000
   ```

2. **Kill all Node processes**:
   ```bash
   Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
   ```

3. **Use the clean startup**:
   ```bash
   cd Backend
   start-clean.bat
   ```

4. **Check nodemon logs** for specific error messages

The solution is now robust and should handle all common nodemon crash scenarios! 🚀
