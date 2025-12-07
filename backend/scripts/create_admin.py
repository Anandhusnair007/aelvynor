#!/usr/bin/env python3
"""
Create Initial Admin User Script
Creates an admin user in the database with hashed password

Usage:
    python scripts/create_admin.py --username admin --password "mypassword"
"""

import sys
import argparse
from pathlib import Path

# Add parent directory to path to import app modules
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlmodel import Session, create_engine
from app.config import settings
from app.models import create_db_and_tables
from app.crud import create_admin, get_admin_by_username
from app.auth import get_password_hash


def main():
    """Main function to create admin user"""
    parser = argparse.ArgumentParser(
        description="Create initial admin user in the database",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python scripts/create_admin.py --username admin --password "mypassword"
        """
    )
    parser.add_argument(
        "--username",
        type=str,
        required=True,
        help="Admin username (required)"
    )
    parser.add_argument(
        "--password",
        type=str,
        required=True,
        help="Admin password (required)"
    )
    
    args = parser.parse_args()
    
    # Validate inputs
    if not args.username or not args.username.strip():
        print("❌ Error: Username cannot be empty", file=sys.stderr)
        sys.exit(1)
    
    if not args.password or not args.password.strip():
        print("❌ Error: Password cannot be empty", file=sys.stderr)
        sys.exit(1)
    
    username = args.username.strip()
    password = args.password
    
    # Initialize database
    engine = create_engine(settings.DATABASE_URL, echo=False)
    create_db_and_tables(engine)
    
    # Check if admin already exists
    with Session(engine) as db:
        existing_admin = get_admin_by_username(db, username)
        if existing_admin:
            print(f"⚠️  Admin user '{username}' already exists!", file=sys.stderr)
            print(f"   ID: {existing_admin.id}")
            print("\nTo update the password, delete the existing admin first or use a different username.")
            sys.exit(1)
    
    # Hash password
    try:
        password_hash = get_password_hash(password)
    except Exception as e:
        print(f"❌ Error hashing password: {e}", file=sys.stderr)
        sys.exit(1)
    
    # Create admin user
    with Session(engine) as db:
        try:
            admin = create_admin(
                db=db,
                username=username,
                password_hash=password_hash
            )
            
            print("\n" + "=" * 60)
            print("✅ Admin user created successfully!")
            print("=" * 60)
            print(f"Username: {admin.username}")
            print(f"ID: {admin.id}")
            print("=" * 60)
            print("\n📝 Login Information:")
            print(f"   Endpoint: POST /api/admin/login")
            print(f"   Username: {username}")
            print(f"   Password: {'*' * len(password)}")
            print("\n💡 Example curl command:")
            print(f'   curl -X POST "http://localhost:8000/api/admin/login" \\')
            print(f'        -H "Content-Type: application/x-www-form-urlencoded" \\')
            print(f'        -d "username={username}&password=YOUR_PASSWORD"')
            print()
            
        except Exception as e:
            print(f"❌ Error creating admin user: {e}", file=sys.stderr)
            db.rollback()
            sys.exit(1)


if __name__ == "__main__":
    main()

