#!/usr/bin/env python3
"""
Password Hashing Utility
Generates a bcrypt hash for the admin password to use in .env file

Usage:
    python hash_password.py
    python hash_password.py "your-password-here"
"""

import sys
from passlib.context import CryptContext

# Initialize password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    return pwd_context.hash(password)


def main():
    """Main function to hash password"""
    if len(sys.argv) > 1:
        password = sys.argv[1]
    else:
        # Prompt for password (hidden input)
        import getpass
        password = getpass.getpass("Enter password to hash: ")
        if not password:
            print("Error: Password cannot be empty", file=sys.stderr)
            sys.exit(1)
    
    hashed = hash_password(password)
    print("\n" + "=" * 60)
    print("Hashed Password (use this in your .env file):")
    print("=" * 60)
    print(hashed)
    print("=" * 60)
    print("\nAdd this to your .env file:")
    print(f"ADMIN_PASSWORD_HASH={hashed}")
    print()


if __name__ == "__main__":
    main()

