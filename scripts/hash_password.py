#!/usr/bin/env python3
"""
Password Hashing Utility
Generates bcrypt hash for passwords (used for admin authentication)

Usage:
    python scripts/hash_password.py
    python scripts/hash_password.py mysecretpassword
    python scripts/hash_password.py "password with spaces"
"""

import sys
import getpass
import bcrypt


def hash_password(password: str) -> str:
    """
    Hash a password using bcrypt
    
    Args:
        password: Plain text password to hash
    
    Returns:
        Bcrypt hashed password string
    """
    # Generate salt and hash password
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')


def main():
    """Main function to handle password hashing"""
    # Get password from command line argument or prompt user
    if len(sys.argv) > 1:
        # Password provided as CLI argument
        password = sys.argv[1]
    else:
        # Prompt user for password (hidden input)
        password = getpass.getpass("Enter password to hash: ")
        if not password:
            print("Error: Password cannot be empty", file=sys.stderr)
            sys.exit(1)
    
    # Hash the password
    try:
        hashed = hash_password(password)
        print(f"\nPassword hash:")
        print(hashed)
        print(f"\nCopy this hash to your .env file as ADMIN_PASSWORD_HASH")
        print(f"Or use it when creating admin users via API/scripts")
    except Exception as e:
        print(f"Error hashing password: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()

