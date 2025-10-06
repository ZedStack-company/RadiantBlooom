#!/bin/bash

# Radiant Bloom Backend Deployment Script for Digital Ocean
# Make sure to run this script from the Backend directory

echo "🚀 Starting Radiant Bloom Backend Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the Backend directory"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

print_success "Node.js version check passed: $(node -v)"

# Install dependencies
print_status "Installing dependencies..."
npm ci --only=production

if [ $? -ne 0 ]; then
    print_error "Failed to install dependencies"
    exit 1
fi

print_success "Dependencies installed successfully"

# Create logs directory
print_status "Creating logs directory..."
mkdir -p logs

# Set proper permissions
chmod 755 logs

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    print_status "Creating .env file..."
    cat > .env << EOF
NODE_ENV=production
PORT=5000
HOST=0.0.0.0
MONGODB_URI=mongodb+srv://falak:dxsHJSsjJUtZLs6Z@cluster0.psvhihm.mongodb.net/RadiantBloom?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your-super-secure-jwt-secret-key-change-this-in-production
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
EOF
    print_warning "Please update the .env file with your actual configuration values"
fi

# Install PM2 globally if not already installed
if ! command -v pm2 &> /dev/null; then
    print_status "Installing PM2..."
    npm install -g pm2
fi

# Stop existing PM2 processes
print_status "Stopping existing PM2 processes..."
pm2 stop radiant-bloom-api 2>/dev/null || true
pm2 delete radiant-bloom-api 2>/dev/null || true

# Start the application with PM2
print_status "Starting application with PM2..."
pm2 start ecosystem.config.js --env production

if [ $? -ne 0 ]; then
    print_error "Failed to start application with PM2"
    exit 1
fi

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
pm2 startup

print_success "Application started successfully!"

# Show application status
print_status "Application Status:"
pm2 status

# Show logs
print_status "Recent logs:"
pm2 logs radiant-bloom-api --lines 20

print_success "Deployment completed successfully!"
print_status "Your API should be running on port 5000"
print_status "Health check: curl http://localhost:5000/api/health"
print_warning "Don't forget to:"
print_warning "1. Update your .env file with actual configuration values"
print_warning "2. Configure your firewall to allow port 5000"
print_warning "3. Set up a reverse proxy (nginx) for production"
print_warning "4. Configure SSL certificates"
