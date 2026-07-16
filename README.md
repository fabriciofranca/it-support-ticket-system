# IT Support Ticket System

A small, secure personal IT support ticket system built with **plain HTML, CSS and JavaScript** on top of **Supabase** (PostgreSQL, Authentication and Row Level Security). Each user can register, log in and manage only their own support tickets.

This project was built as a portfolio piece to demonstrate practical experience with authentication, database design and database-enforced security.

## Features

- Email and password sign up / log in / log out (Supabase Auth)
- Create, view, edit and delete support tickets (full CRUD)
- Change ticket status inline
- Ticket fields: title, category, priority, description, status, created date
- Status and priority shown as colour-coded badges
- Simple profile summary showing the logged-in user
- Responsive, accessible, mobile-friendly interface
- Client-side input validation plus server-side CHECK constraints

## Ticket model

| Field | Values |
| --- | --- |
| Category | Hardware, Software, Network, Account, Other |
| Priority | Low, Medium, High |
| Status | Open, In Progress, Resolved |

## Tech stack

HTML, CSS, JavaScript (no framework), Supabase (PostgreSQL + Auth), GitHub, Vercel.

## Security

- **Row Level Security (RLS)** is enabled on the tickets table.
- Every policy is based on `auth.uid() = user_id`, so a user can only read, insert, update and delete their own rows. This is enforced by the database, not just the UI.
- User passwords are handled entirely by Supabase Auth and are never stored by this app.
- Input is validated on the client and constrained on the server with `CHECK` constraints.
- Error messages shown to users are generic and do not leak internal details.

### Which keys are safe in the frontend?

| Key | Safe in browser? | Notes |
| --- | --- | --- |
| Project URL | Yes | Public endpoint. |
| Publishable / anon key | Yes | Only allows what RLS policies permit. |
| Secret / service_role key | **No** | Bypasses RLS. Never put it in frontend code, this repo, or client config. |

The publishable key is stored in `js/config.js` as a placeholder. Because this is a static site, the key must reach the browser to work, which is expected and safe for a publishable key protected by RLS.

## Project structure

```
it-support-ticket-system/
|- index.html            App shell: auth section + dashboard + event handlers
|- css/
|  |- style.css         Responsive dark-blue / white / grey theme
|- js/
|  |- config.js         Supabase URL + publishable key (placeholder)
|  |- supabaseClient.js  Creates the Supabase client
|  |- auth.js           Sign up, log in, log out, session handling
|  |- tickets.js        Ticket CRUD + rendering + validation
|- supabase/
|  |- schema.sql        Table + RLS policies to run in Supabase
|- .gitignore
|- README.md
```

## Setup

1. Create a Supabase project.
2. In the Supabase dashboard open **SQL Editor -> New query**, paste the contents of `supabase/schema.sql` and run it. This creates the tickets table, enables RLS and adds the policies.
3. In **Project Settings -> API Keys**, copy your **Project URL** and **Publishable key**.
4. Open `js/config.js` and replace the placeholder with your publishable key. The Project URL is already set.
5. In **Authentication -> Sign In / Providers**, make sure Email is enabled. For quick testing you may turn off the "Confirm email" option.

## Run locally

Because the app uses Supabase Auth, serve it over http (not the file:// protocol):

```
npx serve .
```

Then open the local URL shown in the terminal.

## Deploy

1. Push this repository to GitHub.
2. Import the repository into Vercel as a static project (no build command, output = root).
3. Deploy.

## License

MIT - free to use for learning and portfolio purposes.
