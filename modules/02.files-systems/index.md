---
duration: 1h
---

# Linux File System Security

Linux controls access to files and directories through a permission model. This concept is crucial for database security, as the Linux file system itself functions similarly to a database.

## Introduction

- The Linux file system functions like a database, organizing files and directories.
- Access control is enforced through user and group permissions.
- Similar to databases, Linux regulates access via authentication and authorization.
- File permissions determine who can read, write, or execute files.
- Permissions are stored as metadata, like how databases manage user roles in their schema.

## Concept of security models

- Compare the security models of a file system and a database.

### Linux file system security

- Based on users and groups with read, write, and execute permissions
- Access controls defined by root, system users, and application users
- The permissions are stored as metadata for each file and directory.

### Database security

Based on users and roles with select, insert, update, and delete permissions.
The access controls are defined by admin users (DBAs) and application roles.
The different permissions are stored in the database schema.

## Linux user & group structure

### User types

- System users: they run system services (like `www-data`, `postgres`, etc.)
- Application users: they have restricted access to specific system parts

### File permission structure

Format: `rwx` (read, write, execute) for owner, group, and others
See for yourself:

```bash
(/home/Documents):$ ll
-rw-r--r--   john  staff  6B 12 feb 15:33 file.txt
drwxr-xr-x   john  staff 64B 12 feb 15:33 images
```

let's read from left to right (first line):

```bash
-rw--r--    1 john  staff  6B 12 feb 15:33 file.txt
```
- `-`: is the format of the entry, a file here
- `rw-`: user with read, write, and no execute permissions
- `r--`: group with read, no write permission, no execute permissions
- `r--`: others with read, no write permission, no execute permissions

let's read from left to right (second line):

```bash
drwxr-xr-x   john  staff 64B 12 feb 15:33 images
```
- `d`: is the format of the entry, a directory here
- `rwx`: user with read, write, and execute permissions
- `r-x`: group with read, no write permission, execute permissions
- `r-x`: others with read, no write permission, execute permissions

### Permission Meanings

Read (r): View file contents
Write (w): Modify file content
Execute (x): Run executable files if it's a script or program

Another way that those permissions can be read, is using the numerical mode:

```bash
chmod 640 file.txt
```
Each digit represents a category of user, and their permissions. Their permission is now read as an addition of:

- read: `r` -> `4` or `0`
- write `w` -> `2` or `0`
- execute `x` -> `1` or `0`

In our case, from left to right:

- `6`: the user has `4` + `2` + `0` permission, so `rw-`
- `4`: the group has `4` + `0` + `0` permission, so `r--`
- `0`: others have `0` + `0` + `0` permission, so `---` (no permission)

## Group Management

Groups collect users with shared access rights.
Example: `db_group` might access database configuration files.

```bash
-rw-r----- 1 user db_group 2048 Jan 1 10:00 db_config_file
```

- `rw-`: owner can read/write
- `r--`: group members can only read

This behaviour is similar to role-based access control (RBAC) in databases.

## Database systems as secure file systems

Databases like PostgreSQL and MySQL use similar permission structures:

- PostgreSQL uses roles
- MySQL uses user accounts with permissions
- File system permissions directly impact database security:

### Special Permissions

- **Setuid:**  
  Allows a user to run an executable with the permissions of the executable's owner.
- **Setgid:**  
  Allows a user to run an executable with the permissions of the executable's group.
- **Sticky Bit:**  
  Applied to directories, it ensures that only the file's owner can delete or rename the file within that directory.

## File Ownership

Each file and directory is owned by a user and a group.
Ownership can be changed using the `chown` command.

## Access Control Lists (ACLs)

ACLs provide a more flexible permission mechanism. They allow setting permissions for specific users or groups beyond the traditional user/group/others model. You can manage ACLs using the `setfacl` and `getfacl` commands.

## File Encryption

Encrypting files adds an extra layer of security. Tools like `gpg` can be used to encrypt files, ensuring that only authorized users can access the contents.

## Secure Deletion

When you delete a file, it's not immediately removed from the disk. Tools like `shred` can be used to securely delete files by overwriting them multiple times.
These mechanisms collectively help in maintaining the security and integrity of files on a Linux system.

## Security implications and key points

Linux file system security is the first defense layer for databases. Database systems rely highly on OS-level file security. Proper user/group management is essential for database environment security. File system and database permissions must work together to ensure only authorized users access data at appropriate levels.