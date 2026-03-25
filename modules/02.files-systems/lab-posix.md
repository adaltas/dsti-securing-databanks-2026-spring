---
duration: 1h
todos:
  - Isolate the setgid and sticky labs into their own folders
  - Provide instructor solution for setgid and sticky labs
  - File encryption is currently not working on my test (david)
  - Make archive creation reproducible
---

# Lab: Files systems management

files systems permission management

## Objectives

- Permissions files management
- Ownership and groups management
- ACLs
- File Encryption

## Tasks

1. Environment (easy level)
2. Default Permissions (medium level)
3. Permissions modification (easy level)
4. Change the owner and group (easy level)
5. Using ACLs (easy level)
6. Special Permissions: setuid bit (medium level)
7. Special Permissions: setgid bit (hard level)
8. Special Permissions: sticky bit (hard level)
9. File Encryption (easy level)
10. Archive creation

## Part 1. Environment (easy level)

An Ubuntu container or virtual machine must be started with your favorite hybervisor.

```bash
# Incus (Linux only)
incus launch images:ubuntu/24.04 lab-posix
# Multipass (Linux, macOS, Windows)
multipass launch --name lab-posix
# VirtualBox, Vagrant, Cloud, ...
```

Enter the machine as a standard user (not root).

```bash
# Incus
incus exec lab-posix -- su -l ubuntu
# Multipass
multipass shell lab-posix
```

## Part 2. Default Permissions (medium level)

POSIX (Portable Operating System Interface) is a family of standards defined by IEEE to ensure compatibility and portability between different operating systems, particularly Unix-like systems, by specifying common APIs, shell utilities, and interfaces.

POSIX file permissions define a standardized way to control read, write, and execute access for owner, group, and others using a three-digit octal notation (like 755) or symbolic representation (like rwxr-xr-x).

A new file and directory are created with the default system permission.

```bash
mkdir lab
echo 'world' > lab/hello.txt
```

Use the `ls -l` command to display the permissions.

```bash
ls -l
#> drwxrwxr-x 2 ubuntu ubuntu 3 Feb 25 15:43 lab
ls -l lab/hello.txt
#> -rw-rw-r-- 1 ubuntu ubuntu 6 Feb 25 15:43 hello.txt
```

The system default permission values are 777 (rwxrwxrwx) for folders and 666 (rw-rw-rw-) for files.

Linux apply the default mask, `002` for a non-root user is and `022` for a non-root user. The `umask` command returns the default mask. The `-S` flag prints the mask as a symbolic value.

```bash
umask
#> 0002
umask -S
#> u=rwx,g=rwx,o=rx
```

Note, umask is subtractive, not prescriptive: permission bits set in umask are removed by default from modes specified by programs, but umask can't add permission bits.

The final permision apply the mask to the system permission.

|          | directory | file      |
| -------- | --------- | --------- |
| system   | 777       | 666       |
| umask    | 002       | 002       |
| result   | 775       | 664       |
| symbolic | rwxrwxr-x | rw-rw-r-- |

Now, login as root with `sudo -i` and repeat the process to compare the default permissions for the root user.

## Part 3. Permissions modification (easy level)

Change the permissions of `lab/hello.txt` so that the owner has all rights, the group has read and execute rights, and others have no rights.

```bash
chmod 750 lab/hello.txt
```

## Part 4. Change the owner and group (easy level)

Use the `chown` command to change the owner of `lab/hello.txt` to `user1` and the group to `group1`.

```bash
sudo chown root:root lab/hello.txt
```

Considering that the permission were modified earlier such that `other` users have no permission on the file, we can't read its content.

```bash
cat lab/hello.txt
#! cat: lab/hello.txt: Permission denied
```

The `chgrp` command change the group owner.

```bash
sudo chgrp ubuntu lab/hello.txt
ls -l lab/hello.txt
#> -rwxr-x--- 1 root ubuntu 6 Feb 25 15:43 lab/hello.txt
cat lab/hello.txt
#> world
```

## Part 5. Using ACLs (easy level)

A new user `guest` is created for the practice.

```bash
sudo useradd \
  --create-home \
  -p $(openssl passwd "secret") \
  --shell /bin/bash \
  guest
```

The `lab/hello.txt` permission are reset to its default values and the `lab` folder is moved to a parent folder accessible from everyone.

```bash
sudo chown ubuntu lab/hello.txt
sudo mv lab /opt
```

The `acl` package is installed to gain access to the file access control list commands.

```bash
sudo apt install -y acl
```

The `setfacl` command adds an ACL to allow `guest` to read and write to `lab/hello.txt`.

```bash
setfacl -m u:guest:rw /opt/lab/hello.txt
```

The `getfacl` command checks the ACLs of `lab/hello.txt`.

```bash
getfacl /opt/lab/hello.txt
```

The `guest` user can now read (and write) to the `lab/hello.txt` file.

```bash
sudo -u guest cat /opt/lab/hello.txt
```

## Part 6. Special Permissions: setuid bit (medium level)

The setuid (Set User ID) bit, when set on an executable file, allows it to run with the privileges of the file's owner rather than the user executing it, commonly used for programs that need elevated permissions like `passwd`.

For security reasons, modern Linux distributions (including Ubuntu) ignore the setuid bit on shell scripts. The setuid bit is honored on compiled binaries but not on scripts.

```bash
# Install compilation dependencies
sudo apt install -y build-essential
# Program source code
cat <<C  > /opt/lab/whoiswho.c
#include <stdio.h>
#include <unistd.h>
int main() {
    printf("Effective user: %d\n", geteuid());
    return 0;
}
C
# Program compilation
gcc /opt/lab/whoiswho.c -o /opt/lab/whoiswho
id -u ubuntu
#> 1000
id -u guest
#> 1001
sudo -u guest /opt/lab/whoiswho
#> Effective user: 1001
# Change the user bit
chmod u+s /opt/lab/whoiswho
# Validation
sudo -u guest /opt/lab/whoiswho
#> Effective user: 1000
```

## Part 7. Special Permissions: setgid bit (hard level)

The setgid (Set Group ID) bit, when set on a directory or file, causes new files created within the directory to inherit the group ownership of the parent directory, or when set on an executable, allows it to run with the privileges of its group owner.

```bash
chmod g+s shared_dir
```

## Part 8. Special Permissions: sticky bit (hard level)

The sticky bit, when set on a directory, prevents users from deleting or renaming files within it unless they own the file or the directory (commonly used on /tmp), even if they have write permissions on the directory.

Create a script that illustrate the usage of the sticky bit on a new directory `/opt/lab-sticky` so that only the owners of the files can delete them.

## Part 9. File Encryption (easy level)

Use `gpg` to encrypt a file.

```bash
mkdir lab-encryption
echo 'my secret' > lab-encryption/secret.txt
gpg -c lab-encryption/secret.txt
```

Use `gpg` to decrypt the file `secret.txt.gpg`.

```bash
gpg secret.txt.gpg
```

## Part 10. Archive creation

The `tar` command allows the creation, the extraction and the listing of files archive (compressed or not).

```bash
tar -cf /tmp/save.tar /home/entreprise
```

gzip compression is enabled with the `-z` flag.

```bash
tar -czf /tmp/save.tar.gz /home/entreprise
```

bzip2 compression is enabled with the `-j` flag.

```bash
tar -cjf /tmp/save.tar.bz2 /home/company
```

xz compression is enabled with the `-J` flag.

```bash
tar -cJf /tmp/save.tar.xz /home/entreprise
```

The `-x` flag extract file and directories of an archive in the current directory.

```bash
tar -xf /tmp/save.tar
```

An archive compressed with gzip uses the `-z` flag.

```bash
tar -xzf /tmp/save.tar.gz
```
