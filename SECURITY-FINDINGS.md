# Security Audit Findings Report

**Application:** County Connect (Navarro County)
**Stack:** React 18 / JavaScript / Express / SQLite
**Audit Date:** January 12, 2026
**Auditor:** Claude Code Security Audit

---

## Executive Summary

This security audit identified **10 findings** across the application:
- **Critical:** 1
- **High:** 4
- **Medium:** 3
- **Low:** 2

Immediate attention is required for the Critical and High severity findings.

---

## Findings

---

### [FINDING-001] Stored XSS via dangerouslySetInnerHTML Without Sanitization

**Severity:** High
**CVSS:** 7.5
**Status:** FIXED

**Description:**
Multiple components render HTML content using `dangerouslySetInnerHTML` without passing the content through DOMPurify or the existing `ContentSanitizer` component. This allows stored XSS attacks if an attacker can inject malicious HTML into the database.

**Affected Components:**
- `src/pages/Store.jsx:322`
- `src/pages/StoreView.jsx:220`
- `src/pages/StoreDetail.jsx:286`

**Proof of Concept:**
```javascript
// Current vulnerable code in Store.jsx
<div dangerouslySetInnerHTML={{ __html: section.content.html }} />

// An attacker storing: <img src=x onerror=alert(document.cookie)>
// would execute JavaScript in other users' browsers
```

**Recommendation:**
Use the existing `ContentSanitizer` component or DOMPurify:
```javascript
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(section.content.html) }} />
```

**Remediation:**
- [x] Fix implemented - Added DOMPurify.sanitize() to Store.jsx, StoreView.jsx, StoreDetail.jsx
- [ ] Code reviewed
- [ ] Tests added
- [ ] Deployed to production

---

### [FINDING-002] SQL Injection via Dynamic Key Interpolation

**Severity:** High
**CVSS:** 7.2
**Status:** FIXED

**Description:**
The `EntityModel.filter()` and `EntityModel.list()` methods in Entity.js construct SQL queries by directly interpolating user-controlled keys into `json_extract()` function calls. While the values are parameterized, the column names/keys are not, allowing SQL injection.

**Affected Components:**
- `backend/src/models/Entity.js:32` (sort field)
- `backend/src/models/Entity.js:68` (filter keys)
- `backend/src/models/Entity.js:87` (sort field)
- `backend/src/models/Entity.js:179` (deleteMany keys)

**Proof of Concept:**
```javascript
// Vulnerable code
whereConditions.push(`json_extract(data, '$.${key}') = ?`);

// Attack payload in filter query:
// GET /api/entities/Product?q={"name'); DROP TABLE entities;--": "test"}
// Results in: json_extract(data, '$.name'); DROP TABLE entities;--') = ?
```

**Recommendation:**
Whitelist allowed field names:
```javascript
const ALLOWED_FIELDS = ['name', 'email', 'status', 'town', ...];
for (const [key, value] of Object.entries(query)) {
  if (!ALLOWED_FIELDS.includes(key)) {
    throw new Error(`Invalid filter field: ${key}`);
  }
  // ... proceed with query
}
```

**Remediation:**
- [x] Fix implemented - Added validateFieldName() function to Entity.js for all dynamic field interpolation
- [ ] Code reviewed
- [ ] Tests added
- [ ] Deployed to production

---

### [FINDING-003] Mass Assignment - User Role Escalation

**Severity:** High
**CVSS:** 8.1
**Status:** FIXED

**Description:**
The admin user update endpoint passes `req.body` directly to `UserModel.update()`, which accepts a `role` field. A malicious admin could potentially escalate privileges or an attacker exploiting another vulnerability could modify user roles.

Additionally, the regular user profile update endpoint extracts fields from req.body without strict whitelisting.

**Affected Components:**
- `backend/src/routes/auth.js:168` - Admin update spreads entire req.body
- `backend/src/models/User.js:57-59` - Role field is updatable

**Proof of Concept:**
```bash
# Admin updating a user can set any field
PUT /api/auth/users/123
{
  "role": "admin",
  "is_verified_vendor": true,
  "full_name": "Test"
}
```

**Recommendation:**
Explicitly whitelist allowed fields:
```javascript
// Only allow specific fields to be updated
const allowedFields = ['full_name', 'phone', 'bio'];
const safeData = {};
for (const field of allowedFields) {
  if (req.body[field] !== undefined) {
    safeData[field] = req.body[field];
  }
}
const updatedUser = UserModel.update(req.params.id, safeData);
```

**Remediation:**
- [x] Fix implemented - Added allowedFields whitelist to auth.js admin user update endpoint
- [ ] Code reviewed
- [ ] Tests added
- [ ] Deployed to production

---

### [FINDING-004] IDOR - Missing Ownership Verification on Entity Operations

**Severity:** High
**CVSS:** 7.5
**Status:** FIXED

**Description:**
The entity update and delete endpoints do not verify that the authenticated user owns the resource they're modifying. Any authenticated user can modify or delete any entity by knowing its ID.

**Affected Components:**
- `backend/src/routes/entities.js:125` - PUT endpoint
- `backend/src/routes/entities.js:145` - DELETE endpoint

**Proof of Concept:**
```bash
# User A can delete User B's product
DELETE /api/entities/Product/user-b-product-id
Authorization: Bearer <user-a-token>
```

**Recommendation:**
Add ownership verification:
```javascript
router.put('/:entityType/:id', authenticateToken, async (req, res) => {
  const entity = EntityModel.findById(entityType, id);

  if (!entity) {
    return res.status(404).json({ message: 'Entity not found' });
  }

  // Verify ownership (or admin role)
  if (entity.created_by !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized to modify this entity' });
  }

  // Proceed with update
});
```

**Remediation:**
- [x] Fix implemented - Added ownership verification to entities.js PUT and DELETE endpoints
- [ ] Code reviewed
- [ ] Tests added
- [ ] Deployed to production

---

### [FINDING-005] Weak Default JWT Secret

**Severity:** Critical (if deployed to production with default)
**CVSS:** 9.8
**Status:** FIXED

**Description:**
The JWT secret has a weak default value that would allow token forgery if deployed to production without configuration.

**Affected Components:**
- `backend/src/config/config.js:10`

**Proof of Concept:**
```javascript
// Current code
secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',

// An attacker knowing the default can forge any JWT:
const forgedToken = jwt.sign({ id: 'admin-id', role: 'admin' }, 'your-secret-key-change-in-production');
```

**Recommendation:**
1. Remove the default value and require JWT_SECRET to be set:
```javascript
secret: process.env.JWT_SECRET || (() => { throw new Error('JWT_SECRET must be set'); })(),
```

2. Add startup validation:
```javascript
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be set and at least 32 characters');
}
```

**Remediation:**
- [x] Fix implemented - Added production validation in config.js requiring JWT_SECRET with 32+ chars; random secret for dev
- [ ] Code reviewed
- [ ] Deployed to production

---

### [FINDING-006] No Pagination Limit Cap

**Severity:** Medium
**CVSS:** 5.3
**Status:** Open

**Description:**
The entity list endpoint accepts a `limit` parameter from user input without enforcing a maximum value. An attacker could request all records, causing memory exhaustion or slow responses.

**Affected Components:**
- `backend/src/routes/entities.js:53`
- `backend/src/models/Entity.js:38`

**Proof of Concept:**
```bash
# Request all records
GET /api/entities/Product?limit=1000000
```

**Recommendation:**
Enforce maximum limit:
```javascript
const MAX_LIMIT = 100;
const options = {
  limit: limit ? Math.min(parseInt(limit), MAX_LIMIT) : MAX_LIMIT,
  skip: skip ? parseInt(skip) : 0,
};
```

**Remediation:**
- [ ] Fix implemented
- [ ] Code reviewed
- [ ] Deployed to production

---

### [FINDING-007] No Array Size Limit in Bulk Operations

**Severity:** Medium
**CVSS:** 5.3
**Status:** Open

**Description:**
The bulk create endpoint accepts arrays of any size, which could be used for DoS attacks by sending extremely large arrays.

**Affected Components:**
- `backend/src/routes/entities.js:107`

**Proof of Concept:**
```bash
# Send 100,000 items
POST /api/entities/Product/bulk
Content-Type: application/json

[{"name": "item1"}, {"name": "item2"}, ... 100000 more items]
```

**Recommendation:**
```javascript
const MAX_BULK_SIZE = 100;
if (dataArray.length > MAX_BULK_SIZE) {
  return res.status(400).json({
    message: `Bulk operations limited to ${MAX_BULK_SIZE} items`
  });
}
```

**Remediation:**
- [ ] Fix implemented
- [ ] Code reviewed
- [ ] Deployed to production

---

### [FINDING-008] JSON Parse Without Error Handling in Query Parameter

**Severity:** Medium
**CVSS:** 4.3
**Status:** Open

**Description:**
The entity list endpoint parses a JSON query parameter without proper error handling, which could lead to unhandled exceptions.

**Affected Components:**
- `backend/src/routes/entities.js:60`

**Proof of Concept:**
```bash
# Invalid JSON causes server error
GET /api/entities/Product?q={invalid-json}
```

**Recommendation:**
```javascript
if (req.query.q) {
  try {
    const query = JSON.parse(req.query.q);
    const entities = EntityModel.filter(entityType, query, options);
    return res.json(entities);
  } catch (e) {
    return res.status(400).json({ message: 'Invalid query parameter format' });
  }
}
```

**Remediation:**
- [ ] Fix implemented
- [ ] Code reviewed
- [ ] Deployed to production

---

### [FINDING-009] Missing CORS Origin Validation

**Severity:** Low
**CVSS:** 3.1
**Status:** Open

**Description:**
CORS origin is configured via environment variable with credentials enabled. If misconfigured in production (e.g., set to `*`), it could allow cross-origin credential theft.

**Affected Components:**
- `backend/src/config/config.js:26`

**Current Implementation:**
```javascript
cors: {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
},
```

**Recommendation:**
Add validation for production:
```javascript
cors: {
  origin: (origin, callback) => {
    const allowedOrigins = [process.env.FRONTEND_URL];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
},
```

**Remediation:**
- [ ] Fix implemented
- [ ] Deployed to production

---

### [FINDING-010] Rate Limiting Bypassed in Development

**Severity:** Low
**CVSS:** 2.0
**Status:** Informational

**Description:**
Rate limiting is skipped for localhost in development mode. Ensure this doesn't apply in production.

**Affected Components:**
- `backend/src/server.js:34`

**Current Implementation:**
```javascript
skip: (req) => config.nodeEnv === 'development' && (req.ip === '::1' || req.ip === '127.0.0.1')
```

**Recommendation:**
This is acceptable for development, but verify `NODE_ENV` is set to `production` in deployed environments.

**Remediation:**
- [ ] Verified in production

---

## Positive Findings

The following security controls were found to be properly implemented:

1. **Helmet middleware** - Security headers are configured
2. **Rate limiting** - Global rate limiting is implemented (100 req/15min)
3. **CORS** - Configured with specific origin (not wildcard in default)
4. **Input body size limits** - JSON body limited to 10MB
5. **ContentSanitizer component** - Exists and uses DOMPurify with whitelist (but not used everywhere)
6. **Parameterized queries** - SQLite prepared statements used for values
7. **UUID for IDs** - Non-sequential IDs prevent enumeration
8. **JWT expiration** - 7-day token expiration configured
9. **Cookie consent** - GDPR-compliant cookie consent implemented
10. **No command injection** - No `child_process` usage in runtime code

---

## Remediation Priority

| Priority | Finding | Effort |
|----------|---------|--------|
| 1 | FINDING-005 (JWT Secret) | Low |
| 2 | FINDING-004 (IDOR) | Medium |
| 3 | FINDING-003 (Mass Assignment) | Medium |
| 4 | FINDING-001 (XSS) | Low |
| 5 | FINDING-002 (SQL Injection) | Medium |
| 6 | FINDING-006 (Pagination) | Low |
| 7 | FINDING-007 (Bulk Size) | Low |
| 8 | FINDING-008 (JSON Parse) | Low |
| 9 | FINDING-009 (CORS) | Low |
| 10 | FINDING-010 (Rate Limit) | N/A |

---

## Tracking Table

| ID | Title | Severity | Status | Fixed | Verified |
|----|-------|----------|--------|-------|----------|
| FINDING-001 | XSS via dangerouslySetInnerHTML | High | FIXED | [x] | [ ] |
| FINDING-002 | SQL Injection via Dynamic Keys | High | FIXED | [x] | [ ] |
| FINDING-003 | Mass Assignment - Role Escalation | High | FIXED | [x] | [ ] |
| FINDING-004 | IDOR - Missing Ownership Check | High | FIXED | [x] | [ ] |
| FINDING-005 | Weak Default JWT Secret | Critical | FIXED | [x] | [ ] |
| FINDING-006 | No Pagination Limit Cap | Medium | Open | [ ] | [ ] |
| FINDING-007 | No Bulk Array Size Limit | Medium | Open | [ ] | [ ] |
| FINDING-008 | JSON Parse Error Handling | Medium | Open | [ ] | [ ] |
| FINDING-009 | CORS Origin Validation | Low | Open | [ ] | [ ] |
| FINDING-010 | Dev Rate Limit Bypass | Low | Info | N/A | [ ] |

---

## Next Steps

1. **Immediate (Within 24 hours):**
   - Fix FINDING-005 (JWT Secret) before any production deployment

2. **Short-term (Within 1 week):**
   - Fix FINDING-001, 003, 004 (XSS, Mass Assignment, IDOR)

3. **Medium-term (Within 1 month):**
   - Fix remaining findings
   - Add automated security testing to CI/CD pipeline
   - Consider implementing CSP headers
   - Add input validation schemas (Zod) for all API endpoints
