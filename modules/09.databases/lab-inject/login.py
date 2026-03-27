#!/usr/bin/env python3

import duckdb
import sys

# sys.argv[0] is the script name itself
# sys.argv[1:] contains the actual arguments
if len(sys.argv) < 3:
    print("Usage: python script.py <username> <password>")
    sys.exit(1)

# Extract the arguments
datafile='passwd.db'
username = sys.argv[1]  # The first argument
passwd = sys.argv[2]   # The second argument

# A function with SQL injection vulnerability
def login_vulnerable(conn, username, password):
    # Unsafe query construction
    query = f"SELECT * FROM users WHERE username = '{username}' AND password = '{passwd}' ;"
    return conn.sql(query).fetchall()

# Connect to a SQLite database (or create it if it doesn't exist)
with duckdb.connect(datafile) as conn:

  # Attempt to login (this will bypass the actual password check)
  result = login_vulnerable(conn, username, passwd)

  if result:
      print("User authenticated!")
  else:
      print("Invalid credentials!")
      exit(1)
