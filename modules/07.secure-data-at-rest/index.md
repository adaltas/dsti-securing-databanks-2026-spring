---
duration: 1h
---

# Securing data at rest

Encryption is a fundamental security mechanism that protects stored data from unauthorized access. It ensures confidentiality and integrity, but its implementation depends on the use case. This course covers storage encryption, key management, and best practices for securing data at rest.

## Introduction

- **Data at rest** refers to stored data, including databases, files, and backups.
- Protecting data at rest prevents unauthorized access, even if storage devices are compromised.
- Encryption is the primary method for securing stored data, alongside access controls and auditing.

Example: A company's database containing customer information should be encrypted to prevent data breaches if the server is compromised.

Data security answers the question:

- “How do we protect stored data from unauthorized access and breaches?”

## Encryption for data at rest

Encryption ensures that stored data remains confidential, even if attackers gain access to the storage medium.

### Full disk encryption (FDE)

- Encrypts the entire storage device.
- Requires authentication (password, TPM, etc.) to access data.
- Example tools:
  - **BitLocker (Windows)**
  - **LUKS (Linux Unified Key Setup)**
  - **FileVault (macOS)**

Example of encrypting a Linux drive using LUKS:

```bash
sudo cryptsetup luksFormat /dev/sdX
```

**Pros:**
✔ Transparent encryption for users and applications  
✔ Protects against stolen or lost devices

**Cons:**
✖ Does not protect data if the system is already unlocked  
✖ Performance impact on I/O-intensive workloads

### File-level encryption

- Encrypts individual files rather than the entire disk.
- More granular control over encryption policies.
- Example tools:
  - **EFS (Encrypting File System) on Windows**
  - **GnuPG (GPG) for manual file encryption**

Example command to encrypt a file using GPG:

```bash
gpg --symmetric --cipher-algo AES256 secret.txt
```

**Pros:**
✔ Allows selective encryption of sensitive files  
✔ Suitable for cloud storage and file-sharing scenarios

**Cons:**
✖ More complex key management compared to FDE  
✖ Users may forget to encrypt new files manually

### Database encryption

- Encrypts structured data stored in databases.
- Two common approaches:
  - **Transparent Database Encryption (TDE)**: Encrypts data automatically at the storage level.
  - **Column-level encryption**: Encrypts specific fields (e.g., passwords, credit card numbers).

Example: Enabling TDE on MySQL:

```sql
ALTER TABLE customers MODIFY COLUMN ssn VARBINARY(255) ENCRYPTED;
```

**Pros:**

✔ Protects sensitive fields without encrypting the entire database  
✔ TDE ensures encryption with minimal application changes

**Cons:**

✖ Requires secure key storage and management  
✖ Some database operations may be slower

## Key management

Encryption is only as strong as key security. Poor key management can render encryption useless.

### Best practices for secure key management

1. **Use a dedicated key management system (KMS)**
   - AWS KMS, Azure Key Vault, HashiCorp Vault, etc.
2. **Rotate keys regularly**
   - Implement key rotation policies to limit damage from key exposure.

3. **Store keys separately from encrypted data**
   - Never store encryption keys on the same machine as encrypted files.

4. **Use hardware security modules (HSMs) for high-security environments**
   - HSMs provide tamper-resistant key storage.

Example: Generating a secure encryption key using OpenSSL:

```bash
openssl rand -base64 32 > encryption_key.txt
```

## Access controls and auditing

Encryption alone is not enough. Strict access controls and logging are necessary.

### Access control measures

- **Use the principle of least privilege (PoLP)**
  - Restrict access to encrypted data to only those who need it.
- **Implement multi-factor authentication (MFA)**
  - Adds an extra layer of security to access encrypted data.
- **Monitor and log access to sensitive data**
  - Use SIEM tools to detect unauthorized access attempts.

Example: Restricting file access in Linux:

```bash
chmod 600 encrypted_file.txt
```

## Backup security

Backups contain the same sensitive data as the primary system and must be secured.

### Securing backups

1. **Encrypt backups before storage**
   - Example:
   ```bash
   tar -czf - backup_data | openssl enc -aes-256-cbc -out backup.tar.gz.enc
   ```
2. **Use secure storage locations**
   - Store backups in encrypted cloud storage or offline locations.
3. **Restrict access to backup files**
   - Only authorized personnel should have access.
4. **Regularly test backup integrity and restoration**
   - Ensures that encrypted backups can be recovered when needed.

## When is encryption necessary?

Encryption is crucial, but it may not always be required. The decision depends on risk, compliance, and performance considerations.

### When encryption is critical

- **Regulated data (GDPR, HIPAA, PCI-DSS compliance)**
- **Sensitive customer information (financial, health, personal data)**
- **Stored credentials and API keys**
- **Cloud storage and external backups**

### When encryption may Not be needed

- **Publicly available data** (e.g., website content, open-source repositories)
- **Low-sensitivity internal logs**
- **Data already protected by strong access controls**

## Pros and cons of encrypting data at rest

**Pros**

✔ Protects against physical theft
✔ Helps meet regulatory requirements |
✔ Prevents unauthorized access to backups |

**Cons**

✖ Performance impact on storage
✖ Increased complexity in key management
✖ Risk of data loss if keys are lost

## Conclusion

- **Full-disk encryption** protects entire storage devices.
- **File-level and database encryption** allow more granular protection.
- **Secure key management** is critical to encryption effectiveness.
- **Access controls and backup security** are essential complementary measures.
- **Not all data requires encryption** comes with a penalty cost, apply it where risk justifies the overhead.

Understanding how to secure data at rest ensures confidentiality and compliance, reducing risks in case of a security breach.
