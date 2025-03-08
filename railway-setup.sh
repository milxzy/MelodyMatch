#!/bin/bash

# Railway Setup Script for MelodyMatch
# This script helps you set up Railway deployment quickly

set -e  # Exit on error

echo "🚂 Railway Setup for MelodyMatch Backend"
echo "========================================"
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found!"
    echo ""
    echo "Please install Railway CLI first:"
    echo "  npm install -g @railway/cli"
    echo "  or"
    echo "  brew install railway"
    echo ""
    exit 1
fi

echo "✅ Railway CLI found!"
echo ""

# Check if logged in
if ! railway whoami &> /dev/null; then
    echo "🔐 Please login to Railway..."
    railway login
    echo ""
fi

echo "✅ Logged in to Railway!"
echo ""

# Ask if user wants to initialize a new project or link existing
echo "Do you want to:"
echo "  1) Create a new Railway project"
echo "  2) Link to an existing Railway project"
read -p "Enter choice (1 or 2): " choice

if [ "$choice" = "1" ]; then
    echo ""
    echo "📦 Initializing new Railway project..."
    railway init
elif [ "$choice" = "2" ]; then
    echo ""
    echo "🔗 Linking to existing Railway project..."
    railway link
else
    echo "Invalid choice. Exiting."
    exit 1
fi

echo ""
echo "✅ Project initialized!"
echo ""

# Ask if user wants to set environment variables now
read -p "Do you want to set environment variables now? (y/n): " set_vars

if [ "$set_vars" = "y" ] || [ "$set_vars" = "Y" ]; then
    echo ""
    echo "📝 Setting environment variables..."
    echo ""
    echo "Please enter your environment variables:"
    echo "(Press Enter to skip any variable)"
    echo ""
    
    read -p "CONNECTION_STRING (MongoDB): " connection_string
    if [ ! -z "$connection_string" ]; then
        railway variables set CONNECTION_STRING="$connection_string"
    fi
    
    read -p "CLIENT_ID (Spotify): " client_id
    if [ ! -z "$client_id" ]; then
        railway variables set CLIENT_ID="$client_id"
    fi
    
    read -p "CLIENT_SECRET (Spotify): " client_secret
    if [ ! -z "$client_secret" ]; then
        railway variables set CLIENT_SECRET="$client_secret"
    fi
    
    read -p "JWT_SECRET: " jwt_secret
    if [ ! -z "$jwt_secret" ]; then
        railway variables set JWT_SECRET="$jwt_secret"
    fi
    
    read -p "SESSION_SECRET: " session_secret
    if [ ! -z "$session_secret" ]; then
        railway variables set SESSION_SECRET="$session_secret"
    fi
    
    read -p "FRONTEND_URL (e.g., https://melodymatch.vercel.app): " frontend_url
    if [ ! -z "$frontend_url" ]; then
        railway variables set FRONTEND_URL="$frontend_url"
    fi
    
    echo ""
    echo "Note: BACKEND_URL and REDIRECT_URI will be set after deployment"
    echo ""
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Deploy your app: railway up"
echo "  2. Get your URL: railway domain"
echo "  3. Update BACKEND_URL and REDIRECT_URI variables"
echo "  4. See RAILWAY_DEPLOYMENT.md for complete guide"
echo ""
echo "Useful commands:"
echo "  railway up          - Deploy your app"
echo "  railway logs        - View logs"
echo "  railway status      - Check status"
echo "  railway variables   - View environment variables"
echo "  railway open        - Open dashboard"
echo ""
echo "📚 Full guide: RAILWAY_DEPLOYMENT.md"
echo "✅ Checklist: RAILWAY_CHECKLIST.md"
echo ""
