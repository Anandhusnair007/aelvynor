#!/usr/bin/env python3
"""
Create Initial Admin User Script
Creates an admin user in the database with hashed password

Usage:
    python create_admin.py
    python create_admin.py --username admin --password mypassword --email admin@example.com
"""

import sys
import argparse
import getpass
from sqlmodel import Session, create_engine
from app.config import settings
from app.models import create_db_and_tables
from app.crud import create_admin, get_admin_by_username, update_admin_password
import bcrypt


def main():
    """Main function to create admin user"""
    parser = argparse.ArgumentParser(description="Create initial admin user")
    parser.add_argument("--username", type=str, help="Admin username")
    parser.add_argument("--password", type=str, help="Admin password")
    parser.add_argument("--email", type=str, help="Admin email")
    parser.add_argument("--full-name", type=str, help="Admin full name")
    parser.add_argument("--superuser", action="store_true", help="Make user a superuser")
    
    args = parser.parse_args()
    
    # Get username
    if args.username:
        username = args.username
    else:
        username = input("Enter admin username (default: admin): ").strip() or "admin"
    
    # Check if admin already exists
    engine = create_engine(settings.DATABASE_URL, echo=False)
    create_db_and_tables(engine)
    
    with Session(engine) as db:
        existing_admin = get_admin_by_username(db, username)
        if existing_admin:
            print(f"❌ Admin user '{username}' already exists!")
            
            # Update password if provided
            if args.password:
                password = args.password
            else:
                response = input("Do you want to update the password? (y/N): ").strip().lower()
                if response != 'y':
                    print("Aborted.")
                    sys.exit(1)
                password = getpass.getpass("Enter new password: ")
                password_confirm = getpass.getpass("Confirm password: ")
                if password != password_confirm:
                    print("❌ Passwords do not match!")
                    sys.exit(1)
            
            password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            update_admin_password(
                db,
                existing_admin.id,
                new_password_hash=password_hash
            )
            db.commit()
            print(f"✅ Password updated for admin user '{username}'")
            sys.exit(0)
    
    # Get password
    if args.password:
        password = args.password
    else:
        password = getpass.getpass("Enter admin password: ")
        password_confirm = getpass.getpass("Confirm password: ")
        if password != password_confirm:
            print("❌ Passwords do not match!")
            sys.exit(1)
    
    if not password:
        print("❌ Password cannot be empty!")
        sys.exit(1)
    
    # Get email
    if args.email:
        email = args.email
    else:
        try:
            email = input("Enter admin email (optional): ").strip() or None
        except (EOFError, KeyboardInterrupt):
            email = None
    
    # Get full name
    if hasattr(args, 'full_name') and args.full_name:
        full_name = args.full_name
    else:
        try:
            full_name = input("Enter admin full name (optional): ").strip() or None
        except (EOFError, KeyboardInterrupt):
            full_name = None
    
    # Hash password using bcrypt directly
    password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    # Create admin user
    with Session(engine) as db:
        try:
            admin = create_admin(
                db=db,
                username=username,
                password_hash=password_hash,
                email=email,
                full_name=full_name,
                is_superuser=args.superuser
            )
            print("\n" + "=" * 60)
            print("✅ Admin user created successfully!")
            print("=" * 60)
            print(f"Username: {admin.username}")
            print(f"Email: {admin.email or 'Not set'}")
            print(f"Full Name: {admin.full_name or 'Not set'}")
            print(f"Superuser: {admin.is_superuser}")
            print(f"Active: {admin.is_active}")
            print("=" * 60)
            print("\nYou can now login using:")
            print(f"  POST /api/admin/login")
            print(f"  Body: {{'username': '{username}', 'password': 'your_password'}}")
            print()
        except Exception as e:
            print(f"❌ Error creating admin user: {e}")
            sys.exit(1)


if __name__ == "__main__":
    main()

