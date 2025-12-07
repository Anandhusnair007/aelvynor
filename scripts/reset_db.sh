#!/bin/bash

# Exit on error
set -e

echo "🗑️  Resetting Database..."

cd backend
if [ -f "aelvynor.db" ]; then
    rm aelvynor.db
    echo "Deleted existing database."
fi

if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
source venv/bin/activate
pip install -r requirements.txt

echo "🌱 Seeding new data..."
python scripts/seed.py

echo "👤 Creating default admin..."
python scripts/create_admin.py --username admin --password admin123

echo "✅ Database reset complete!"
