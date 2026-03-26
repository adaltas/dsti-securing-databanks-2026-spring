# dsti-lab-12-secure-data-in-transit

Clone the project:

```bash
git clone https://github.com/EliottElek/dsti-lab-12-secure-data-in-transit.git
```

Copy .env file:

```bash
cd dsti-lab-12-secure-data-in-transit
cp .env.example .env
```

Launch containers:

```bash
docker compose -f docker-compose.traefik.yml up -d && docker compose -f docker-compose.yml -f ./docker-compose.supabase.yml up -d
```
