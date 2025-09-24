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

print_status "Starting SMTP domain fix..."

# Navigate to project directory
cd /var/www/rezgee || {
    print_error "Failed to navigate to project directory"
    exit 1
}

# Pull updates from GitHub
print_status "Pulling updates from GitHub..."
git pull origin main || {
    print_error "Failed to pull updates from GitHub"
    exit 1
}

# Build the project
print_status "Building project..."
npm run build || {
    print_error "Failed to build project"
    exit 1
}

# Restart the application
print_status "Restarting application..."
pm2 restart rezgee-app || {
    print_error "Failed to restart application"
    exit 1
}

# Check application status
print_status "Checking application status..."
pm2 status

# Test SMTP server
print_status "Testing SMTP server..."
curl -s http://localhost:3001/status | head -5

print_success "SMTP domain fix completed!"
print_status "Fix completed at $(date)"
