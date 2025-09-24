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

print_status "Starting SMTP server fix..."

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

# Restart SMTP server
print_status "Restarting SMTP server..."
pm2 restart rezgee-smtp || {
    print_error "Failed to restart SMTP server"
    exit 1
}

# Check SMTP server status
print_status "Checking SMTP server status..."
pm2 logs rezgee-smtp --lines 10

# Test SMTP server
print_status "Testing SMTP server..."
curl -s http://localhost:3001/status | head -5

print_success "SMTP server fix completed!"
print_status "Fix completed at $(date)"

