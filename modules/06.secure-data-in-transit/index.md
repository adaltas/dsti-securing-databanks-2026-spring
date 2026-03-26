---
duration: 1h
---

# Securing data in transit

Encryption is a fundamental security mechanism that protects data from unauthorized access. It ensures confidentiality and integrity, but its application depends on the use case. This course covers symmetric and asymmetric encryption, their role in TLS and HTTP, and when encryption is necessary.

## Introduction

- Encryption transforms readable data into an unreadable format using cryptographic algorithms.
- Two main types exist: **symmetric** (single key) and **asymmetric** (public-private key pair).
- Used in secure communications, data protection, and authentication.

Example: When accessing a banking website, HTTPS (TLS) ensures encrypted communication between the client and the server.

Encryption answers the question:

- “How do we protect data from unauthorized access?”

---

## Symmetric vs asymmetric encryption

Encryption methods differ in terms of speed, security, and use cases.

### Symmetric encryption

- Uses a **single key** for both encryption and decryption.
- Faster and more efficient but requires secure key distribution.
- Example algorithms:
  - **AES (Advanced Encryption Standard)** – Used in Wi-Fi security (WPA2), disk encryption.
  - **ChaCha20** – Used in modern secure communication protocols.

Example command to encrypt a file using AES:

```bash
openssl enc -aes-256-cbc -salt -in file.txt -out file.enc -pass pass:mysecret
```

**Pros:**
✔ Fast and efficient  
✔ Suitable for encrypting large volumes of data

**Cons:**
✖ Key distribution is challenging  
✖ If the key is leaked, all encrypted data is compromised

---

### Asymmetric encryption

- Uses a **public key** for encryption and a **private key** for decryption.
- Solves the key distribution problem but is computationally expensive.
- Example algorithms:
  - **RSA** – Used in SSL/TLS certificates, digital signatures.
  - **ECC (Elliptic Curve Cryptography)** – A more efficient alternative to RSA.

Example of generating an RSA key pair:

```bash
openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:2048
openssl rsa -pubout -in private_key.pem -out public_key.pem
```

**Pros:**
✔ Secure for key exchange  
✔ Enables digital signatures

**Cons:**
✖ Slower than symmetric encryption  
✖ Not suitable for encrypting large amounts of data

**Hybrid approach:**

- TLS and other secure communication protocols use **asymmetric encryption** for key exchange, then switch to **symmetric encryption** for data transfer.

---

## TLS and HTTP

**Transport Layer Security (TLS)** is a cryptographic protocol that secures HTTP (web traffic), email, and other communications.

### What is TLS?

- Successor to SSL, used in HTTPS.
- Encrypts data in transit, preventing eavesdropping and man-in-the-middle attacks.
- Uses asymmetric encryption for key exchange and symmetric encryption for data transmission.

### How TLS works in HTTPS

1. **Client Hello** – The browser sends a request to the server with supported encryption algorithms.
2. **Server Hello** – The server responds with its chosen encryption algorithm and SSL certificate.
3. **Key Exchange** – Asymmetric encryption secures a shared symmetric key.
4. **Secure Communication** – The session encrypts data with symmetric encryption.

Example of checking a website’s TLS certificate:

```bash
openssl s_client -connect example.com:443
```

### Why use HTTPS?

- Prevents data interception (e.g., passwords, credit card details).
- Ensures website authenticity (verified certificates).
- Protects against session hijacking and MITM attacks.

---

## Should we always encrypt data?

Encryption is crucial for security, but it isn’t always necessary. A balance between security, performance, and usability is essential.

### When encryption is critical

**Sensitive data at rest**

- Encrypt databases, stored files, and backups.
- Example:
  ```bash
  gpg --symmetric --cipher-algo AES256 secret.txt
  ```

**Sensitive data in transit**

- Always use **HTTPS, SSH, VPNs** to secure communication.
- Example of forcing HTTPS in a web server:
  ```nginx
  server {
      listen 80;
      return 301 https://$host$request_uri;
  }
  ```

**Authentication & identity verification**

- Passwords should never be stored in plain text; always **hash & salt**.
- Example:
  ```python
  import bcrypt
  hashed = bcrypt.hashpw(b"password", bcrypt.gensalt())
  ```

**Regulatory compliance**

- GDPR, HIPAA, and PCI-DSS require encryption for personal and financial data.

---

### When encryption is overkill

**Public information**

- Websites serving public blogs or open-source documentation don’t need encryption.

**Low-sensitivity internal data**

- Encrypting non-critical logs or performance metrics can add unnecessary overhead.

**Performance-critical applications**

- Full-disk encryption on real-time databases may slow down queries significantly.

---

## Pros and cons of encrypting everything

| **Pros**                               | **Cons**                                      |
| -------------------------------------- | --------------------------------------------- |
| ✔ Protects against data breaches      | ✖ Performance overhead                       |
| ✔ Ensures compliance with regulations | ✖ Complex key management                     |
| ✔ Increases trust in digital services | ✖ Potential recovery issues if keys are lost |

---

## Conclusion

- **Symmetric encryption** is fast but requires secure key sharing.
- **Asymmetric encryption** solves key exchange issues but is slower.
- **TLS** ensures secure web communication, making HTTPS essential.
- **Not all data needs encryption**—apply it where security risks justify the overhead.

Understanding encryption helps balance security and performance, ensuring data protection without unnecessary complexity.
