
# Introduction to database security

## Overview

Databases are at the core of most applications, storing vast amounts of valuable and often sensitive information. As these databases become prime targets for malicious actors, securing them is more crucial than ever. This course will provide a comprehensive understanding of how to secure databases, from managing user access and data encryption to ensuring high availability and defending against common threats.

---

## Educational goal

- Understand the importance of **database security** in the context of cybersecurity
- Get familiar with key **database concepts** and terminology
- Learn how to protect **data at rest and in transit** using encryption techniques
- Grasp the difference between **authentication** and **authorization** and their roles in database security
- Understand how to create **resilient architectures** that ensure the availability and recovery of databases
- Explore best practices for managing **user permissions** and enforcing **least privilege**
- Understand **governance** and compliance considerations in database security
- Identify the most common **database threats** and the strategies to mitigate them

---

### Core concepts

In this course, we’ll go through the following concepts, which will each be explored in depth throughout the modules:

1. **Database concepts**:
   - What databases are and why they require special attention to security
   - Types of databases (relational vs NoSQL) and their unique security needs

2. **User management & access control**:
   - Managing users and groups in a Linux environment
   - Setting up effective authentication and authorization models
   - Using role-based access control (RBAC) and policies to manage permissions

3. **Data protection**:
   - Securing data both **at rest** (on storage) and **in transit** (over networks)  
   - Encryption techniques, including **symmetric** and **asymmetric** encryption  
   - Implementing **TLS** for secure communication channels

4. **High availability and disaster recovery**:
   - Understanding resilient architectures and why they are criticals
   - Exploring strategies like replication and clustering to ensure database availability  
   - Setting up backup and disaster recovery plans

5. **Governance & compliance**:
   - Establishing processes to comply with laws and regulations (e.g., GDPR, HIPAA)  
   - Implementing governance principles like data sovereignty and data lineage  
   - Ensuring transparency and auditability of database activities

6. **Database threats and attacks**:
   - Common attack vectors such as **SQL injection**, **NoSQL injection**, and **query saturation**
   - Understanding how malicious actors exploit vulnerabilities in databases and how to defend against them
   - Protecting databases from GraphQL/REST proxy attacks and ensuring secure configurations

---

### Why database security is critical

Databases store some of the most sensitive information in an organization: 
- financial data
- personal details
- business secrets
- much more 

A compromise can lead to:
- financial losses
- reputational damage
- legal consequences

Therefore, securing databases is not just about keeping unauthorized users out but also about ensuring the integrity, availability, and confidentiality of the data stored within them.

---

### Structure of the course

1. **Module 1: user & group management in Linux** – How to manage access and permissions in a Linux environment
2. **Module 2: process isolation & resource control in Linux** – Best practices for isolating processes and securing system resources
3. **Module 3: authentication** – The role of authentication in securing databases, and various methods like OAuth
4. **Module 4: authorization** – Understanding how to grant or restrict access to database resources
5. **Module 5: securing data in transit** – Ensuring secure data transfer over networks using encryption  
6. **Module 6: securing data at rest** – Protecting stored data through encryption and secure key management  
7. **Module 7: resilient architecture** – Building databases that are highly available and resilient in case of failure  
8. **Module 8: governance** – Managing and monitoring databases to ensure compliance with governance and regulatory standards  
9. **Module 9: database threats** – Identifying common database vulnerabilities and the best ways to mitigate them

---

## Prerequisites

It's crucial that you have a working linux machine at disposal. On this machine needs to be installed the following:

- Docker
- Docker compose

It's also good to have:
- some basic linux command line understanding
- a comprehension of databases