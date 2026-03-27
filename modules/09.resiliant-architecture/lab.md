---
duration: 1h
---

### Lab: Data recovery, resilience & high availability

This lab will build on experience with PostgreSQL by adding backup strategies and disaster recovery simulations.

## Lab objectives

1. **Backup & recovery**: Set up automated PostgreSQL backups and perform a restore.
2. **Disaster recovery**: Simulate a failure and restore data.

## Prerequisites

- A **Linux server or VM** with Docker installed.
- **PostgreSQL installed on Linux** (`psql` available via command line).

## 1. Backup & recovery

Configure automated backups & perform a restore.

### 1.1. Install PostgreSQL on Linux

Run:

```bash
sudo apt update && sudo apt install -y postgresql postgresql-contrib
```

Ensure the service is running:

```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

Verify the installation:

```bash
psql --version
```

Set up your postgres password:

```bash
sudo -u postgres psql postgres
```

Then :

```bash
\password postgres
# And enter your password twice
```

Feed your database with dummy data:

```bash
sudo -u postgres psql -d postgres <<EOF
CREATE TABLE test_data (
    id SERIAL PRIMARY KEY,
    name TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
INSERT INTO test_data (name) VALUES ('Alice'), ('Bob'), ('Charlie');
EOF
```

And verify that the data is inserted:

```bash
sudo -u postgres psql -d postgres -c "SELECT * FROM test_data;"
```

### 1.2. Set up PostgreSQL backups

We'll configure `pg_dump` to create daily backups.

Run the following command to create a backup in your home directory:

```bash
pg_dump -U postgres -h localhost -d postgres > ~/pg_backup_$(date +%F).sql
```

To automate, create a cron job:

```bash
crontab -e
```

Add this line to run the backup at 2 AM every day:

```bash
0 2 * * * pg_dump -U postgres -h localhost -d postgres > ~/pg_backup_$(date +\%F).sql
```

### 1.3 Delete table

```bash
sudo -u postgres psql -d postgres <<EOF
DROP TABLE test_data;
EOF
```

This should now return an error:

```bash
sudo -u postgres psql -d postgres -c "SELECT * FROM test_data;"
```

### 1.4 Restore a backup

To restore a database:

```bash
sudo -u postgres psql -U postgres -d postgres < ~/pg_backup_YYYY-MM-DD.sql
```

Check the restore is complete:

```bash
sudo -u postgres psql -d postgres -c "SELECT * FROM test_data;"
 id |  name   |        created_at
----+---------+---------------------------
  1 | Alice   | 2025-03-27 23:22:13.07332
  2 | Bob     | 2025-03-27 23:22:13.07332
  3 | Charlie | 2025-03-27 23:22:13.07332
(3 rows)
```

## 4. Setup high-availability with Postgres

Make your own researches on how you could enable high availability setup on your postgre database.

Understand the key mechanisms that take place.
