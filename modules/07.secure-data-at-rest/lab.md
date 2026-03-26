---
duration: 2h
---

# Lab: securing a database with encryption and key management

**Duration:** 2h  
**Objective:** Understand how to encrypt a database and securely manage encryption keys.

## 1. Setting up the environment

It's highly recommended to use multipass withing your virtual machine. Install it from the official documentation.

Launch an Ubuntu virtual machine:

```bash
multipass launch --name secure-db
multipass shell secure-db
```

Install PostgreSQL:

```bash
sudo apt update && sudo apt install postgresql -y
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

Create a database:

```bash
sudo -u postgres psql -c "CREATE DATABASE securedb;"
```

## 2. Encrypting Data with PostgreSQL (TDE)

PostgreSQL does not natively support Transparent Data Encryption (TDE). We will use **pgcrypto** to encrypt sensitive columns.

Enable `pgcrypto` in the database:

```bash
sudo -u postgres psql -d securedb -c "CREATE EXTENSION pgcrypto;"
```

Create a table with encryption:

```bash
sudo -u postgres psql -d securedb -c "CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT,
    ssn BYTEA
);"
```

Insert a user with an encrypted social security number:

```bash
sudo -u postgres psql -d securedb -c "INSERT INTO users (name, ssn)
VALUES ('Alice', pgp_sym_encrypt('123-45-6789', 'supersecretkey'));"
```

Verify that the data is encrypted in the database:

```bash
sudo -u postgres psql -d securedb -c "SELECT * FROM users;"
```

Decrypt the data:

```bash
sudo -u postgres psql -d securedb -c "SELECT name, pgp_sym_decrypt(ssn::bytea, 'supersecretkey') FROM users;"
```

## 3. Securing Keys with HashiCorp Vault

Now we will **avoid storing encryption keys in plain text** by managing them with HashiCorp Vault.

### Installing Vault

Follow installation instructions here: [https://developer.hashicorp.com/vault/install#linux](https://developer.hashicorp.com/vault/install#linux).

```bash
vault server -dev &
export VAULT_ADDR='http://127.0.0.1:8200'
```

Store an encryption key in Vault:

```bash
vault kv put secret/db_key key="supersecretkey"
```

Verify that the key is stored:

```bash
vault kv get secret/db_key
```

### Retrieving the Key in a Python Application

PostgreSQL cannot directly call Vault, so we will use a small Python script to retrieve the key:

```python
import requests

VAULT_ADDR = "http://127.0.0.1:8200"
VAULT_KEY_PATH = "secret/data/db_key"

def get_encryption_key():
    response = requests.get(f"{VAULT_ADDR}/v1/{VAULT_KEY_PATH}")
    return response.json()

print("Encryption Key:", get_encryption_key())
```

What's the response ? Seems like vault is configured in a secure way.

Complete this python code so that you can get the encryption key.

## 4. Enforcing access control for keys

We will ensure that **only PostgreSQL** can read the encryption key.

Create a Vault policy:

```bash
vault policy write db_access - <<EOF
path "secret/db_key" {
  capabilities = ["read"]
}
EOF
```

Create a token for PostgreSQL:

```bash
vault token create -policy=db_access
```

## 5. Automating Decryption in an Application

Finally, we will use the key to decrypt data from a Python application.

Again, this code might be missing something.

```python
import psycopg2
import requests

# Retrieve the key from Vault
VAULT_ADDR = "http://127.0.0.1:8200"
VAULT_KEY_PATH = "secret/data/db_key"
response = requests.get(f"{VAULT_ADDR}/v1/{VAULT_KEY_PATH}")
encryption_key = response.json()["data"]["data"]["key"]

# Connect to PostgreSQL
conn = psycopg2.connect(dbname="securedb", user="postgres", password="postgres")
cur = conn.cursor()

# Decrypt data
cur.execute("SELECT name, pgp_sym_decrypt(ssn::bytea, %s) FROM users;", (encryption_key,))
for row in cur.fetchall():
    print(row)

conn.close()
```

Note, vault will not allow password connections by default. So you need to update your configuration:

```bash
sudo find / -name pg_hba.conf
```

You should have something like `/etc/postgresql/16/main/pg_hba.conf`.

```bash
sudo nano /etc/postgresql/16/main/pg_hba.conf
```

Then check for two lines like this:

```bash
local   all             postgres                                peer
```

and change `peer` to `md5`.
