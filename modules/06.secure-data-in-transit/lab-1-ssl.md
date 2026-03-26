---
duration: 1h
todos:
  - Use the "penpot-docker-compose" (8A0EFB37-5CBC-4919-B6B3-8BD3F882C001) card from the knowledge base
---

# Setup Supabase with secure proxy and HTTPS

Real life setting up of a project with Supabase, Traefik and Keyser.
Read:

- [Supabase](https://supabase.com/docs/guides/self-hosting)
- [Traefik](https://doc.traefik.io/traefik)
- [Keyser](https://github.com/adaltas/keyser)

## Objectives

- Understant the key mechanisms to secure hosts
- Setup Supabase with Traefik
- Create a certificate authority for our domain
- Create certificates for our subdomains
- Setup Supabase with Traefik and TLS

## Tasks

1. Environment (easy level)
2. Download keyser (easy lebel)
3. Create a certificate authority (medium level)
4. Create a certificate for your root domain (medium level)
5. Create certificates for your subdomains (medium level)
6. Setup Traefik with TLS (hard level)
7. Add your CA to Firefox (medium level)

## Part 1. Environment (easy level)

We start with a fresh setup.

On the lab repo, copy .env file:

```bash
cp .env.example .env
```

Launch containers:

```bash
docker compose \
  -f docker-compose.traefik.yml up -d
docker compose \
  -f docker-compose.yml \
  -f ./docker-compose.supabase.yml \
  up -d
```

You should have your Traefik interface at [http://localhost:8080](http://localhost:8080) and now your supabase instance at [http://kong.my-domain.localhost](http://kong.my-domain.localhost)

## Part 2. Download keyser (easy level)

```bash
mkdir -p ~/.keyser/bin
curl -o ~/.keyser/bin/keyser -L https://bit.ly/adaltas-keyser
chmod u+x ~/.keyser/bin/keyser
echo "PATH=~/.keyser/bin:$PATH" >> ~/.profile
echo "export KEYSER_VAULT_DIR=~/.keyser/vault" >> ~/.profile
echo "export KEYSER_GPG_PASSPHRASE=you_should_change_this_secret" >> ~/.profile
. ~/.profile
```

Keyser is not installed and functional.

```bash
keyser -h
keyser version
#> Keyser version "0.0.8".
```

## Part 3. Create a certificate authority (medium level)

The first thing to do is create a certificate authority. This authority will then be legitimate to create TLS certificates.

```bash
keyser cacert_list | grep -w localhost || keyser cacert \
 -c FR \
  -e no-reply@localhost \
  -l "Local localhost environment" \
  -o MyAuthority \
  localhost
```

Quick explanation:

- `-c`: Country of the issuer
- `-e`: Email of the issuer
- `-o`: Organization of the issuer
- `-l`: Location of the issuer
- fqdn: FQDN of the registered certificate (`localhost` here)

Make sure it's been created:

```bash
keyser cacert_list | grep -w localhost
```

## Part 4. Create a certificate for your root domain (medium level)

The next thing to do is create a root certificate for our domain.

```bash
keyser cert -i \
  -e no-reply@localhost \
  my-domain.localhost
```

Make sure it's been created:

```bash
keyser cert_list | grep -w localhost
```

## Part 5. Create a wildcard certificate for subdomains (medium level)

```bash
keyser cert \
  -d '*.my-domain.localhost' \
  '*.my-domain.localhost'
```

Then export the certificates to your location:

```bash
keyser cert_export -c \
  '*.my-domain.localhost' ~/path/to/your/lab/dsti-lab-12-secure-data-in-transit/certs
```

## Part 6. Update your Traefik configuration (hard level)

Create a `dynamic.yml` file at the root of your lab:

```yml
tls:
  certificates:
    - certFile: "/etc/traefik/certs/localhost.my-domain.*.cert.pem"
      keyFile: "/etc/traefik/certs/localhost.my-domain.*.key.pem"
      stores:
        - default
```

And update your `docker-compose.traefik.yml` file (uncomment the necessary lines):

```yml
services:
  reverse-proxy:
    image: traefik:v3.1
    command:
      - "--api.insecure=true"
      - "--providers.docker"
      - "--entrypoints.ws.address=:80"
      - "--entryPoints.websecure.address=:443"
      - "--entrypoints.websecure.http.tls.certresolver=myresolver"
      - "--providers.file.filename=/etc/traefik/dynamic.yml"
      - "--providers.file.watch=true"
    ports:
      # The HTTP port
      - "80:80"
      - "443:443"
      # The Web UI (enabled by --api.insecure=true)
      - "8080:8080"
    restart: unless-stopped
    volumes:
      - "./certs:/etc/traefik/certs"
      - "./dynamic.yml:/etc/traefik/dynamic.yml"
      - /var/run/docker.sock:/var/run/docker.sock
networks:
  default:
    name: traefik
    driver: bridge
```

In your `docker-compose.supabase.yml` file, uncomment the websecure directives:

- line 12: `traefik.http.routers.my-domain-supabase.entrypoints=websecure`
- line 19: `traefik.http.routers.my-domain-kong.entrypoints=websecure`
- line 40: `traefik.http.routers.my-domain-meta.entrypoints=websecure`
- line 47: `traefik.http.routers.my-domain-analytics.entrypoints=websecure`

## Part 7. Add your CA to Firefox (medium level)

The final part is to make the browser know it can trust the authority that signed the certificates. We then need to add our CA `cert.pem` file into it's known authorities.

- Go to **_Firefox_** -> **_settings_** -> **_privacy_** (`about:preferences#privacy`)
- Scroll to **_Certificates_** and click on **_View certificates_**
- On **_authorities_** tab, click **_import_**
- Import your `cert.pem` file (should be located at `~/.keyser/vault/localhost/cert.pem`)

Close Firefox and go to [https://kong.my-domain.localhost/project/default](https://kong.my-domain.localhost/project/default).

You should see a lock icon next to your URL, meaning the trafic is secured.
