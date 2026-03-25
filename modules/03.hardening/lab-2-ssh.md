---
duration: 1h
todos:
  - Enrich the tutorial with SFTP (see kb card)
---

# SSH key authentication

This section provides detailed explanations of the commands used for generating SSH keys and for disabling password authentication on a server.

## Objectives

- Learn the basic of SSH
- Personal key generation in a modern format
- SSH daemon configuration

## Tasks

1. Environment (easy level)
2. SSH key generation (easy level)
3. Deploy your key to a remove server (easy)
4. Password authentication disactivation (medium level)

## Part 1. Environment (easy level)

An Ubuntu container or virtual machine must be started with your favorite hybervisor.

```bash
# Incus (Linux only)
incus launch images:ubuntu/24.04 lab-ssh
# Multipass (Linux, macOS, Windows)
multipass launch --name lab-ssh
# VirtualBox, Vagrant, Cloud, ...
```

Enter the machine as a standard user (not root).

```bash
# Incus
incus exec lab-ssh -- su -l ubuntu
# Multipass
multipass shell lab-ssh
```

## Part 2. SSH key generation (easy level)

An SSH key pair is created with the `ssh-keygen` command.

```bash
ssh-keygen -t ed25519 -C "ubuntu@adaltas.com"
```

The Ed25519 algorithm is strongly recommanded. Only use the RSA algorithm when interacting with legacy systems and with a key length higher or equal to `4096`.

The command ask for two questions, both requires optional answers.

- **Choose a Location**  
  After running the command, you will be prompted to specify a location to save the key. By default, it will be saved as `~/.ssh/id_rsa` (private key) and `~/.ssh/id_rsa.pub` (public key). You can press Enter to accept the default or provide a different path.
- **Set a Passphrase**  
  You will be prompted to enter a passphrase for additional security. The passphrase is commonly left empty.

Looking at the newly created `~/.ssh/` folder, the private key and its associated certificate are created.

```bash
ll ~/.ssh/
#> total 3
#> drwx------ 2 ubuntu ubuntu   4 Feb 25 19:06 ./
#> drwxr-x--- 3 ubuntu ubuntu   6 Feb 25 19:06 ../
#> -rw------- 1 ubuntu ubuntu 411 Feb 25 19:06 id_ed25519
#> -rw-r--r-- 1 ubuntu ubuntu 100 Feb 25 19:06 id_ed25519.pub
```

**!!Never share your private key!!**

## Part 3. Deploy your key to a remove server (easy)

User authentication are granting by appending a public key to a remote `~/.ssh/authorized_keys` file. Be carefull however if you are creating the file or its parent directory. SSH is very strict with file permissions.

A safer alternative is to use the `ssh-copy-id` command to import your key into a remote server. The command deploys your public key to the remote server, allowing you to authenticate using your private key instead of a password.

```bash
ssh-copy-id <username>@<address>
```

After Running the Command, you are prompted to enter the password for the remote user. Once you enter the correct password, the public key will be copied to the `~/.ssh/authorized_keys` file on the remote server, enabling passwordless authentication.

The ssh daemon is installed and started.

```bash
sudo apt install -y openssh-server
```

A new `guest` user is created on the instance.

```bash
sudo useradd \
  --create-home \
  -p $(openssl passwd "secret") \
  --shell /bin/bash \
  guest
```

The `ubuntu` user key is registed into the `guest` authorized keys.

```bash
ssh-copy-id guest@localhost
#> /usr/bin/ssh-copy-id: INFO: Source of key(s) to be installed: "/home/ubuntu/.ssh/id_ed25519.pub"
#> /usr/bin/ssh-copy-id: INFO: attempting to log in with the new key(s), to filter out any that are already installed
#> /usr/bin/ssh-copy-id: INFO: 1 key(s) remain to be installed -- if you are prompted now it is to install the new keys
#> guest@localhost's password:
#>
#> Number of key(s) added: 1
#>
#> Now try logging into the machine, with:   "ssh 'guest@localhost'"
#> and check to make sure that only the key(s) you wanted were added.
```

It is now possible to connect to the guest account with the SSH protocol without any password.

```bash
sh guest@localhost whoami
#> guest
```

## Part 4. Password authentication disactivation (medium level)

The SSH server configuration is located in `/etc/ssh/sshd_config`.

Edit the SSH Configuration with your favorite console editory

```bash
sudo vim /etc/ssh/sshd_config
# Or
sudo nano /etc/ssh/sshd_config
```

Find the line that says `#PasswordAuthentication yes` (the `#` indicates that the line is commented out). Uncomment the property and set its value to `no`.

```bash
PasswordAuthentication no
```

For the change to take effect, the SSH Daemon is restarted.

```bash
sudo systemctl restart ssh
```

After restarting the SSH service, the changes you made to the configuration file will take effect. Password authentication is now disabled, and only SSH key-based authentication will be allowed.
