#!/bin/bash

# Aelvynor Monorepo Setup Script
# This script bootstraps both frontend and backend development environments

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    print_info "Checking prerequisites..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ and try again."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_warn "Node.js version is less than 18. Recommended: Node.js 18+"
    else
        print_info "Node.js version: $(node -v)"
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm and try again."
        exit 1
    fi
    print_info "npm version: $(npm -v)"
    
    # Check Python
    if ! command -v python3 &> /dev/null; then
        print_error "Python 3 is not installed. Please install Python 3.10+ and try again."
        exit 1
    fi
    
    PYTHON_VERSION=$(python3 --version | cut -d' ' -f2 | cut -d'.' -f1,2)
    print_info "Python version: $(python3 --version)"
    
    # Check if Python version is 3.10+
    PYTHON_MAJOR=$(echo $PYTHON_VERSION | cut -d'.' -f1)
    PYTHON_MINOR=$(echo $PYTHON_VERSION | cut -d'.' -f2)
    if [ "$PYTHON_MAJOR" -lt 3 ] || ([ "$PYTHON_MAJOR" -eq 3 ] && [ "$PYTHON_MINOR" -lt 10 ]); then
        print_warn "Python version is less than 3.10. Recommended: Python 3.10+"
    fi
}

# Setup backend
setup_backend() {
    print_info "Setting up backend..."
    cd backend || exit 1
    
    # Create virtual environment if it doesn't exist
    if [ ! -d "venv" ]; then
        print_info "Creating Python virtual environment..."
        python3 -m venv venv
    else
        print_info "Virtual environment already exists, skipping creation..."
    fi
    
    # Activate virtual environment and install dependencies
    print_info "Installing backend dependencies..."
    source venv/bin/activate
    pip install --upgrade pip --quiet
    pip install -r requirements.txt --quiet
    
    print_info "Backend setup complete!"
    print_info "To activate the virtual environment, run: source backend/venv/bin/activate"
    
    cd ..
}

# Setup frontend
setup_frontend() {
    print_info "Setting up frontend..."
    cd frontend || exit 1
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        print_info "Installing frontend dependencies..."
        npm install
    else
        print_info "node_modules already exists, running npm install to ensure dependencies are up to date..."
        npm install
    fi
    
    print_info "Frontend setup complete!"
    cd ..
}

# Main execution
main() {
    print_info "Starting Aelvynor monorepo setup..."
    echo ""
    
    # Get the directory where the script is located
    SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
    cd "$SCRIPT_DIR" || exit 1
    
    # Check prerequisites
    check_prerequisites
    echo ""
    
    # Setup backend
    setup_backend
    echo ""
    
    # Setup frontend
    setup_frontend
    echo ""
    
    print_info "========================================="
    print_info "Setup complete! 🎉"
    print_info "========================================="
    echo ""
    print_info "Next steps:"
    echo "  1. Backend: cd backend && source venv/bin/activate && python app.py"
    echo "  2. Frontend: cd frontend && npm run dev"
    echo ""
    print_info "Or use the Makefile in backend/:"
    echo "  cd backend && make dev"
    echo ""
}

# Run main function
main

