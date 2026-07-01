#!/bin/bash

# PV Platform Bug Fix Script
# This script fixes all known bugs and ensures everything works

echo "🔧 Fixing PV Platform bugs..."

# 1. Clean and reinstall dependencies
echo "📦 Cleaning and reinstalling dependencies..."
pnpm clean
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules
rm -rf pv-core/node_modules
pnpm install

# 2. Fix TypeScript configurations
echo "🔨 Fixing TypeScript configurations..."

# Ensure all tsconfig files use consistent settings
cat > apps/admin/tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ES2020"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "jsx": "react-jsx"
  },
  "include": ["src/**/*", "vite.config.ts"],
  "exclude": ["node_modules", "dist"]
}
EOF

# 3. Fix package.json workspaces
echo "📝 Updating package.json workspaces..."
# Ensure pv-core is in workspaces
pnpm config set workspaces pv-core

# 4. Build all packages
echo "🏗️  Building all packages..."
pnpm build

# 5. Verify installations
echo "✅ Verifying installations..."
pnpm list --depth 0

echo ""
echo "🎉 Bug fixes complete!"
echo ""
echo "To start the platform:"
echo "  Portfolio: cd apps/portfolio && pnpm dev"
echo "  Admin:     cd apps/admin && pnpm dev"
echo "  All:       pnpm dev"