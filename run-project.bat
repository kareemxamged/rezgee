echo "�� Starting update REZGEE App Project..."
echo "�� Starting update Order Management System App Project..."

# Navigate to project directory
cd /var/www/orders_management

# Check for available updates
echo "🔍 Checking for available updates..."
git fetch origin

# Display available updates
UPDATES=$(git log HEAD..origin/main --oneline)
if [ -z "$UPDATES" ]; then
    echo "✅ No new updates available for REZGEE App"
    # Restart the application
    echo "�� Starting update Order Management System App Project..."

    # Navigate to project directory
    cd /var/www/orders_management

    # Check for available updates
    echo "🔍 Checking for available updates..."
    git fetch origin

    # Display available updates
    UPDATES=$(git log HEAD..origin/main --oneline)
    if [ -z "$UPDATES" ]; then
        echo "✅ No new updates available for Order Management System App"
        exit 0
    fi

    echo "📥 Available updates:"
    echo "$UPDATES"

    # Pull updates from GitHub
    echo "📥 Pulling updates from GitHub..."
    git pull origin main

    # Install new dependencies
    echo "📦 Installing dependencies..."
    npm ci --only=production

    echo "installing important..."
    npm i

    # Build the project
    echo "🏗️ Building project..."
    npm run build


    # Restart the application
    echo "🔄 Restarting all applications..."
    pm2 restart all

    # Save pm2 processing
    echo "✅ Save pm2 processing..."
    pm2 save

    # Check application status
    echo "✅ Checking application status..."
    pm2 status

    echo "🎉 Order Mnagement App only updated successfully!"
    exit 0
fi

echo "📥 Available updates:"
echo "$UPDATES"

# Pull updates from GitHub
echo "📥 Pulling updates from GitHub..."
git pull origin main

# Install new dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

echo "installing important..."
npm i

# Build the project
echo "🏗️ Building project..."
npm run build

# Restart the application
echo "🔄 Restarting all applications..."
pm2 restart all

# Save pm2 processing
echo "✅ Save pm2 processing..."
pm2 save

# Check application status
echo "✅ Checking application status..."
pm2 status

echo "🎉 Projects updated successfully!"