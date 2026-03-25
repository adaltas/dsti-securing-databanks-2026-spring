# DSTI lab 10 - Authentication

- Ensure that the ports `8000` and `3000` are available.
  ```bash
  echo "Port 8000: $(
    bash -c '> /dev/tcp/localhost/8000' 2>/dev/null && echo 'KO' || echo 'OK'
  )"
  echo "Port 3000: $(
    bash -c '> /dev/tcp/localhost/3000' 2>/dev/null && echo 'KO' || echo 'OK'
  )"
  ```
- Clone the repo and go to the project folder:
  ```bash
  git clone "<course_repository>"
  cd "<course_session>/lab-authentication"
  ```
- Copy `.env` files:
  ```bash
  cp ./supabase/.env.example ./supabase/.env
  cp ./next-client/.env.example ./next-client/.env.local
  ```
- Run the project:
  ```bash
  docker compose \
    -f ./supabase/docker-compose.yml \
    -f ./next-client/docker-compose.yml \
    up -d
  ```

Supabase and the client applications are now up and running.

- Supabase Desktop should be available at: [http://localhost:8000](http://localhost:8000)
- Web client should be available at: [http://localhost:3000](http://localhost:8000).
