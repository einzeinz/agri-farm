# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Supabase setup

This app now includes a Supabase data layer for generic farm data.
When Supabase credentials are present, the app shows a login screen and sends the logged-in user's access token with each REST request.

Environment variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Login flow:

- Sign in with Supabase email/password auth.
- Use sign up in the login screen if you need to create a new Supabase user.
- Signed-in users can sign out from the dashboard header.

SQL files to run in Supabase:

- [`supabase_farm_schema.sql`](./supabase_farm_schema.sql)
- [`supabase_farm_rls.sql`](./supabase_farm_rls.sql)
- [`supabase_farm_seed.sql`](./supabase_farm_seed.sql)

Security notes:

- Run the schema before the RLS script.
- The RLS script locks the app to authenticated users only.
- Farm access is based on farm ownership and `farm_members` rows.

Client helpers:

- [`src/lib/supabaseRest.js`](./src/lib/supabaseRest.js)
- [`src/lib/supabaseAppState.js`](./src/lib/supabaseAppState.js)
- [`src/lib/supabaseFarmCrud.js`](./src/lib/supabaseFarmCrud.js)
