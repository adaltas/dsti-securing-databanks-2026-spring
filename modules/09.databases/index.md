---
duration: 1h
---

# Database security and threats

Securing databases is a critical aspect of cybersecurity, as databases often contain sensitive and valuable information. Here’s an overview of essential database security practices to help protect against unauthorized access, breaches, and other threats.

## Short definition

- **[britannica]**(https://www.britannica.com/technology/database)
  Database, any collection of data, or information, that is specially organized for rapid search and retrieval by a computer.
- **[Wikipedia definition (english)]**(https://en.wikipedia.org/wiki/Database)
  In computing, a database is an organized collection of data or a type of data store based on the use of a database management system (DBMS).
- **[Wikipedia definition (french)]**(https://fr.wikipedia.org/wiki/Base_de_donn%C3%A9es)
  A database allows you to store and retrieve structured, semi-structured or raw data or information, often related to a theme or activity; these can be of different natures and more or less interconnected.

## Common database threats

### SQL injection (SQLi)
SQL injection occurs when an attacker manipulates SQL queries through unvalidated user inputs to access or modify unauthorized data.

**Mitigation Strategies:**
- Use **parameterized queries** and **prepared statements**.
- Implement **input validation** and **sanitization**.
- Employ **database firewalls** to monitor and block suspicious SQL activity.

### NoSQL injection
Similar to SQL injection but targeting NoSQL databases like MongoDB, Firebase, or CouchDB by injecting malicious queries.

**Mitigation strategies:**
- Use **ORMs (Object-Relational Mappers)** to prevent direct query manipulation.
- Validate and sanitize inputs before processing.
- Restrict query privileges for applications.

### Query saturation and denial of service (DoS)
Attackers can exploit expensive queries to overwhelm the database and exhaust resources.

**Mitigation strategies:**
- Optimize queries using **INDEXING** and **LIMIT/OFFSET** constraints.
- Implement query **timeouts** and **memory limits**.
- Monitor query execution times and set thresholds for alerting.

### GraphQL/REST proxy attacks
GraphQL endpoints can be misused to expose excessive amounts of data, leading to data leakage or denial of service.

**Mitigation strategies:**
- Restrict field selection and query depth.
- Implement **query cost analysis**.
- Apply **rate limiting** to API endpoints.

## Database access controls

- **Least privilege principle**: Grant only the minimum necessary permissions to users and applications.
- **Role-Based access control (RBAC)**: Manage permissions based on user roles rather than individual accounts.
- **Strong authentication and authorization**: Implement MFA (Multi-Factor Authentication) and enforce strict access policies.

## Encryption

Encrypt sensitive data at rest and in transit. Use industry-standard encryption algorithms and manage encryption keys securely.

- **Data Encryption At Rest**  
  Encrypt database files, backups, and other stored data to protect it from unauthorized access if physical security is compromised.

- **Data Encryption In Transit**  
  Use TLS/SSL to encrypt data transmitted between the database and clients to prevent interception and eavesdropping.

- **Column-Level Encryption**  
  For particularly sensitive data, consider column-level encryption to encrypt individual data fields within the database.

## Regular Patching and Updates

- **Patch Management**  
  Keep the database management system (DBMS) and any related software up-to-date with the latest security patches and updates to protect against known vulnerabilities.

- **Automated Updates**  
  Where possible, configure automated updates for critical security patches, ensure that updates are tested in a staging environment before applying them to production systems.

## Database Backup and Recovery

- **Regular Backups**  
  Perform regular backups of your database to ensure data can be recovered in case of corruption, loss, or breach. Store backups securely, preferably encrypted.

- **Backup Testing**  
  Regularly test backup and recovery procedures to ensure that data can be restored successfully and quickly when needed.

- **Disaster Recovery Plan**  
  Have a comprehensive disaster recovery plan that includes database recovery procedures and ensures continuity of operations.

## Database Monitoring and Logging

- **Activity Monitoring**  
  Implement database activity monitoring to detect and alert on suspicious or unauthorized activities, such as unusual access patterns or failed login attempts.

- **Logging**  
  Enable detailed logging of database access and changes. Ensure logs are securely stored, regularly reviewed, and analyzed for signs of potential security incidents.

- **Audit Trails**  
  Maintain audit trails to track changes to database configurations, permissions, and data. This helps in forensic investigations and compliance with regulatory requirements.

## Secure Configuration

- **Default Settings**  
  Change default configurations, usernames, and passwords. Default settings are often well-known to attackers and can be exploited.

- **Service Accounts**  
  Use separate, minimal-privilege service accounts for database applications and services to limit potential damage if credentials are compromised.

- **Network Security**  
  Place databases behind firewalls and use network segmentation to restrict access. Ensure that only authorized hosts and users can connect to the database.

## SQL Injection Prevention

- **Parameterization**  
  Use parameterized queries or prepared statements to prevent SQL injection attacks by ensuring that user input is handled safely.

- **Input Validation**  
  Implement rigorous input validation and sanitization to prevent malicious input from affecting the database.

- **Database Firewall**  
  Consider using a database firewall to block or alert on suspicious SQL queries and database activity.

## Resource outage

Exposing expensive queries may causes Denial of Service (DoS) vulnerabilities.

- Complex queries can consume excessive CPU time.
- Large result sets can exhaust memory.
- Multiple concurrent expensive queries can overwhelm the database server.
- Heavy disk I/O operations can slow down the entire system.

Special care must be take for some technlogies.

- Rest APIs like PostgreSQL
- GraphQL

Mitigation Strategies.

- Query Optimization
  - Use LIMIT and OFFSET
  - Index important columns
  - Selective column fetching
- Controls implementation
  - Maximum query timeout
  - Maximum rows ouptut
  - Memory limit
  - Query Planning Controls and cost control

## Secure Database Design

- **Data Classification**  
  Classify data according to its sensitivity and apply appropriate security measures based on classification.

- **Database Schema**  
  Design the database schema with security in mind, including careful design of relationships, constraints, and indexes to minimize risk.

## Compliance and Regulations

- **Regulatory Compliance**  
  Ensure that database security practices comply with relevant regulations and standards (e.g., GDPR, HIPAA, PCI-DSS). Regularly review and update practices to maintain compliance.

- **Data Protection**  
  Implement data protection measures according to legal and regulatory requirements, including rights to access, correct, or delete personal data.

## Training and awareness

- **Training**  
  Provide regular security training for database administrators, developers, and other relevant personnel on best practices and emerging threats.

- **Awareness**  
  Foster a culture of security awareness within your organization to ensure everyone understands the importance of database security and their role in maintaining it.

## Incident response and forensics

- **Incident Response Plan**  
  Develop and maintain an incident response plan specific to database security incidents. Ensure it includes procedures for containing, mitigating, and recovering from breaches.

- **Forensics**  
  In the event of a breach, conduct forensic analysis to understand the nature and extent of the compromise. Use findings to improve security measures and prevent future incidents.

Implementing these database security practices helps protect against a wide range of threats and vulnerabilities, ensuring the confidentiality, integrity, and availability of your data. Regularly review and update security measures to address evolving risks and maintain robust protection.
