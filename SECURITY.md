# NodeDrops.xyz — Security Policy & Threat Model

## 1. Threat Model

NodeDrops.xyz is an educational, discovery, and tooling platform for blockchain node operators.
Because it serves operators configuring high-value validator nodes and RPC relays, security is the foremost architecture requirement:

1. **No Wallet Connection Required:** The platform does not require Web3 wallet connections or private key inputs to browse guides, calculate hardware specs, or build commands.
2. **No Server-Side Shell Execution:** The Node Command Builder is strictly a text-templating tool. It **never** executes shell commands or user scripts on the server.
3. **Defense Against Shell Injection:** User-provided monikers and options are validated with Zod, sanitized with strict alphanumeric whitelists, and escaped before rendering into template blocks.
4. **Credential Isolation:** Passwords are never stored in plaintext. They are salted and hashed using bcrypt with 12 rounds.
5. **Session Token Hashing:** Reusable session secrets are not stored in plaintext in the database. Instead, SHA-256 cryptographic hashes are stored, preventing credential replay in the event of read-only database compromise.
6. **Sliding Window Rate Limiting:** All authentication, contact, and feedback endpoints are protected by rate limiters to prevent brute-force credential stuffing and denial of service.
7. **Audit Logging:** Security-sensitive operations (login failures, privilege alterations, content publication) are permanently recorded with actor IDs, action names, and IP metadata.

---

## 2. Admin Account Recovery & Bootstrap Procedure

Public admin registration is **permanently disabled**. To create or recover an administrator account:

1. SSH into the production server or run locally with database access.
2. Execute the interactive secure setup command:
   ```bash
   npm run admin:create
   ```
3. Enter the administrator's email, display name, and a unique password (minimum 10 characters).
4. The script securely hashes the credentials, updates the database, records an `ADMIN_BOOTSTRAP_CREATED` audit log, and outputs confirmation.
5. Log in at `/login`.

---

## 3. Secret Rotation Instructions

### Database Credentials (TiDB Cloud)
1. Log in to TiDB Cloud Console -> Clusters -> Security Settings.
2. Generate a new database user password with least-privilege permissions.
3. Update the `DATABASE_URL` environment variable in Vercel project settings.
4. Trigger a zero-downtime redeployment.
5. Invalidate the old database password in TiDB Cloud Console.

### Session Secret Rotation
1. Generate a new 64-character random string:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
2. Update `SESSION_SECRET` in Vercel environment variables.
3. Redeploy. All existing operator sessions will be gracefully invalidated, requiring re-authentication.

---

## 4. Reporting Vulnerabilities

If you discover a security vulnerability, please do NOT file a public issue on GitHub.
Contact our security guild immediately at: **security@nodedrops.xyz**.
We will acknowledge receipt within 24 hours and coordinate a coordinated disclosure timeline.
