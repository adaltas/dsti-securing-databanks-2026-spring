---
duration: 1h
---

# Resilient architecture

High availability (HA) and disaster recovery (DR) strategies ensure that applications remain operational during failures.

Understanding stateful vs. stateless architectures, clustering, and replication strategies is crucial for building resilient systems.

This course covers HA principles, PostgreSQL replication, and practical lab exercises on setting up PostgreSQL HA.

## Introduction

- **Resilient architecture** aims to maintain system availability despite failures.
- **High availability (HA)** minimizes downtime by eliminating single points of failure.
- **Disaster recovery (DR)** ensures data and service continuity in case of catastrophic failures.
- **Backups** are critical for recovering lost data and ensuring business continuity.

Example: A cloud-based application serving millions of users must remain available even if a data center experiences an outage.

Resilient architecture answers the question:

- “How do we ensure system uptime and data integrity despite failures?”

---

## High availability (HA)

### Key principles of HA

1. **Redundancy**
   - Duplicate critical components (e.g., servers, databases, load balancers).
2. **Failover mechanisms**
   - Automatic switching to a standby system if the primary one fails.
3. **Load balancing**
   - Distributes traffic across multiple instances to prevent overload.

Example: Using **Nginx** as a load balancer:

```bash
upstream backend {
    server backend1.example.com;
    server backend2.example.com;
}

server {
    listen 80;
    location / {
        proxy_pass http://backend;
    }
}
```

✔ Prevents single points of failure
✖ Requires careful configuration and monitoring

---

## Disaster recovery (DR) & backups

Disaster recovery focuses on restoring services quickly after major failures.

### Disaster recovery plan (DRP)

- **RTO (Recovery Time Objective):** Maximum acceptable downtime.
- **RPO (Recovery Point Objective):** Maximum acceptable data loss.

Example DR scenarios:

- Data center outage → Switch to a geographically distributed backup.
- Ransomware attack → Restore encrypted data from immutable backups.

### Backup strategies

1. **Full backups**
   - Periodic copies of entire data sets.

2. **Incremental backups**
   - Saves only changes since the last backup.

3. **Offsite & cloud backups**
   - Ensure data availability even if local backups are compromised.

Example: PostgreSQL database backup using `pg_dump`:

```bash
pg_dump -U postgres -F c -b -v -f backup.dump mydatabase
```

✔ Ensures data is recoverable
✖ Requires storage and security considerations

---

## Stateful vs stateless systems

| **Stateful**                       | **Stateless**               |
| ---------------------------------- | --------------------------- |
| Stores session data                | No session persistence      |
| Requires consistent storage        | Each request is independent |
| Example: Databases, message queues | Example: Web servers, APIs  |

Example: A stateless **REST API** allows requests to be processed independently, making it easier to scale.

✔ Stateless systems scale more easily
✖ Stateful systems require replication and synchronization

---

## Clustering & replication strategies

### Clustering

- **Active-active clusters**: Multiple nodes handle traffic simultaneously.
- **Active-passive clusters**: One node is active, others are standby.

Example: A PostgreSQL cluster with multiple read replicas improves performance.

### Replication Strategies

1. **Master-slave replication**
   - Writes go to the master, reads can be distributed across replicas.

2. **Multi-master replication**
   - Multiple nodes handle both reads and writes.

Example: PostgreSQL replication ensures data consistency across nodes.

✔ Improves redundancy and performance
✖ Requires replication monitoring

---

## PostgreSQL: sync vs async replication

### Synchronous replication

- Ensures that transactions are committed to both primary and standby nodes before confirming.
- Guarantees consistency but adds latency.

### Asynchronous replication

- Transactions are written to the primary and later replicated to standby nodes.
- Improves performance but risks data loss in case of failure.

Example: Configuring PostgreSQL synchronous replication:

```sql
ALTER SYSTEM SET synchronous_standby_names = 'node1, node2';
```

✔ Synchronous = Strong consistency
✔ Asynchronous = Better performance
