# Authentication lab solution

## Solution part 2

Supabase provides multiple ways to authenticate its users.
Let's implement the most common method: email and password.

By default, Supabase requeries to validate emails. When signin up for the first time, you should get an email asking to click on the link to verify your email. 

While this is a **very good and important practice**, we'll deactivate this behaviour as we don't want to spend too much time setting up a local email server.

To do this start by:

- Stop your containers:

```bash
docker compose -f ./supabase/docker-compose.yml -f ./next-client/docker-compose.yml down
```

- Update line 69 of your `.env`, located in `/lab/supabase/.env` to set `ENABLE_EMAIL_AUTOCONFIRM` to `true`:

before:

```bash
## Email auth
ENABLE_EMAIL_SIGNUP=true
ENABLE_EMAIL_AUTOCONFIRM=false
```

after:

```bash
## Email auth
ENABLE_EMAIL_SIGNUP=true
ENABLE_EMAIL_AUTOCONFIRM=true
```

And restart your containers with `docker compose -f ./supabase/docker-compose.yml -f ./next-client/docker-compose.yml up -d`

## Solution part 3

Now, run your `next-client` in dev mode (make sure nodejs and npm are installed):

```bash
cd next-client
npm install
```

Then run

```bash
npm dev
```

Follow [these steps](https://supabase.com/docs/guides/auth/social-login/auth-github) to get your **Client id**, **client secret** and **callback URL**.

Just like before, update your `.env` file and add the following (line 54):

```bash
## Github
GOTRUE_EXTERNAL_GITHUB_ENABLED=true
GOTRUE_EXTERNAL_GITHUB_CLIENT_ID=your-client-id
GOTRUE_EXTERNAL_GITHUB_SECRET=your-client-secret
GOTRUE_EXTERNAL_GITHUB_REDIRECT_URI=your-redirect-url
```

And restart your containers with `docker compose -f ./supabase/docker-compose.yml -f ./next-client/docker-compose.yml up -d`

Add the logic in the `next-client`. Update `action.ts`:

```js
import { createClient } from '@/lib/supabase/server'

export async function signInWithGithub() {
    const supabase = await createClient()
    const { data } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
            redirectTo: process.env.NEXT_PUBLIC_AUTH_REDIRECT,
        },
    })
    if (data.url) {
        redirect(data.url)
    }
}
```

And add a new form:

```js
<form>
  <Button formAction={signInWithGithub} variant="outline" className="w-full">
     Login with Github
  </Button>
</form>
```