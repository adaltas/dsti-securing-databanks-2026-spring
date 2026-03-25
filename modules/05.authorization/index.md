---
duration: 1h
---

# Authorization

Authorization is the process of granting or denying access to resources based on user identity and permissions. It defines what actions authenticated users can perform.

## Introduction

- Authorization ensures users have the right permissions after authentication.
- It follows authentication in access control.
- Different models exist: role-based, attribute-based, discretionary, mandatory.
- Similar to Linux file permissions that define read, write, and execute rights.

Example: After logging in, a user can access their files but not system files.

Authorization answers the question:
- “What are you allowed to do?”

## Concept of authorization models

- Authorization determines user access levels after authentication.
- Compare authorization models in operating systems, databases, and web applications.

### Operating system authorization

- Defines file and system permissions.
- Linux:
  ```bash
  ls -l file.txt
  ```
  Shows permissions: `rw-r--r--` (owner, group, others).
- Windows uses ACLs (Access Control Lists).

### Database authorization

- Controls who can read, write, or modify database tables.
- Uses SQL permissions:
  ```sql
  GRANT SELECT, INSERT ON users TO user1;
  ```
- Supports role-based access (RBAC) and attribute-based access (ABAC).

### Web application authorization

- Determines user actions within an application.
- Examples:
  - Admin vs. regular user access.
  - API rate limiting for different user tiers.
  - OAuth scopes restricting API access.

## Types of authorization

### Role-Based Access Control (RBAC)

- Assigns permissions based on user roles.
- Example:
  - **Admin**: Manage users, modify settings.
  - **Editor**: Modify content.
  - **Viewer**: Read-only access.
- Simplifies permission management.

### Attribute-Based Access Control (ABAC)

- Grants access based on attributes (user, resource, environment).
- Example:
  - A doctor can view patient records **only** if they are assigned to the case.
  - A user can download files **only** from their department.

### Discretionary Access Control (DAC)

- Owners set permissions for their resources.
- Example:
  - In Linux, a user can change file permissions with:
    ```bash
    chmod 644 file.txt
    ```
- Flexible but riskier if owners set weak permissions.

### Mandatory Access Control (MAC)

- System-enforced security policies.
- Common in military and government systems.
- Example:
  - Classified files require specific clearance levels.

### OAuth and API Authorization

- OAuth 2.0 grants limited access to third-party apps.
- Example:
  - A fitness app requests access to your Google Fit data:
    ```json
    "scope": "https://www.googleapis.com/auth/fitness.activity.read"
    ```
- Uses access tokens to enforce permissions.

## Authorization management

### Authorization in PostgreSQL

```sql
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

create policy "Individuals can view their own tasks."
on tasks for select
using ( (select auth.uid()) = owner_id );
```

### Authorization in MongoDB

```json
privileges: [
  { resource: { db: "products", collection: "inventory" }, actions: [ "find", "update", "insert" ] },
  { resource: { db: "products", collection: "orders" },  actions: [ "find" ] }
]
```

### Permission assignment

- Assign permissions based on roles or attributes.
- Follow the principle of least privilege (PoLP).
- Regularly review and update permissions.

### Access control lists (ACLs)

- Define specific user and group permissions.
- Example (Linux ACLs):
  ```bash
  setfacl -m u:user1:r file.txt
  ```
- Example (Web API ACL):
  ```json
  {
    "user": "user1",
    "permissions": ["read", "write"]
  }
  ```

### Policy enforcement

- Use policy-based access control (PBAC) for dynamic rules.
- Example:
  - A firewall rule allowing access **only** during work hours.

### Logging and monitoring

- Track authorization events for security audits.
- Monitor access logs for suspicious behavior.
- Example:
  ```bash
  grep "DENIED" /var/log/auth.log
  ```

## Authorization threats and mitigation

### Privilege escalation

- Attackers gain higher permissions than allowed.
- Mitigation:
  - Implement PoLP.
  - Restrict root/admin access.
  - Regularly audit user roles.

### Insecure direct object references (IDOR)

- Attackers access unauthorized resources by modifying URLs.
- Example:
  - Changing `/user/123` to `/user/124` to access another user’s data.
- Mitigation:
  - Enforce server-side access checks.
  - Use unique, unpredictable resource identifiers.

### Broken access control

- Weak authorization allows unauthorized actions.
- Mitigation:
  - Implement strong access controls.
  - Use centralized authorization mechanisms.
  - Test authorization logic regularly.

### Token abuse

- Attackers reuse or steal access tokens.
- Mitigation:
  - Set token expiration times.
  - Use refresh tokens securely.
  - Implement token revocation.

## Secure authorization best practices

- Apply **least privilege**: Users get only the permissions they need.
- Use **role-based or attribute-based access control** for scalable management.
- Implement **access reviews** to remove unnecessary permissions.
- Log and monitor **authorization failures** to detect attacks.
- Secure **OAuth scopes and API permissions** to prevent token misuse.

Authorization ensures that users can only access what they are permitted to, reducing security risks and enforcing access control policies effectively.