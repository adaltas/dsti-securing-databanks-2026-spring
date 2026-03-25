---
duration: 1h
category:
  - name: LAB
components:
  - name: INCUS
  - name: SYSTEMD
platforms:
  - name: LINUX
revisions:
  - date: 2024-10-01
    comment: initial release
    author: d.saison@adaltas.com
tags:
  - name: TUTORIAL
---

# Lab: Hardening vm linux

securing a linux machine

## Objectives

- Ensure your system is up-to-date with the latest security patches
- Set up a firewall to control incoming and outgoing traffic
- Reduce the attack surface by disabling services you don't need
- Enhance SSH security by using key-based authentication
- Protect against brute-force attacks
- Monitor your system for suspicious activities
- Protect sensitive data by encrypting it
- Ensure data integrity and availability

## Tasks

1. Environment (easy level)
2. Configure a firewall (easy level)
3. Disable unnecessary services (easy level)
4. SSH key authentication (easy level)
5. Fail2Ban activation (easy level)
6. Intrusion Detection System (IDS) (easy level)
7. Data at rest encryption (medium level)

## Part 1. Environment (easy level)

An Ubuntu virtual machine must be started with your favorite hybervisor.

```bash
# Incus (Linux only)
incus launch images:ubuntu/24.04 lab-hardening
# Multipass (Linux, macOS, Windows)
multipass launch --name lab-hardening
# VirtualBox, Vagrant, Cloud, ...
```

Run the following commands to upgrade the system.

```bash
sudo apt update
sudo apt upgrade -y
```

## Part 2. Configure a firewall (easy level)

Use `ufw` (Uncomplicated Firewall) to allow only necessary ports.

```bash
sudo ufw allow ssh
sudo ufw allow http
sudo ufw enable
```

## Part 3. Disable unnecessary services (easy level)

### Service list

The `list-unit-files` command list all running services.

```bash
sudo systemctl list-unit-files --type=service
```

- `systemctl`: This is the primary tool used to interact with the "systemd" service manager, which manages services and units on modern Linux systems.
- `list-unit-files`: This command shows you all the unit files (services) available on your system, whether they are active or not.
- `--type=service`: This option filters the output to only show units of type **service**, so you will see the list of system services (e.g., `apache2.service`, `ssh.service`, etc.).

The output will display a list of services with two main columns:

- **UNIT FILE**: The name of the service (e.g., `apache2.service`).
- **STATE**: The state of the service. This can be:
  - `enabled`: The service is set to start automatically at boot.
  - `disabled`: The service is disabled and will not start automatically.
  - `static`: The service can be activated by other services but does not start on its own.
  - `masked`: The service is disabled and blocked from being started.

### Service desactivation

The `disable` command desactivate an unrequired service.

```bash
sudo systemctl disable <service_name>
```

- **`disable`**: This command disables the specified service, preventing it from starting automatically at the next system boot.
- **`service_name`**: This is the name of the service you want to disable.

For example, The Apache HTTP server is disabled.

```bash
sudo systemctl disable apache2.service
```

### Service stop

Disabling a service does not stop it immediately if it is already running. If the service is expected to be stopped, use the following command:

```bash
sudo systemctl stop service_name
```

Example to stop Apache.

```bash
sudo systemctl stop apache2.service
```

### Unnecessary Services identification

To determine which services you can disable, here are some tips:

- **Check for services you are not using**  
  For instance, if you are not running a web server on your personal computer, you can disable `apache2`, `nginx`, or any other server-related service.
- **Look for services specific to software you do not use**  
  For example, if you are not using Docker, you can disable `docker.service`.
- **Do not disable critical services**  
  Such as `networking`, `ssh`, or those related to log management or power management (`acpid`, `systemd-logind`, etc.).

### Checking Running Services

If you want to see only the services that are **currently running**, use this command:

```bash
sudo systemctl --type=service --state=running
```

This will give you a more precise view of the active services, and you can then decide which ones to disable if you are not using them.

### Important Considerations

- **Backup Access**  
  Before disabling password authentication, ensure you have your SSH keys set up correctly and test the connection to the server. You can open a new terminal and attempt to SSH into the server using your key. If you cannot log in, you might lock yourself out.
- **Firewall and Other Security Measures**  
  Make sure you have other security measures in place, such as a firewall and potentially using `fail2ban` to protect against brute-force attacks.

- **Public Key Management**  
  If you ever need to add another user or device that requires access to the server, you'll need to add their public key to the `authorized_keys` file on the server.

By following these steps, you've successfully generated SSH keys and disabled password authentication, enhancing the security of your SSH access to the server.

## Part 5. Fail2Ban activation (easy level)

Install and configure Fail2Ban to ban IPs after multiple failed login attempts.

```bash
sudo apt install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

## Part 6. Intrusion Detection System (IDS) (easy level)

Install and configure an IDS like `AIDE` (Advanced Intrusion Detection Environment).

```bash
sudo apt install aide
sudo aideinit
sudo cp /var/lib/aide/aide.db.new /var/lib/aide/aide.db
sudo aide --check
```

## Part 7. Data at rest encryption (medium level)

Use `LUKS` (Linux Unified Key Setup) to encrypt a partition.

```bash
sudo cryptsetup luksFormat /dev/sdX
sudo cryptsetup luksOpen /dev/sdX encrypted_partition
sudo mkfs.ext4 /dev/mapper/encrypted_partition
sudo mount /dev/mapper/encrypted_partition /mnt
```
