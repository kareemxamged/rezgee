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

# Start commenting console logs process
print_status "Starting console logs commenting process..."

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
    
    # Comment multi-line console.log statements
    sed -i '/console\.log(/,/);/s/^/\/\/ /' "$file"
    sed -i '/console\.warn(/,/);/s/^/\/\/ /' "$file"
    sed -i '/console\.error(/,/);/s/^/\/\/ /' "$file"
    sed -i '/console\.info(/,/);/s/^/\/\/ /' "$file"
    sed -i '/console\.debug(/,/);/s/^/\/\/ /' "$file"
    
    print_success "Commented console logs in: $file"
}

# Step 1: Comment console logs in user-facing pages
print_status "Step 1: Commenting console logs in user-facing pages..."

# User pages
comment_console_logs "src/components/LoginPage.tsx" "User Page"
comment_console_logs "src/components/RegisterPage.tsx" "User Page"
comment_console_logs "src/components/ForgotPasswordPage.tsx" "User Page"
comment_console_logs "src/components/ResetPasswordPage.tsx" "User Page"
comment_console_logs "src/components/TwoFactorVerificationPage.tsx" "User Page"
comment_console_logs "src/components/TemporaryPasswordLoginPage.tsx" "User Page"
comment_console_logs "src/components/SetPasswordPage.tsx" "User Page"
comment_console_logs "src/components/VerifyEmailChangePage.tsx" "User Page"
comment_console_logs "src/components/UnsubscribePage.tsx" "User Page"

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
comment_console_logs "src/components/ArticlesPage.tsx" "User Component"
comment_console_logs "src/components/ArticleDetailPage.tsx" "User Component"
comment_console_logs "src/components/ArticleContent.tsx" "User Component"
comment_console_logs "src/components/NotificationsPage.tsx" "User Component"
comment_console_logs "src/components/NotificationDropdown.tsx" "User Component"

# Payment and subscription pages
comment_console_logs "src/components/PaymentPage.tsx" "Payment Page"
comment_console_logs "src/components/PaymentSuccessPage.tsx" "Payment Page"
comment_console_logs "src/components/SubscriptionPage.tsx" "Subscription Page"
comment_console_logs "src/components/SubscriptionBanner.tsx" "Subscription Component"
comment_console_logs "src/components/EnhancedPaymentPage.tsx" "Payment Page"

# Security and verification components
comment_console_logs "src/components/SecuritySettingsPage.tsx" "Security Component"
comment_console_logs "src/components/VerificationStatus.tsx" "Verification Component"
comment_console_logs "src/components/verification/IdentityVerificationModal.tsx" "Verification Component"
comment_console_logs "src/components/verification/CameraCapture.tsx" "Verification Component"

# Utility components
comment_console_logs "src/components/Header.tsx" "Utility Component"
comment_console_logs "src/components/ProfileImageUpload.tsx" "Utility Component"
comment_console_logs "src/components/PhoneInput.tsx" "Utility Component"
comment_console_logs "src/components/LanguageToggle.tsx" "Utility Component"
comment_console_logs "src/components/ShareProfileButton.tsx" "Utility Component"
comment_console_logs "src/components/UsageStatus.tsx" "Utility Component"
comment_console_logs "src/components/ConnectionStatus.tsx" "Utility Component"
comment_console_logs "src/components/SilentConnectionManager.tsx" "Utility Component"
comment_console_logs "src/components/EmailSyncWarning.tsx" "Utility Component"
comment_console_logs "src/components/DeleteConfirmModal.tsx" "Utility Component"
comment_console_logs "src/components/RecaptchaComponent.tsx" "Utility Component"

# Alert components
comment_console_logs "src/components/alerts/UserAlertPopup.tsx" "Alert Component"
comment_console_logs "src/components/alerts/AlertsManager.tsx" "Alert Component"

# Comment system
comment_console_logs "src/components/CommentSystem.tsx" "Comment Component"

# Advanced components
comment_console_logs "src/components/AdvancedSecurityDashboard.tsx" "Advanced Component"
comment_console_logs "src/components/TextManagement.tsx" "Advanced Component"
comment_console_logs "src/components/MigrationManager.tsx" "Advanced Component"
comment_console_logs "src/components/TranslationTest.tsx" "Advanced Component"

print_success "Step 1 completed: User-facing pages console logs commented"

# Step 2: Comment console logs in email services
print_status "Step 2: Commenting console logs in email services..."

comment_console_logs "src/lib/unifiedEmailService.ts" "Email Service"
comment_console_logs "src/lib/templateSMTPManager.ts" "Email Service"
comment_console_logs "src/lib/databaseSMTPManager.ts" "Email Service"
comment_console_logs "src/lib/localSMTPService.ts" "Email Service"
comment_console_logs "src/lib/notificationEmailService.ts" "Email Service"
comment_console_logs "src/lib/templateBasedEmailService.ts" "Email Service"
comment_console_logs "src/lib/authEmailServiceDatabase.ts" "Email Service"
comment_console_logs "src/lib/notificationEmailServiceDatabase.ts" "Email Service"
comment_console_logs "src/lib/integratedEmailService.ts" "Email Service"
comment_console_logs "src/lib/temporaryPasswordEmailService.ts" "Email Service"
comment_console_logs "src/lib/emailService.ts" "Email Service"
comment_console_logs "src/lib/databaseEmailService.ts" "Email Service"
comment_console_logs "src/lib/unifiedDatabaseEmailService.ts" "Email Service"
comment_console_logs "src/lib/emailVerification.ts" "Email Service"
comment_console_logs "src/lib/clientEmailService.ts" "Email Service"
comment_console_logs "src/lib/finalEmailService.ts" "Email Service"
comment_console_logs "src/lib/simpleDynamicEmailService.ts" "Email Service"
comment_console_logs "src/lib/directNotificationEmailService.ts" "Email Service"
comment_console_logs "src/lib/dynamicLanguageEmailService.ts" "Email Service"
comment_console_logs "src/lib/finalEmailServiceNew.ts" "Email Service"
comment_console_logs "src/lib/realEmailService.ts" "Email Service"
comment_console_logs "src/lib/optimizedEmailService.ts" "Email Service"
comment_console_logs "src/lib/supabaseCustomSMTPService.ts" "Email Service"
comment_console_logs "src/lib/browserEmailService.ts" "Email Service"
comment_console_logs "src/lib/workingEmailService.ts" "Email Service"
comment_console_logs "src/lib/actualEmailService.ts" "Email Service"
comment_console_logs "src/lib/supabaseEmailService.ts" "Email Service"
comment_console_logs "src/lib/simpleResendService.ts" "Email Service"
comment_console_logs "src/lib/resendOnlyEmailService.ts" "Email Service"
comment_console_logs "src/lib/quickEmailService.ts" "Email Service"
comment_console_logs "src/lib/directSMTPService.ts" "Email Service"

print_success "Step 2 completed: Email services console logs commented"

# Step 3: Comment console logs in authentication services
print_status "Step 3: Commenting console logs in authentication services..."

comment_console_logs "src/lib/twoFactorService.ts" "Auth Service"
comment_console_logs "src/lib/adminTwoFactorService.ts" "Auth Service"
comment_console_logs "src/lib/userTwoFactorService.ts" "Auth Service"
comment_console_logs "src/lib/verificationService.ts" "Auth Service"
comment_console_logs "src/lib/adminAuthService.ts" "Auth Service"
comment_console_logs "src/lib/separateAdminAuth.ts" "Auth Service"
comment_console_logs "src/lib/temporaryPasswordService.ts" "Auth Service"
comment_console_logs "src/lib/deviceSecurityService.ts" "Auth Service"
comment_console_logs "src/lib/userTrustedDeviceService.ts" "Auth Service"
comment_console_logs "src/lib/adminTrustedDeviceService.ts" "Auth Service"
comment_console_logs "src/lib/loginAttemptsService.ts" "Auth Service"
comment_console_logs "src/lib/antiTamperingService.ts" "Auth Service"

print_success "Step 3 completed: Authentication services console logs commented"

# Step 4: Comment console logs in utility services
print_status "Step 4: Commenting console logs in utility services..."

comment_console_logs "src/lib/deviceLocationService.ts" "Utility Service"
comment_console_logs "src/lib/languageDetectionService.ts" "Utility Service"
comment_console_logs "src/lib/deviceAnalysisService.ts" "Utility Service"
comment_console_logs "src/lib/dashboardService.ts" "Utility Service"
comment_console_logs "src/lib/userPresenceService.ts" "Utility Service"
comment_console_logs "src/lib/adminManagementService.ts" "Utility Service"
comment_console_logs "src/lib/adminDashboardService.ts" "Utility Service"
comment_console_logs "src/lib/matchingService.ts" "Utility Service"
comment_console_logs "src/lib/ipLocationService.ts" "Utility Service"
comment_console_logs "src/lib/subscriptionService.ts" "Utility Service"
comment_console_logs "src/lib/featureAccessService.ts" "Utility Service"
comment_console_logs "src/lib/featureAccess.ts" "Utility Service"
comment_console_logs "src/lib/smtpService.ts" "Utility Service"
comment_console_logs "src/lib/notificationService.ts" "Utility Service"
comment_console_logs "src/lib/profileImageService.ts" "Utility Service"
comment_console_logs "src/lib/payTabsService.ts" "Utility Service"
comment_console_logs "src/lib/paymentService.ts" "Utility Service"
comment_console_logs "src/lib/paymentMethodsService.ts" "Utility Service"
comment_console_logs "src/lib/likesService.ts" "Utility Service"
comment_console_logs "src/lib/alertsService.ts" "Utility Service"
comment_console_logs "src/lib/newsletterService.ts" "Utility Service"
comment_console_logs "src/lib/nodemailerSMTP.ts" "Utility Service"
comment_console_logs "src/lib/separateAdminUsersService.ts" "Utility Service"
comment_console_logs "src/lib/adminUsersService.ts" "Utility Service"

print_success "Step 4 completed: Utility services console logs commented"

# Step 5: Comment console logs in contexts and hooks
print_status "Step 5: Commenting console logs in contexts and hooks..."

comment_console_logs "src/contexts/AuthContext.tsx" "Context"
comment_console_logs "src/contexts/AdminContext.tsx" "Context"
comment_console_logs "src/hooks/useUserPresence.ts" "Hook"
comment_console_logs "src/hooks/useSubscription.ts" "Hook"
comment_console_logs "src/hooks/useRealtimeUpdates.ts" "Hook"
comment_console_logs "src/hooks/useActiveTab.ts" "Hook"
comment_console_logs "src/hooks/useDynamicTranslation.ts" "Hook"
comment_console_logs "src/hooks/useLocalStorage.ts" "Hook"
comment_console_logs "src/hooks/usePageTitle.ts" "Hook"

print_success "Step 5 completed: Contexts and hooks console logs commented"

# Step 6: Comment console logs in main app files
print_status "Step 6: Commenting console logs in main app files..."

comment_console_logs "src/App.tsx" "Main App"
comment_console_logs "src/i18n.ts" "Main App"
comment_console_logs "src/lib/supabase.ts" "Main App"
comment_console_logs "src/lib/dynamicI18n.ts" "Main App"

print_success "Step 6 completed: Main app files console logs commented"

# Step 7: Build and restart
print_status "Step 7: Building project and restarting services..."

npm run build || {
    print_error "Failed to build project"
    exit 1
}

pm2 restart all || {
    print_error "Failed to restart PM2 processes"
    exit 1
}

print_success "Console logs commenting process completed successfully!"
print_status "Summary:"
print_status "  ✅ User-facing pages: Console logs commented"
print_status "  ✅ Email services: Console logs commented"
print_status "  ✅ Authentication services: Console logs commented"
print_status "  ✅ Utility services: Console logs commented"
print_status "  ✅ Contexts and hooks: Console logs commented"
print_status "  ✅ Main app files: Console logs commented"
print_status "  ✅ Admin panel: Console logs preserved"
print_status ""
print_status "To restore console logs later, run:"
print_status "  ./restore-console-logs.sh"
print_status ""
print_status "Process completed at $(date)"
