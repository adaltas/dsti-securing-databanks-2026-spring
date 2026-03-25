---
duration: 1h
---

# Lab: Bash fork bomb

A fork bomb is a denial-of-service (DoS) attack that exploits the "fork" mechanism used by UNIX/Linux systems to create new child processes from a parent process. The idea behind a fork bomb is to create processes that repeatedly spawn new processes in a loop, rapidly exhausting system resources.

Once a fork bomb has been triggered, the only way to restore functionality is usually to restart the machine (forcing it if necessary).

A Fork Bomb risk is mitigated when executed in a controlled environment.

## Objectives

- Learn how to create new user account
- Understand how to modify existing user accounts
- Learn how to delete user accounts
- Practice adding and removing users from groups
- Understand file and directory permissions
- Learn how to manage user passwords
- Practice locking and unlocking user accounts

## Tasks

1. User account creation (easy level)
2. Classic example (easy level)
3. Observation (easy level)
4. User processes limitation (easy level)

## Part 1. Environment (easy level)

An Ubuntu container or virtual machine must be started with your favorite hybervisor.

```bash
# Incus (Linux only)
incus launch images:ubuntu/24.04 lab-fork-bomb
# Multipass (Linux, macOS, Windows)
multipass launch --name lab-fork-bomb
# VirtualBox, Vagrant, Cloud, ...
```

Enter the machine as a standard user (not root).

```bash
# Incus
incus exec --user 1000 lab-fork-bomb bash
# Multipass
multipass shell lab-fork-bomb
```

## Part 2. Classic example (easy level)

**Warning!** Never run this type of command on a production system or your personal machine without precautions.

Execute the following command in the terminal to trigger the fork bomb:

```bash
:(){ :|:& };:
```

This script uses recursion to create a large number of processes quickly. Each process creates two new processes (one via `:` and the other via `|`), and this continues until the system's resources are fully depleted.

## Part 3. Observation (easy level)

- You should quickly notice your system becoming unresponsive due to process saturation.
- Using tools like `htop` or `top`, you can observe the exponential increase in the number of running processes.

## Part 4. User processes limitation (easy level)

You can set limits to prevent users from creating too many processes, thereby reducing the risk of a fork bomb.

The `ulimit` command allows you to define limits on system resources for a user.

This sets the maximum number of processes for a user to 100.

```bash
ulimit -u 100
```

The setting is persisted by editing the `/etc/security/limits.conf` file.

```bash
echo '*       hard    nproc   100' > /etc/security/limits.conf
```
