#!/bin/bash

# Smoke Test Suite for Aelvynor Application
# Run this script to verify all critical endpoints are working

set -e  # Exit on error

BASE_URL="http://localhost:8000"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🧪 Starting Smoke Tests for Aelvynor Application..."
echo ""

# Test 1: Health Check
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test 1: Health Check"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/health" || echo "000")
if [ "$RESPONSE" == "200" ]; then
  echo -e "${GREEN}✅ Health check passed (200 OK)${NC}"
else
  echo -e "${RED}❌ Health check failed: HTTP $RESPONSE${NC}"
  echo "   Make sure backend is running: cd backend && make dev"
  exit 1
fi
echo ""

# Test 2: GET /api/public/projects
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test 2: GET /api/public/projects"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/public/projects?active_only=true")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')
if [ "$HTTP_CODE" == "200" ]; then
  echo -e "${GREEN}✅ GET /api/public/projects passed (200 OK)${NC}"
  PROJECT_COUNT=$(echo "$BODY" | jq '. | length' 2>/dev/null || echo "?")
  echo "   Found $PROJECT_COUNT project(s)"
  if [ -n "$BODY" ] && [ "$BODY" != "[]" ]; then
    echo "   Sample response: $(echo "$BODY" | jq '.[0] | {id, title, is_active}' 2>/dev/null || echo "$BODY" | head -c 100)"
  fi
else
  echo -e "${RED}❌ GET /api/public/projects failed: HTTP $HTTP_CODE${NC}"
  echo "   Response: $BODY"
  exit 1
fi
echo ""

# Test 3: POST /api/public/apply
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test 3: POST /api/public/apply (File Upload)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
# Create minimal test PDF
cat > /tmp/test_resume.pdf << 'EOF'
%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>>>endobj
xref
0 4
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
trailer<</Size 4/Root 1 0 R>>
startxref
178
%%EOF
EOF

RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/public/apply" \
  -F "name=Test User" \
  -F "email=test@example.com" \
  -F "phone=+1234567890" \
  -F "message=This is a test application from smoke tests" \
  -F "applied_for=internship" \
  -F "resume=@/tmp/test_resume.pdf")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')
if [ "$HTTP_CODE" == "200" ] || [ "$HTTP_CODE" == "201" ]; then
  echo -e "${GREEN}✅ POST /api/public/apply passed (HTTP $HTTP_CODE)${NC}"
  APP_ID=$(echo "$BODY" | jq -r '.id // empty' 2>/dev/null || echo "")
  APP_STATUS=$(echo "$BODY" | jq -r '.status // empty' 2>/dev/null || echo "")
  if [ -n "$APP_ID" ]; then
    echo "   Application ID: $APP_ID"
    echo "   Status: $APP_STATUS"
  else
    echo "   Response: $BODY"
  fi
else
  echo -e "${RED}❌ POST /api/public/apply failed: HTTP $HTTP_CODE${NC}"
  echo "   Response: $BODY"
  exit 1
fi
echo ""

# Test 4: Admin Login
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test 4: Admin Login"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${YELLOW}⚠️  Using default credentials (admin/admin123)${NC}"
echo "   To use custom credentials, set ADMIN_USER and ADMIN_PASS environment variables"
ADMIN_USER="${ADMIN_USER:-admin}"
ADMIN_PASS="${ADMIN_PASS:-admin123}"

RESPONSE=$(curl -s -X POST "$BASE_URL/api/admin/login" \
  -H "Content-Type: application/json" \
  -d "{\"username\": \"$ADMIN_USER\", \"password\": \"$ADMIN_PASS\"}")
TOKEN=$(echo "$RESPONSE" | jq -r '.access_token // empty' 2>/dev/null || echo "")
if [ -n "$TOKEN" ] && [ "$TOKEN" != "null" ] && [ "$TOKEN" != "" ]; then
  echo -e "${GREEN}✅ Admin login passed${NC}"
  TOKEN_PREVIEW="${TOKEN:0:50}..."
  echo "   Token: $TOKEN_PREVIEW"
  # Save token for next test
  export TOKEN
else
  echo -e "${RED}❌ Admin login failed${NC}"
  echo "   Response: $RESPONSE"
  echo "   Make sure admin user exists: cd backend && python scripts/create_admin.py --username admin --password admin123"
  exit 1
fi
echo ""

# Test 5: Protected Endpoint - List Applications
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test 5: GET /api/admin/applications (Protected)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/api/admin/applications" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')
if [ "$HTTP_CODE" == "200" ]; then
  echo -e "${GREEN}✅ GET /api/admin/applications passed (200 OK)${NC}"
  APP_COUNT=$(echo "$BODY" | jq '. | length' 2>/dev/null || echo "?")
  echo "   Found $APP_COUNT application(s)"
  if [ -n "$BODY" ] && [ "$BODY" != "[]" ]; then
    FIRST_APP=$(echo "$BODY" | jq '.[0] | {id, full_name, email, status}' 2>/dev/null || echo "")
    if [ -n "$FIRST_APP" ]; then
      echo "   Sample: $FIRST_APP"
    fi
  fi
else
  echo -e "${RED}❌ GET /api/admin/applications failed: HTTP $HTTP_CODE${NC}"
  echo "   Response: $BODY"
  exit 1
fi
echo ""

# Test 6: Protected Endpoint - List Projects (Admin)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test 6: GET /api/admin/projects (Protected)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/api/admin/projects" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')
if [ "$HTTP_CODE" == "200" ]; then
  echo -e "${GREEN}✅ GET /api/admin/projects passed (200 OK)${NC}"
  PROJECT_COUNT=$(echo "$BODY" | jq '. | length' 2>/dev/null || echo "?")
  echo "   Found $PROJECT_COUNT project(s)"
else
  echo -e "${RED}❌ GET /api/admin/projects failed: HTTP $HTTP_CODE${NC}"
  echo "   Response: $BODY"
  exit 1
fi
echo ""

# Cleanup
rm -f /tmp/test_resume.pdf

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}🎉 All smoke tests passed!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Health check"
echo "✅ Public projects endpoint"
echo "✅ Application submission with file upload"
echo "✅ Admin authentication"
echo "✅ Protected endpoints"
echo ""
echo "Next steps:"
echo "  - Test frontend at http://localhost:3000"
echo "  - View API docs at http://localhost:8000/docs"
echo ""

