---
duration: 1h
---

# Lab: honeypot with Cowrie

The lab set up a basic honeypot on a virtual machine (VM) using the Honeypot tool **Cowrie**. **Cowrie** is an interactive Honeypot that simulates an SSH and Telnet server to attract attackers and capture their actions without compromising the real system.

## Objectives

- Install a honeypot server with Cowrie on a VM.
- Monitor and record intrusion attempts.
- Analyze the data collected by the Honeypot.

## Tasks

1. Environment (easy level)
2. Cowrie installation (medium level)
3. Cowrie activation (easy level)
4. Honeypot validation (easy level)
5. Data analyzis (easy level)

## Prerequisites

- Have **Multipass** installed on your machine.
- Have an active internet connection to install dependencies on the VM.
- Basic knowledge of SSH and networks.

## Part 1. Environment (easy level)

An Ubuntu virtual machine or container is started with your favorite hybervisor.

```bash
# Incus (Linux only)
incus launch images:ubuntu/24.04 lab-honeypot
# Multipass (Linux, macOS, Windows)
multipass launch --name lab-honeypot
# VirtualBox, Vagrant, Cloud, ...
```

Enter the machine.

```bash
# Incus
incus exec lab-honeypot -- su -l ubuntu
# Multipass
multipass shell lab-honeypot
```

Run the following commands to upgrade the system.

```bash
sudo apt update
sudo apt upgrade -y
```

## Part 2. Cowrie installation (medium level)

Cowrie is a medium to high interaction SSH and Telnet honeypot designed to log brute force attacks and shell interaction performed by attackers, recording all their activities in detailed logs.

Once inside the guest instance, install the required packages for Cowrie:

```bash
sudo apt update
sudo apt install -y git python3-virtualenv python3-dev libssl-dev libffi-dev build-essential
```

Clone the Cowrie repository:

```bash
git clone https://github.com/cowrie/cowrie
cd cowrie
```

Create a Python virtual environment:

```bash
virtualenv --python=python3 cowrie-env
source cowrie-env/bin/activate
```

Install Python dependencies:

```bash
pip install --upgrade pip
pip install -r requirements.txt
python -m pip install -e .
```

## Part 3. Cowrie activation (easy level)

Copy the sample configuration file to customize it:

```bash
cp etc/cowrie.cfg.dist etc/cowrie.cfg
```

Open the configuration file from the terminal using an appropriate text editor.

```bash
vim etc/cowrie.cfg
```

In this file, you can configure several options such as:

- The SSH port to use (Cowrie defaults to running a fake SSH server on port 2222).
- The Telnet port (if you want to capture Telnet connections as well).
- Log management.

Activate the Python virtual environment:

```bash
source cowrie-env/bin/activate
```

Start Cowrie:

```bash
cowrie start
```

Cowrie is now running a fake SSH server on port 2222.

## Step 4. Honeypot validation (easy level)

To test your Honeypot, try an SSH connection to port 2222 on the VM from the host (replace `vm_ip` with the IP address of the VM obtained via `multipass list`):

```bash
ssh -p 2222 root@vm_ip
```

Run a few commands to see how Cowrie logs the actions.

## Step 5. Data analyzis (easy level)

1. The logs of recorded attacks can be found in the `log` directory of Cowrie. To access it:

```bash
cat var/log/cowrie/cowrie.log
```

2. You can analyze the logs to see login attempts and the commands executed by attackers.
