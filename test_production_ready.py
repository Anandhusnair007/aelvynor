#!/usr/bin/env python3
"""
Production Readiness Test Suite
Tests all features and validates production readiness
"""

import requests
import json
import sys
from datetime import datetime

BASE_URL = "http://localhost:8000"
FRONTEND_URL = "http://localhost:3000"

GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
RESET = '\033[0m'

def print_section(text):
    print(f"\n{BLUE}{'='*70}{RESET}")
    print(f"{BLUE}{text.center(70)}{RESET}")
    print(f"{BLUE}{'='*70}{RESET}\n")

def test_result(name, passed, details=""):
    icon = f"{GREEN}✅{RESET}" if passed else f"{RED}❌{RESET}"
    print(f"{icon} {name}")
    if details:
        print(f"   {details}")

def check_service(url, name):
    try:
        response = requests.get(url, timeout=5)
        return response.status_code in [200, 307, 302], response.status_code
    except:
        return False, 0

def login():
    try:
        response = requests.post(
            f"{BASE_URL}/api/admin/login",
            data={"username": "admin@gmail.com", "password": "cyberdrift"},
            timeout=5
        )
        if response.status_code == 200:
            return response.json()["access_token"]
        return None
    except:
        return None

def test_all_features():
    print_section("PRODUCTION READINESS TEST")
    
    results = {
        "services": {"passed": 0, "failed": 0},
        "apis": {"passed": 0, "failed": 0},
        "features": {"passed": 0, "failed": 0},
    }
    
    # 1. Service Health Checks
    print_section("1. SERVICE HEALTH CHECKS")
    
    backend_ok, status = check_service(f"{BASE_URL}/api/health", "Backend")
    test_result("Backend Service", backend_ok, f"Status: {status}")
    if backend_ok:
        results["services"]["passed"] += 1
    else:
        results["services"]["failed"] += 1
    
    frontend_ok, status = check_service(f"{FRONTEND_URL}", "Frontend")
    test_result("Frontend Service", frontend_ok, f"Status: {status}")
    if frontend_ok:
        results["services"]["passed"] += 1
    else:
        results["services"]["failed"] += 1
    
    # 2. API Endpoints
    print_section("2. API ENDPOINT TESTS")
    
    token = login()
    if token:
        test_result("Admin Login API", True)
        results["apis"]["passed"] += 1
        headers = {"Authorization": f"Bearer {token}"}
        
        # Test all major endpoints
        endpoints = [
            ("GET", "/api/projects", None, "Public Projects"),
            ("GET", "/api/courses", None, "Public Courses"),
            ("GET", "/api/internships", None, "Public Internships"),
            ("GET", "/api/product", None, "Public Product"),
            ("GET", "/api/project-templates", None, "Public Project Templates"),
            ("GET", "/api/admin/projects", headers, "Admin Projects"),
            ("GET", "/api/admin/courses", headers, "Admin Courses"),
            ("GET", "/api/admin/internships", headers, "Admin Internships"),
            ("GET", "/api/admin/applications", headers, "Admin Applications"),
            ("GET", "/api/admin/project-templates", headers, "Admin Project Templates"),
            ("GET", "/api/admin/project-requests", headers, "Admin Project Requests"),
        ]
        
        for method, endpoint, auth, name in endpoints:
            try:
                url = f"{BASE_URL}{endpoint}"
                if method == "GET":
                    response = requests.get(url, headers=auth, timeout=5)
                    passed = response.status_code in [200, 201]
                    test_result(name, passed, f"Status: {response.status_code}")
                    if passed:
                        results["apis"]["passed"] += 1
                    else:
                        results["apis"]["failed"] += 1
            except Exception as e:
                test_result(name, False, f"Error: {str(e)[:50]}")
                results["apis"]["failed"] += 1
    else:
        test_result("Admin Login API", False, "Cannot authenticate")
        results["apis"]["failed"] += 1
    
    # 3. Feature Tests
    print_section("3. FEATURE TESTS")
    
    features = [
        ("User Panel - Home", f"{FRONTEND_URL}/", True),
        ("User Panel - Company", f"{FRONTEND_URL}/about", True),
        ("User Panel - Solutions", f"{FRONTEND_URL}/projects", True),
        ("User Panel - Academy", f"{FRONTEND_URL}/courses", True),
        ("User Panel - Connect", f"{FRONTEND_URL}/internships", True),
        ("User Panel - Momentum", f"{FRONTEND_URL}/product", True),
        ("User Panel - Service & Solutions", f"{FRONTEND_URL}/contact", True),
        ("User Panel - Project Templates", f"{FRONTEND_URL}/project-templates", True),
        ("Admin Panel - Login", f"{FRONTEND_URL}/admin/login", True),
        ("Admin Panel - Dashboard", f"{FRONTEND_URL}/admin/dashboard", False),
    ]
    
    for name, url, public in features:
        ok, status = check_service(url, name)
        if not ok and not public:
            # Admin pages redirect to login, that's OK
            ok = status in [307, 302]
        test_result(name, ok, f"Status: {status}")
        if ok:
            results["features"]["passed"] += 1
        else:
            results["features"]["failed"] += 1
    
    # Summary
    print_section("TEST SUMMARY")
    
    total_passed = (
        results["services"]["passed"] +
        results["apis"]["passed"] +
        results["features"]["passed"]
    )
    total_failed = (
        results["services"]["failed"] +
        results["apis"]["failed"] +
        results["features"]["failed"]
    )
    total = total_passed + total_failed
    
    print(f"{GREEN}✅ Services: {results['services']['passed']}/{results['services']['passed'] + results['services']['failed']}{RESET}")
    print(f"{GREEN}✅ APIs: {results['apis']['passed']}/{results['apis']['passed'] + results['apis']['failed']}{RESET}")
    print(f"{GREEN}✅ Features: {results['features']['passed']}/{results['features']['passed'] + results['features']['failed']}{RESET}")
    print(f"\n{GREEN}✅ Total Passed: {total_passed}{RESET}")
    print(f"{RED}❌ Total Failed: {total_failed}{RESET}")
    print(f"{YELLOW}📊 Total Tests: {total}{RESET}")
    
    success_rate = (total_passed / total * 100) if total > 0 else 0
    print(f"\n{YELLOW}Success Rate: {success_rate:.1f}%{RESET}\n")
    
    if total_failed == 0:
        print(f"{GREEN}{'='*70}{RESET}")
        print(f"{GREEN}{'🎉 ALL TESTS PASSED - PRODUCTION READY!'.center(70)}{RESET}")
        print(f"{GREEN}{'='*70}{RESET}\n")
        return True
    else:
        print(f"{YELLOW}{'='*70}{RESET}")
        print(f"{YELLOW}{'⚠️  SOME TESTS FAILED - REVIEW NEEDED'.center(70)}{RESET}")
        print(f"{YELLOW}{'='*70}{RESET}\n")
        return False

if __name__ == "__main__":
    try:
        production_ready = test_all_features()
        sys.exit(0 if production_ready else 1)
    except Exception as e:
        print(f"{RED}❌ Test suite error: {e}{RESET}")
        sys.exit(1)

