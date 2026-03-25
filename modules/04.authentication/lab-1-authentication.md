---
duration: 1h
---

# Implement authentication with Supabase

Real life authentication example with Supabase.

## Objectives

- Understant Supabase and its usage
- Setup authentication with email and password
- Setup authentication with third-party (Github, Google)
- Understand protected routes in web applications

## Tasks

1. Environment deployment (easy level)
2. Setup email/password authentication (easy level)
3. Setup Oauth authentication (medium level)
4. Signing in from a web app (medium level)
5. access protected routes (medium level)

## Part 1. Environment deployment (easy level)

Make sure you have the latest docker and git version:

- Git:https://git-scm.com/downloads
- Docker ([Windows](https://docs.docker.com/desktop/install/windows-install/), [macOS](https://docs.docker.com/desktop/install/mac-install/), or [Linux](https://docs.docker.com/desktop/install/linux-install/)).

The supabase services and a minimalist web app locally are started locally.

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

- Supabase Desktop is available at [http://localhost:8000](http://localhost:8000)
- Web client is available at [http://localhost:3000](http://localhost:8000).

## Part 2. setup email/password authentication (easy level)

Supabase provides multiple ways to authenticate its users.

The most common is already implemented: email and password.

Try to sign in with email and password.

What's happening? What's missing?

Find a way to make the email/password authentication work.

## Part 3. Setup Oauth authentication (medium level)

Now, find a way to setup your application to support OAuth2.0, and make it so that you're able to login using a third party provider such as GitHub.

For example, refer to the [official Supabase instruction](https://supabase.com/docs/guides/auth/social-login/auth-github) to get your **Client id**, **client secret** and **callback URL**.

## Part 4. Signing in from a web app (medium level)

Try signing in using email/password and using Github. Explain why you are able to stay connected even while refreshing the page?

## Part 5. Access protected routes (medium level)

If you have a session, you should get access to the protected route.

## Open discussion

What could be improved, safety wise?

- Better error handling? For example, should You really know if a user has already been registered with this email?
- Better password policy?

## Further reading

If you can't correclty identify and authenticate your users, how can you even secure the access to critical ressources? Learn more about the limitation and vulnerabilities of Oauth.

- [PortSwigger - OAuth 2.0 authentication vulnerabilities](https://portswigger.net/web-security/oauth)
- [Portswigger - list of labs](https://portswigger.net/web-security/all-labs#oauth-authentication)
