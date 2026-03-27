---
duration: 1h
---

# Lab: SQL injection lab

Illustrate usafe arguments parsing and SQL injection threats.

There are several possible risks: data theft, data destruction, and fraudulent data injection.

We prevent our script from the last two threats.

## Objectives

- Install Python the right way.
- Discover DuckDB.
- Illustrate injection threats.

## Tasks

1. Environment (easy level)
2. Database population (easy level)
3. Database login (easy level)
4. Unauthorized login (medium level)
5. Data destruction (medium level)
6. Data destruction (medium level)
7. SQL injestion prevention (medium level)

## Part 1. Environment (easy level)

An Ubuntu virtual machine or container is started with your favorite hybervisor.

```bash
# Incus (Linux only)
incus launch images:ubuntu/24.04 lab-sql-injection
# Multipass (Linux, macOS, Windows)
multipass launch --name lab-sql-injection
# VirtualBox, Vagrant, Cloud, ...
```

Enter the machine.

```bash
# Incus
incus exec lab-sql-injection -- su -l ubuntu
# Multipass
multipass shell lab-sql-injection
```

Python is installed with Pyenv.

```bash
sudo apt install -y git \
  make build-essential libssl-dev zlib1g-dev \
  libbz2-dev libreadline-dev libsqlite3-dev wget curl llvm \
  libncursesw5-dev xz-utils tk-dev \
  libxml2-dev libxmlsec1-dev libffi-dev liblzma-dev
curl https://pyenv.run | bash
cat <<'PROFILE' >> ~/.profile
export PYENV_ROOT="$HOME/.pyenv"
[[ -d $PYENV_ROOT/bin ]] && export PATH="$PYENV_ROOT/bin:$PATH"
eval "$(pyenv init - bash)"
eval "$(pyenv virtualenv-init -)"
PROFILE
. ~/.profile
```

Install Python 3 in its latest version and the DuckDB pip package.

```bash
pyenv install 3
pyenv global 3
python --version
#> Python 3.12.3
pip install duckdb
```

## Part 2. Database population (easy level)

A new directory is created for the lab.

```bash
mkdir lab
cd lab
```

The `populate.py` script creates a database with a unique user named `admin`.

The database is created in the `passwd.db` file.

## Part 3. Database login (easy level)

The `login.py` script is a simple implementation of an authentication system.

If the user name and password are correct, the script prints "User authenticated!" and exit with the `0` exit code to indicate its success. Otherwise, the message "Invalid credentials!" is printed to stderr and the script exit with the `1` exit code.

### Expected failures

The following commands are expected to fail.

```bash
./login.py
#> Usage: python script.py <username> <password>
./login.py toto tutu
#> Invalid credentials!
./login.py admin tutu
#> Invalid credentials!
echo $?
#> 1
```

### Expected success

The following command is expected to succeed with valid credentials.

```bash
./login.py admin password123
#> User authenticated!
echo $?
#> 1
```

## Part 4. Unauthorized login (medium level)

Analyse the source code and, using SQL injections, find a way to to get a successful login WITHOUT specifying a correct password.

## Part 5. User record creation (hard level)

Add a user "gollum" with password "mysecret". Verify that this user is valid.

```bash
./login.py gollum mysecret
```

## Part 6. Admin password update (medium level)

Change the admin password. You can rerun `populate.py` if needed. Verify that the admin password is updated.

```bash
./login.py admin pwned
#> User authenticated!
```

## Part 7. Data destruction (medium level)

Destroy the data! You can rerun `populate.py` if needed. Verify that the admin user can no longer gain access on the sytem.

```bash
./login.py admin pwned
#> duckdb.duckdb.CatalogException: Catalog Error: Table with name users does not exist!
#> Did you mean "sqlite_master"?
```

## Part 7. SQL injestion prevention (medium level)

Fix the script while keeping the same mechanism using Prepared Statements.
