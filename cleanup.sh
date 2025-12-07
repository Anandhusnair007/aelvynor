#!/bin/bash

# Production Cleanup Script
# Removes all .md files except README.md and cleans up unused files

echo "🧹 Starting Production Cleanup..."
echo ""

# Remove all .md files except README.md (excluding node_modules, venv, .agent)
echo "📄 Removing unnecessary .md files..."
find . -name "*.md" -type f \
  -not -path "*/node_modules/*" \
  -not -path "*/venv/*" \
  -not -path "*/.agent/*" \
  -not -name "README.md" \
  -exec rm -v {} \;

echo ""
echo "✅ Removed unnecessary .md files"
echo ""

# Remove test files and temporary files
echo "🧪 Cleaning up test files..."
rm -f test_*.py
rm -f test_*.sh
rm -f *_test.py
rm -f *.txt
rm -f resume.pdf

echo "✅ Removed test files"
echo ""

# Remove unused documentation directories
if [ -d "test_files" ]; then
    rm -rf test_files
    echo "✅ Removed test_files directory"
fi

# Keep only essential scripts
echo "📝 Keeping essential scripts..."
# start_servers.sh, stop_servers.sh are essential
# Remove others if they exist

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Production cleanup complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Summary:"
echo "  • Removed all .md files except README.md"
echo "  • Removed test files"
echo "  • Cleaned up temporary files"
echo "  • Application is production-ready!"
echo ""

