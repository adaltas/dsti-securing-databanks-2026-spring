---
duration: 1h
category:
  - name: LAB
components:
  - name: INCUS
  - name: MINIO
  - name: RESTIC
  - name: SSH
  - name: UBUNTU
platforms:
  - name: LINUX
revisions:
  - date: 2024-10-01
    comment: Initial writing
    author: d.saison@adaltas.com
  - date: 2025-02-14
    comment: Isolation, overall rewrite, validation
    author: david@adaltas.com
tags:
  - name: TUTORIAL
---

# Lab: PostgreSQL database backup to MinIO object storage with Restic

Using Docker Compose, PostgreSQL database backups are stored inside a MinIO object storage. Backups are managed by Restic. They are created by synchronizing files or by redirecting the output of a command. The restore procedure load the saved database into a secondary PostgreSQL server.

## Objectives

- Usage of Docker Compose.
- Initialization of the Minio object storage server.
- Backup file, directory and process output.
- Simple, flexibile and complete backup tool with Restic.

## Tasks

1. Environment (easy level)
2. Backup scheduling (medium level)

## Part 1. Environment (easy level)

An Ubuntu virtual machine must be started with your favorite hybervisor.

```bash
# Incus (Linux only)
incus launch images:ubuntu/24.04 lab-backup --vm
# Multipass (Linux, macOS, Windows)
multipass launch --name lab-backup --cpus 2 --memory 4g
# VirtualBox, Vagrant, Cloud, ...
```

Enter the machine.

```bash
# Incus
incus shell lab-backup
# Multipass
multipass shell lab-backup
```

Run the following commands to upgrade the system.

```bash
sudo apt update
sudo apt upgrade -y
```

## Part 2. Backup scheduling (medium level)

[Restic](https://restic.net/) is a fast, secure, and efficient open-source backup program that supports multiple storage backends (like local, SFTP, AWS S3, and others) and features encryption, deduplication, and incremental backups.

In this tutorial, Restic is used to backup a [PostgreSQL](https://www.postgresql.org/) database into a [MinIO](https://min.io/) object storage. The database backup is then restored into a second PostgreSQL instance.

The services are started using [Docker Compose](https://docs.docker.com/compose/). You can run Docker Compose in you local environment is isolate the environment inside a virtual machine.

### Docker installation

```bash
sudo apt install -y docker.io docker-compose-v2
```

If the current user isn't root, he is assigned privileged rights to manage Docker.

```bash
if [[ $USER != "root" ]]; then
  sudo usermod -aG docker $USER
  newgrp docker
fi
```

### Restic installation

The Restic package is available on Ubuntu and is installed.

```bash
sudo apt install -y restic
```

### Container environment

The Docker Compose file declares 2 PostgreSQL databases server and the MinIO object storage server. The 3 containers instances are created and started.

```bash
ROOT_ACCESSKEY=ROOTNAME
ROOT_SECRETKEY=CHANGEME123
# Containers declaration
cat <<EOF > ~/docker-compose.yml
version: '3.1'
services :
  db1:
    container_name: db1
    image: postgres:10-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: changeme
      POSTGRES_DB: my_source_db
  db2:
    container_name: db2
    image: postgres:10-alpine
    ports:
      - "5433:5433"
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: changeme
      POSTGRES_DB: my_target_db
  minio:
    container_name: minio
    image: quay.io/minio/minio
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      MINIO_ROOT_USER: ${ROOT_ACCESSKEY}
      MINIO_ROOT_PASSWORD: ${ROOT_SECRETKEY}
    volumes:
      - ~/minio/data:/data
    command: server /data --console-address ":9001"
EOF
# Containers creation and startup
docker compose up -d
```

### MinIO client installation

The [MinIO Client's command `mc`](https://min.io/docs/minio/linux/reference/minio-mc.html#install-mc) is installed to interact with the storage server.

Check your system:

```bash
uname -m
```

If your have something like `amd64 (x86_64)`, install `mc` using:
```bash
sudo apt install -y curl
sudo curl -L \
  -o /usr/local/bin/mc \
  https://dl.min.io/client/mc/release/linux-amd64/mc
sudo chmod +x /usr/local/bin/mc
mc --help
```

else, if you have `aarch64` intall the appropriate version:

```bash
sudo apt install -y curl
sudo curl -L \
  -o /usr/local/bin/mc \
  https://dl.min.io/client/mc/release/linux-arm64/mc
sudo chmod +x /usr/local/bin/mc
mc --help
```

The MinIO server is registered in the client as `myminio`.

```bash
ALIAS=myminio
ROOT_ACCESSKEY=ROOTNAME
ROOT_SECRETKEY=CHANGEME123
# mc alias set <ALIAS> <URL> <ACCESSKEY> <SECRETKEY>
mc alias set $ALIAS http://localhost:9000 $ROOT_ACCESSKEY $ROOT_SECRETKEY
# Validation
mc admin info $ALIAS
# Not bucket is yet created
mc ls $ALIAS
```

### Bucket creation

A new bucket is created in the MinIO server.

```bash
ALIAS=myminio
BUCKET=restic-bucket
# mc mb <[FLAGS]> <TARGET>
mc mb $ALIAS/$BUCKET
# Validation
mc ls $ALIAS
```

### Bucket policy

A MinIO bucket policy is a JSON document that defines permissions and access controls for buckets and objects in MinIO object storage. It follows AWS S3's policy structure.

The key elements are:

- Version: Policy language version
- Effect: "Allow" or "Deny"
- Action: What operations are allowed/denied
- Resource: Which buckets/objects the policy affects

```bash
BUCKET=restic-bucket
POLICY=restic_policy_readwrite
cat <<EOF > ~/${POLICY}.json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket",
        "s3:DeleteObject",
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": "arn:aws:s3:::${BUCKET}/*"
    }
  ]
}
EOF
```

The policy is registed and validated.

```bash
ALIAS=myminio
BUCKET=restic-bucket
POLICY=restic_policy_readwrite
mc admin policy create $ALIAS/$BUCKET $POLICY ${POLICY}.json
mc admin policy list $ALIAS/$BUCKET
mc admin policy info $ALIAS/$BUCKET $POLICY
```

### User creation

The [`root` user](https://min.io/docs/minio/kubernetes/upstream/administration/identity-access-management/minio-user-management.html#minio-root-user) defined in Docker Compose has access to all actions and resources on the deployment, regardless of the configured identity manager.

The `mc admin user add` command creates [a new user](https://min.io/docs/minio/kubernetes/upstream/administration/identity-access-management/minio-user-management.html#create-a-user).

```bash
ALIAS=myminio
BUCKET_USER=restic_user
BUCKET_SECRET=restic_secret_key
# mc admin user add <ALIAS> <ACCESSKEY> <SECRETKEY>
mc admin user add $ALIAS $BUCKET_USER $BUCKET_SECRET
```

### User access

```bash
ALIAS=myminio
POLICY=restic_policy_readwrite
BUCKET_USER=restic_user
mc admin policy attach $ALIAS $POLICY --user=$BUCKET_USER
# Validation
mc admin policy entities $ALIAS --user $BUCKET_USER
```

### Restic configuration

Restic is executed using the `restic` user account. The user is granted permission to access Docker.

```bash
UNIX_USER=restic
UNIX_PASSWORD=secret
sudo useradd \
  -p $(openssl passwd ${UNIX_PASSWORD}) \
  --shell /bin/bash \
  --create-home \
  $UNIX_USER
sudo usermod -aG docker restic
sudo su - restic
```

The MinIO access is validated.

```bash
ALIAS=myminio
BUCKET_USER=restic_user
BUCKET_SECRET=restic_secret_key
BUCKET=restic-bucket
mc alias set $ALIAS http://localhost:9000 $BUCKET_USER $BUCKET_SECRET
# Validation (empty, no error shall appear)
mc ls $ALIAS/$BUCKET
```

Object storage address and credentials are stored for conveniency.

```bash
BUCKET_USER=restic_user
BUCKET_SECRET=restic_secret_key
BUCKET=restic-bucket
cat <<EOF > ~/restic-env
export AWS_ACCESS_KEY_ID=$BUCKET_USER
export AWS_SECRET_ACCESS_KEY=$BUCKET_SECRET
export RESTIC_REPOSITORY="s3:http://localhost:9000/$BUCKET"
export RESTIC_PASSWORD="backup-secret"
EOF
```

The restic storage is initialized.

```bash
source ~/restic-env
echo $RESTIC_REPOSITORY
restic init
```

Its creation is validated by listing the bucket files.

```bash
mc ls $ALIAS/$BUCKET
#> [2025-02-12 21:13:59 UTC]   155B STANDARD config
#> [2025-02-12 21:14:14 UTC]     0B keys/
```

### Database population

```bash
cat <<SQL | docker exec -i db1 psql -U user -d my_source_db
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50),
  email VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  product_name VARCHAR(100),
  price DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO
  users (name, email)
VALUES
  ('John Doe', 'john@example.com'),
  ('Jane Doe', 'jane@example.com'),
  ('Alice Smith', 'alice@example.com'),
  ('Bob Johnson', 'bob@example.com');
INSERT INTO
  orders (user_id, product_name, price)
VALUES
  (1, 'Laptop', 1200.00),
  (1, 'Mouse', 25.00),
  (2, 'Smartphone', 800.00),
  (3, 'Keyboard', 45.00),
  (4, 'Monitor', 300.00);
SQL
```

### Restic backup from file

Restic can backup local files and directories.

The database is dump into a SQL file.

```bash
docker exec -t db1 pg_dump -U user -d my_source_db > ~/dump.sql
```

The SQL file is save to the object storage using restic.

```bash
source ~/restic-env
restic backup ~/dump.sql
#> repository e6739f88 opened (version 2, compression level auto)
#> created new cache in /home/restic/.cache/restic
#> no parent snapshot found, will read all files
#>
#> Files:           1 new,     0 changed,     0 unmodified
#> Dirs:            2 new,     0 changed,     0 unmodified
#> Added to the repository: 5.774 KiB (2.264 KiB stored)
#>
#> processed 1 files, 4.719 KiB in 0:00
#> snapshot 4dc30225 saved
rm ~/dump.sql
```

A new snapshot has been created.

```bash
restic snapshots
#> repository e6739f88 opened (version 2, compression level auto)
#> ID        Time                 Host           Tags        Paths
#> -------------------------------------------------------------------------------
#> 4dc30225  2025-02-12 21:36:59  lab-backup                 /home/restic/dump.sql
#> -------------------------------------------------------------------------------
#> 1 snapshots
```

### Restic backup from a stream

Restic can backup data coming from stdin. In such as, the `--stdin` and `--stdin-filename` arguments are required. Note in this example, we also use the `--host` argument to defined a custom hostname to reflect the container instead of the guest hostname.

```bash
docker exec -t db1 pg_dump -U user -d my_source_db | \
  restic backup --host db1 --stdin --stdin-filename my_source_db.sql
```

A second snapshot has been created.

```bash
restic snapshots
#> repository e6739f88 opened (version 2, compression level auto)
#> ID        Time                 Host           Tags        Paths
#> -------------------------------------------------------------------------------
#> 4dc30225  2025-02-12 21:36:59  lab-backup                 /home/restic/dump.sql
#> 5091478e  2025-02-12 21:45:46  db1                        /my_source_db.sql
#> -------------------------------------------------------------------------------
#> 2 snapshots
```

### Backup restoration

The snapshot ID is obtained from `restic snapshots`, for example "5091478e".

The snapshot is restored in a local folder.

```bash
SNAPSHOT_ID=
mkdir ~/restore
restic restore $SNAPSHOT_ID --target ~/restore
```

The extracted backup is used to restore or, in this case, to initialize a database in a new host.

```bash
docker exec -i db2 psql -U user -d my_target_db < ~/restore/my_source_db.sql
```
