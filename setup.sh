#!/bin/bash

# Quiz System - Quick Setup Script
# Auto-setup for local development

echo "🚀 Quiz System - Quick Setup"
echo "================================"
echo ""

# Check Node.js
echo "📦 Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js 18+ from: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v)
echo "✅ Node.js version: $NODE_VERSION"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi
echo "✅ Dependencies installed"
echo ""

# Setup .env.local
echo "🔧 Setting up environment variables..."
if [ ! -f .env.local ]; then
    if [ -f .env.example ]; then
        cp .env.example .env.local
        echo "✅ Created .env.local from .env.example"
        echo ""
        echo "⚠️  IMPORTANT: You need to configure:"
        echo "   1. GOOGLE_CLIENT_ID"
        echo "   2. GOOGLE_CLIENT_SECRET"
        echo "   3. NEXTAUTH_SECRET"
        echo "   4. Database connection strings"
        echo ""
        echo "📝 Edit .env.local file with your credentials"
    else
        echo "❌ .env.example not found"
        exit 1
    fi
else
    echo "✅ .env.local already exists"
fi
echo ""

# Generate NEXTAUTH_SECRET if needed
echo "🔑 Generating NEXTAUTH_SECRET..."
if command -v openssl &> /dev/null; then
    SECRET=$(openssl rand -base64 32)
    echo "Your NEXTAUTH_SECRET: $SECRET"
    echo "Copy this to your .env.local file"
else
    echo "⚠️  openssl not found. Generate secret manually:"
    echo "Visit: https://generate-secret.vercel.app/32"
fi
echo ""

# Check .env.local configuration
echo "🔍 Checking configuration..."
if grep -q "your_google_client_id" .env.local 2>/dev/null; then
    echo "⚠️  GOOGLE_CLIENT_ID not configured yet"
    echo "   Please update .env.local with your Google OAuth credentials"
fi

if grep -q "your_random_secret" .env.local 2>/dev/null; then
    echo "⚠️  NEXTAUTH_SECRET not configured yet"
    echo "   Please update .env.local with a random secret"
fi
echo ""

# Setup instructions
echo "📋 Next Steps:"
echo "================================"
echo ""
echo "1. Configure Google OAuth:"
echo "   - Go to: https://console.cloud.google.com/"
echo "   - Create OAuth 2.0 Client ID"
echo "   - Add redirect URI: http://localhost:3000/api/auth/callback/google"
echo "   - Copy Client ID and Secret to .env.local"
echo ""
echo "2. Setup Database:"
echo "   Option A: Vercel Postgres (recommended)"
echo "   - Go to: https://vercel.com/storage"
echo "   - Create Postgres database"
echo "   - Copy connection strings to .env.local"
echo "   - Import schema.sql and seed_questions_314.sql"
echo ""
echo "   Option B: Local PostgreSQL"
echo "   - Install PostgreSQL"
echo "   - Create database: quiz_system"
echo "   - Run: psql -d quiz_system -f schema.sql"
echo "   - Run: psql -d quiz_system -f data/seed_questions_314.sql"
echo ""
echo "3. Start Development Server:"
echo "   npm run dev"
echo ""
echo "4. Open Browser:"
echo "   http://localhost:3000"
echo ""
echo "================================"
echo "✅ Setup complete!"
echo ""
echo "For detailed instructions, see: LOCAL_DEVELOPMENT.md"
echo ""
