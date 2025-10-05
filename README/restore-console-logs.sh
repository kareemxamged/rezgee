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

# Start restoring console logs process
print_status "Starting console logs restoration process..."

# Navigate to project directory
cd /var/www/rezgee || {
    print_error "Failed to navigate to project directory"
    exit 1
}

# Function to restore console logs in a file
restore_console_logs() {
    local file="$1"
    local file_type="$2"
    
    if [ ! -f "$file" ]; then
        return
    fi
    
    print_status "Restoring $file_type: $file"
    
    # Restore console.log statements (single line)
    sed -i 's/^[[:space:]]*\/\/ console\.log(/console.log(/g' "$file"
    
    # Restore console.warn statements
    sed -i 's/^[[:space:]]*\/\/ console\.warn(/console.warn(/g' "$file"
    
    # Restore console.error statements
    sed -i 's/^[[:space:]]*\/\/ console\.error(/console.error(/g' "$file"
    
    # Restore console.info statements
    sed -i 's/^[[:space:]]*\/\/ console\.info(/console.info(/g' "$file"
    
    # Restore console.debug statements
    sed -i 's/^[[:space:]]*\/\/ console\.debug(/console.debug(/g' "$file"
    
    # Restore multi-line console statements
    sed -i '/^[[:space:]]*\/\/ console\.log(/,/);/s/^\/\/ //' "$file"
    sed -i '/^[[:space:]]*\/\/ console\.warn(/,/);/s/^\/\/ //' "$file"
    sed -i '/^[[:space:]]*\/\/ console\.error(/,/);/s/^\/\/ //' "$file"
    sed -i '/^[[:space:]]*\/\/ console\.info(/,/);/s/^\/\/ //' "$file"
    sed -i '/^[[:space:]]*\/\/ console\.debug(/,/);/s/^\/\/ //' "$file"
    
    print_success "Restored console logs in: $file"
}

# Step 1: Restore console logs in user-facing pages
print_status "Step 1: Restoring console logs in user-facing pages..."

# User pages
restore_console_logs "src/components/LoginPage.tsx" "User Page"
restore_console_logs "src/components/RegisterPage.tsx" "User Page"
restore_console_logs "src/components/ForgotPasswordPage.tsx" "User Page"
restore_console_logs "src/components/ResetPasswordPage.tsx" "User Page"
restore_console_logs "src/components/TwoFactorVerificationPage.tsx" "User Page"
restore_console_logs "src/components/TemporaryPasswordLoginPage.tsx" "User Page"
restore_console_logs "src/components/SetPasswordPage.tsx" "User Page"
restore_console_logs "src/components/VerifyEmailChangePage.tsx" "User Page"
restore_console_logs "src/components/UnsubscribePage.tsx" "User Page"

# Main user components
restore_console_logs "src/components/HomePage.tsx" "User Component"
restore_console_logs "src/components/DashboardPage.tsx" "User Component"
restore_console_logs "src/components/EnhancedProfilePage.tsx" "User Component"
restore_console_logs "src/components/PublicProfilePage.tsx" "User Component"
restore_console_logs "src/components/MatchesPage.tsx" "User Component"
restore_console_logs "src/components/LikesPage.tsx" "User Component"
restore_console_logs "src/components/MessagesPage.tsx" "User Component"
restore_console_logs "src/components/ContactPage.tsx" "User Component"
restore_console_logs "src/components/SearchPage.tsx" "User Component"
restore_console_logs "src/components/ArticlesPage.tsx" "User Component"
restore_console_logs "src/components/ArticleDetailPage.tsx" "User Component"
restore_console_logs "src/components/ArticleContent.tsx" "User Component"
restore_console_logs "src/components/NotificationsPage.tsx" "User Component"
restore_console_logs "src/components/NotificationDropdown.tsx" "User Component"

# Payment and subscription pages
restore_console_logs "src/components/PaymentPage.tsx" "Payment Page"
restore_console_logs "src/components/PaymentSuccessPage.tsx" "Payment Page"
restore_console_logs "src/components/SubscriptionPage.tsx" "Subscription Page"
restore_console_logs "src/components/SubscriptionBanner.tsx" "Subscription Component"
restore_console_logs "src/components/EnhancedPaymentPage.tsx" "Payment Page"

# Security and verification components
restore_console_logs "src/components/SecuritySettingsPage.tsx" "Security Component"
restore_console_logs "src/components/VerificationStatus.tsx" "Verification Component"
restore_console_logs "src/components/verification/IdentityVerificationModal.tsx" "Verification Component"
restore_console_logs "src/components/verification/CameraCapture.tsx" "Verification Component"

# Utility components
restore_console_logs "src/components/Header.tsx" "Utility Component"
restore_console_logs "src/components/ProfileImageUpload.tsx" "Utility Component"
restore_console_logs "src/components/PhoneInput.tsx" "Utility Component"
restore_console_logs "src/components/LanguageToggle.tsx" "Utility Component"
restore_console_logs "src/components/ShareProfileButton.tsx" "Utility Component"
restore_console_logs "src/components/UsageStatus.tsx" "Utility Component"
restore_console_logs "src/components/ConnectionStatus.tsx" "Utility Component"
restore_console_logs "src/components/SilentConnectionManager.tsx" "Utility Component"
restore_console_logs "src/components/EmailSyncWarning.tsx" "Utility Component"
restore_console_logs "src/components/DeleteConfirmModal.tsx" "Utility Component"
restore_console_logs "src/components/RecaptchaComponent.tsx" "Utility Component"

# Alert components
restore_console_logs "src/components/alerts/UserAlertPopup.tsx" "Alert Component"
restore_console_logs "src/components/alerts/AlertsManager.tsx" "Alert Component"

# Comment system
restore_console_logs "src/components/CommentSystem.tsx" "Comment Component"

# Advanced components
restore_console_logs "src/components/AdvancedSecurityDashboard.tsx" "Advanced Component"
restore_console_logs "src/components/TextManagement.tsx" "Advanced Component"
restore_console_logs "src/components/MigrationManager.tsx" "Advanced Component"
restore_console_logs "src/components/TranslationTest.tsx" "Advanced Component"

print_success "Step 1 completed: User-facing pages console logs restored"

# Step 2: Restore console logs in email services
print_status "Step 2: Restoring console logs in email services..."

restore_console_logs "src/lib/unifiedEmailService.ts" "Email Service"
restore_console_logs "src/lib/templateSMTPManager.ts" "Email Service"
restore_console_logs "src/lib/databaseSMTPManager.ts" "Email Service"
restore_console_logs "src/lib/localSMTPService.ts" "Email Service"
restore_console_logs "src/lib/notificationEmailService.ts" "Email Service"
restore_console_logs "src/lib/templateBasedEmailService.ts" "Email Service"
restore_console_logs "src/lib/authEmailServiceDatabase.ts" "Email Service"
restore_console_logs "src/lib/notificationEmailServiceDatabase.ts" "Email Service"
restore_console_logs "src/lib/integratedEmailService.ts" "Email Service"
restore_console_logs "src/lib/temporaryPasswordEmailService.ts" "Email Service"
restore_console_logs "src/lib/emailService.ts" "Email Service"
restore_console_logs "src/lib/databaseEmailService.ts" "Email Service"
restore_console_logs "src/lib/unifiedDatabaseEmailService.ts" "Email Service"
restore_console_logs "src/lib/emailVerification.ts" "Email Service"
restore_console_logs "src/lib/clientEmailService.ts" "Email Service"
restore_console_logs "src/lib/finalEmailService.ts" "Email Service"
restore_console_logs "src/lib/simpleDynamicEmailService.ts" "Email Service"
restore_console_logs "src/lib/directNotificationEmailService.ts" "Email Service"
restore_console_logs "src/lib/dynamicLanguageEmailService.ts" "Email Service"
restore_console_logs "src/lib/finalEmailServiceNew.ts" "Email Service"
restore_console_logs "src/lib/realEmailService.ts" "Email Service"
restore_console_logs "src/lib/optimizedEmailService.ts" "Email Service"
restore_console_logs "src/lib/supabaseCustomSMTPService.ts" "Email Service"
restore_console_logs "src/lib/browserEmailService.ts" "Email Service"
restore_console_logs "src/lib/workingEmailService.ts" "Email Service"
restore_console_logs "src/lib/actualEmailService.ts" "Email Service"
restore_console_logs "src/lib/supabaseEmailService.ts" "Email Service"
restore_console_logs "src/lib/simpleResendService.ts" "Email Service"
restore_console_logs "src/lib/resendOnlyEmailService.ts" "Email Service"
restore_console_logs "src/lib/quickEmailService.ts" "Email Service"
restore_console_logs "src/lib/directSMTPService.ts" "Email Service"

print_success "Step 2 completed: Email services console logs restored"

# Step 3: Restore console logs in authentication services
print_status "Step 3: Restoring console logs in authentication services..."

restore_console_logs "src/lib/twoFactorService.ts" "Auth Service"
restore_console_logs "src/lib/adminTwoFactorService.ts" "Auth Service"
restore_console_logs "src/lib/userTwoFactorService.ts" "Auth Service"
restore_console_logs "src/lib/verificationService.ts" "Auth Service"
restore_console_logs "src/lib/adminAuthService.ts" "Auth Service"
restore_console_logs "src/lib/separateAdminAuth.ts" "Auth Service"
restore_console_logs "src/lib/temporaryPasswordService.ts" "Auth Service"
restore_console_logs "src/lib/deviceSecurityService.ts" "Auth Service"
restore_console_logs "src/lib/userTrustedDeviceService.ts" "Auth Service"
restore_console_logs "src/lib/adminTrustedDeviceService.ts" "Auth Service"
restore_console_logs "src/lib/loginAttemptsService.ts" "Auth Service"
restore_console_logs "src/lib/antiTamperingService.ts" "Auth Service"

print_success "Step 3 completed: Authentication services console logs restored"

# Step 4: Restore console logs in utility services
print_status "Step 4: Restoring console logs in utility services..."

restore_console_logs "src/lib/deviceLocationService.ts" "Utility Service"
restore_console_logs "src/lib/languageDetectionService.ts" "Utility Service"
restore_console_logs "src/lib/deviceAnalysisService.ts" "Utility Service"
restore_console_logs "src/lib/dashboardService.ts" "Utility Service"
restore_console_logs "src/lib/userPresenceService.ts" "Utility Service"
restore_console_logs "src/lib/adminManagementService.ts" "Utility Service"
restore_console_logs "src/lib/adminDashboardService.ts" "Utility Service"
restore_console_logs "src/lib/matchingService.ts" "Utility Service"
restore_console_logs "src/lib/ipLocationService.ts" "Utility Service"
restore_console_logs "src/lib/subscriptionService.ts" "Utility Service"
restore_console_logs "src/lib/featureAccessService.ts" "Utility Service"
restore_console_logs "src/lib/featureAccess.ts" "Utility Service"
restore_console_logs "src/lib/smtpService.ts" "Utility Service"
restore_console_logs "src/lib/notificationService.ts" "Utility Service"
restore_console_logs "src/lib/profileImageService.ts" "Utility Service"
restore_console_logs "src/lib/payTabsService.ts" "Utility Service"
restore_console_logs "src/lib/paymentService.ts" "Utility Service"
restore_console_logs "src/lib/paymentMethodsService.ts" "Utility Service"
restore_console_logs "src/lib/likesService.ts" "Utility Service"
restore_console_logs "src/lib/alertsService.ts" "Utility Service"
restore_console_logs "src/lib/newsletterService.ts" "Utility Service"
restore_console_logs "src/lib/nodemailerSMTP.ts" "Utility Service"
restore_console_logs "src/lib/separateAdminUsersService.ts" "Utility Service"
restore_console_logs "src/lib/adminUsersService.ts" "Utility Service"

print_success "Step 4 completed: Utility services console logs restored"

# Step 5: Restore console logs in contexts and hooks
print_status "Step 5: Restoring console logs in contexts and hooks..."

restore_console_logs "src/contexts/AuthContext.tsx" "Context"
restore_console_logs "src/contexts/AdminContext.tsx" "Context"
restore_console_logs "src/hooks/useUserPresence.ts" "Hook"
restore_console_logs "src/hooks/useSubscription.ts" "Hook"
restore_console_logs "src/hooks/useRealtimeUpdates.ts" "Hook"
restore_console_logs "src/hooks/useActiveTab.ts" "Hook"
restore_console_logs "src/hooks/useDynamicTranslation.ts" "Hook"
restore_console_logs "src/hooks/useLocalStorage.ts" "Hook"
restore_console_logs "src/hooks/usePageTitle.ts" "Hook"

print_success "Step 5 completed: Contexts and hooks console logs restored"

# Step 6: Restore console logs in main app files
print_status "Step 6: Restoring console logs in main app files..."

restore_console_logs "src/App.tsx" "Main App"
restore_console_logs "src/i18n.ts" "Main App"
restore_console_logs "src/lib/supabase.ts" "Main App"
restore_console_logs "src/lib/dynamicI18n.ts" "Main App"

print_success "Step 6 completed: Main app files console logs restored"

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

print_success "Console logs restoration process completed successfully!"
print_status "Summary:"
print_status "  ✅ User-facing pages: Console logs restored"
print_status "  ✅ Email services: Console logs restored"
print_status "  ✅ Authentication services: Console logs restored"
print_status "  ✅ Utility services: Console logs restored"
print_status "  ✅ Contexts and hooks: Console logs restored"
print_status "  ✅ Main app files: Console logs restored"
print_status ""
print_status "All console logs have been restored and are now active"
print_status ""
print_status "Process completed at $(date)"
