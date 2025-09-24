#!/bin/bash

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

# Start fix process
print_status "Starting template SMTP fix process..."

# Navigate to project directory
cd /var/www/rezgee || {
    print_error "Failed to navigate to project directory"
    exit 1
}

# Pull latest changes
print_status "Pulling latest changes from GitHub..."
git pull origin main || {
    print_error "Failed to pull changes from GitHub"
    exit 1
}

# Install dependencies
print_status "Installing dependencies..."
npm install || {
    print_error "Failed to install dependencies"
    exit 1
}

# Build the project
print_status "Building project..."
npm run build || {
    print_error "Failed to build project"
    exit 1
}

# Restart PM2 processes
print_status "Restarting PM2 processes..."
pm2 restart all || {
    print_error "Failed to restart PM2 processes"
    exit 1
}

# Check PM2 status
print_status "Checking PM2 status..."
pm2 status

print_success "Template SMTP fix completed successfully!"
print_status "Fix completed at $(date)"
