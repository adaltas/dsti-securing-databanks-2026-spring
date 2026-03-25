---
duration: 1h
sources:
  - https://supabase.com/docs/guides/auth/managing-user-data
---

# Implement authorization with Supabase

Real-life authorization example with Supabase.

## Objectives

- Enable Row-Level Security (RLS) on the `profiles` table.
- Ensure users can only access their own profile.
- Fetch profile data in the frontend while enforcing RLS.

## Tasks

1. Part 1. Environment deployment (easy level)
2. Part 2. Create a table `profiles` in Supabase (easy level)
3. Part 3. Create a trigger to update `profiles` on sign-in (medium level)
4. Part 4. Create new dummy profiles (easy level)
5. Part 5. Enable RLS on the `profiles` table (easy level)
6. Part 6. Define row level security (RLS) policies (easy level)

## Part 1. Environment deployment (easy level)

Make sure you have the latest docker and git version:

- Git:https://git-scm.com/downloads
- Docker ([Windows](https://docs.docker.com/desktop/install/windows-install/), [macOS](https://docs.docker.com/desktop/install/mac-install/), or [Linux](https://docs.docker.com/desktop/install/linux-install/)).

Now, we will run both supabase and our minimalist web app locally. Get the little project:

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
  cd "<course_session>/lab-1-rls-intro"
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

- Supabase Desktop should be available at: [http://localhost:8000](http://localhost:8000) (see `.env` for default credentials).
- Web client should be available at: [http://localhost:3000](http://localhost:8000).

## Part 2. Create a table `profiles` in Supabase (easy level)

1. **Create the `profiles` table** in Supabase via the SQL Editor ([here](http://localhost:8000/project/default/sql/1)).

   The table should have the following columns:

   ```sql
   create table public.profiles (
     id uuid not null references auth.users on delete cascade,
     email text,
     first_name text,
     last_name text,
     primary key (id)
   );
   alter table public.profiles disable row level security;
   ```

2. **Ensure the ID column matches `auth.uid()`** so each user’s profile is tied to their authentication ID.

## Part 3. Create a trigger to update `profiles` on sign-in (medium level)

To automatically insert a user’s profile when they sign up, create a trigger:

```sql
-- inserts a row into public.profiles
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, first_name, last_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'first_name', new.raw_user_meta_data ->> 'last_name');
  return new;
end;
$$;

-- trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

This ensures that every new user has a corresponding entry in the `profiles` table.

## Part 4. Create new dummy profiles (easy level)

For testing, you need to insert a few dummy profiles manually.

Go to your web app, and signup with **at least 3 emails**. They can be dummy emails, like:

- alice@toto.com
- bob@toto.com
- john@doe.com

Now, log in with one of the accounts and access http://localhost:3000/protected.
What can you see?

We have access to other's data. This mechanism is not safe.

## Part 5. Enable RLS on the `profiles` table (easy level)

Go to your SQL editor and enable RLS (Row Level Security):

```sql
alter table public.profiles enable row level security;
```

Now, go back to your protected route. What can you see?

We have access to **no account**. If RLS is enable and no policies are set, PostgreSQL follows the principle of the least priviledge: **deny by default**.

In our case, we at least want to be able to access our own data.

## Part 6. Define row level security (RLS) policies (easy level)

### **Read (SELECT) - Users can view their own profile**

Go to your editor and enter:

```sql
CREATE POLICY "Users can view their own profile"
ON profiles
FOR SELECT
USING (auth.uid() = id);
```

You should be able to access your own data.

### **Write (INSERT/UPDATE) - Users can modify their own profile**

```sql
CREATE POLICY "Users can insert their own profile"
ON profiles
FOR INSERT
WITH CHECK (auth.uid() = id);
```

```sql
CREATE POLICY "Users can update their own profile"
ON profiles
FOR UPDATE
USING (auth.uid() = id);
```

### **Delete (Optional) - Allow users to delete their own profile**

```sql
CREATE POLICY "Users can delete their own profile"
ON profiles
FOR DELETE
USING (auth.uid() = id);
```

## **Open discussion**

- What could be improved?
- Should users be able to delete their own profiles?
- Is the profile data structure sufficient, or should additional fields be added?
- Should updates require re-authentication (e.g., password re-entry)?
- Do we need an admin role with full access to all profiles?
