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

# Start quick console logs commenting process
print_status "Starting quick console logs commenting process..."

# Navigate to project directory
cd /var/www/rezgee || {
    print_error "Failed to navigate to project directory"
    exit 1
}

# Function to comment console logs in a file
comment_console_logs() {
    local file="$1"
    local file_type="$2"
    
    if [ ! -f "$file" ]; then
        print_warning "File not found: $file"
        return
    fi
    
    print_status "Processing $file_type: $file"
    
    # Create backup
    cp "$file" "$file.backup"
    
    # Comment console.log statements (single line)
    sed -i 's/^[[:space:]]*console\.log(/\/\/ console.log(/g' "$file"
    
    # Comment console.warn statements
    sed -i 's/^[[:space:]]*console\.warn(/\/\/ console.warn(/g' "$file"
    
    # Comment console.error statements
    sed -i 's/^[[:space:]]*console\.error(/\/\/ console.error(/g' "$file"
    
    # Comment console.info statements
    sed -i 's/^[[:space:]]*console\.info(/\/\/ console.info(/g' "$file"
    
    # Comment console.debug statements
    sed -i 's/^[[:space:]]*console\.debug(/\/\/ console.debug(/g' "$file"
    
    print_success "Commented console logs in: $file"
}

# Step 1: Comment console logs in main user pages only
print_status "Step 1: Commenting console logs in main user pages..."

# Core user pages
comment_console_logs "src/components/LoginPage.tsx" "User Page"
comment_console_logs "src/components/RegisterPage.tsx" "User Page"
comment_console_logs "src/components/ForgotPasswordPage.tsx" "User Page"
comment_console_logs "src/components/ResetPasswordPage.tsx" "User Page"
comment_console_logs "src/components/TwoFactorVerificationPage.tsx" "User Page"
comment_console_logs "src/components/TemporaryPasswordLoginPage.tsx" "User Page"

# Main user components
comment_console_logs "src/components/HomePage.tsx" "User Component"
comment_console_logs "src/components/DashboardPage.tsx" "User Component"
comment_console_logs "src/components/EnhancedProfilePage.tsx" "User Component"
comment_console_logs "src/components/PublicProfilePage.tsx" "User Component"
comment_console_logs "src/components/MatchesPage.tsx" "User Component"
comment_console_logs "src/components/LikesPage.tsx" "User Component"
comment_console_logs "src/components/MessagesPage.tsx" "User Component"
comment_console_logs "src/components/ContactPage.tsx" "User Component"
comment_console_logs "src/components/SearchPage.tsx" "User Component"

# Payment pages
comment_console_logs "src/components/PaymentPage.tsx" "Payment Page"
comment_console_logs "src/components/PaymentSuccessPage.tsx" "Payment Page"
comment_console_logs "src/components/SubscriptionPage.tsx" "Subscription Page"
comment_console_logs "src/components/EnhancedPaymentPage.tsx" "Payment Page"

# Security components
comment_console_logs "src/components/SecuritySettingsPage.tsx" "Security Component"
comment_console_logs "src/components/VerificationStatus.tsx" "Verification Component"

print_success "Step 1 completed: Main user pages console logs commented"

# Step 2: Comment console logs in email services
print_status "Step 2: Commenting console logs in email services..."

comment_console_logs "src/lib/unifiedEmailService.ts" "Email Service"
comment_console_logs "src/lib/templateSMTPManager.ts" "Email Service"
comment_console_logs "src/lib/databaseSMTPManager.ts" "Email Service"
comment_console_logs "src/lib/localSMTPService.ts" "Email Service"
comment_console_logs "src/lib/temporaryPasswordService.ts" "Email Service"

print_success "Step 2 completed: Email services console logs commented"

# Step 3: Comment console logs in authentication services
print_status "Step 3: Commenting console logs in authentication services..."

comment_console_logs "src/lib/twoFactorService.ts" "Auth Service"
comment_console_logs "src/lib/verificationService.ts" "Auth Service"
comment_console_logs "src/lib/adminAuthService.ts" "Auth Service"

print_success "Step 3 completed: Authentication services console logs commented"

# Step 4: Comment console logs in main contexts
print_status "Step 4: Commenting console logs in main contexts..."

comment_console_logs "src/contexts/AuthContext.tsx" "Context"
comment_console_logs "src/App.tsx" "Main App"

print_success "Step 4 completed: Main contexts console logs commented"

# Step 5: Build and restart
print_status "Step 5: Building project and restarting services..."

npm run build || {
    print_error "Failed to build project"
    exit 1
}

pm2 restart all || {
    print_error "Failed to restart PM2 processes"
    exit 1
}

print_success "Quick console logs commenting process completed successfully!"
print_status "Summary:"
print_status "  ✅ Main user pages: Console logs commented"
print_status "  ✅ Email services: Console logs commented"
print_status "  ✅ Authentication services: Console logs commented"
print_status "  ✅ Main contexts: Console logs commented"
print_status "  ✅ Admin panel: Console logs preserved"
print_status ""
print_status "To restore console logs later, run:"
print_status "  ./restore-console-logs.sh"
print_status ""
print_status "Process completed at $(date)"
