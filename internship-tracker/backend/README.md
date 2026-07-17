# Backend API

## Quick start (local)

1. **PostgreSQL** — use the installer on your machine, or `docker compose up -d` from the repo root.
2. **Create the database** (once), in pgAdmin or `psql`:
   ```sql
   CREATE DATABASE internship_tracker;
   ```
3. **Configure** — copy `.env.local.example` to `.env.local` and set your `postgres` password in `DATABASE_URL`.
4. **Run**:
   ```bash
   npm install
   npm start
   ```
5. Open `http://localhost:5000/health` — should return `{"ok":true,"database":true}`.

## Frontend

From `frontend/`, run `npm run dev`. The app calls `http://localhost:5000` when opened on localhost.

## Troubleshooting

| Symptom | Cause | Fix |
|--------|--------|-----|
| `Database schema init failed` + `ETIMEDOUT` | `backend/.env` uses a cloud DB (Neon) and port 5432 is blocked or unreachable | Use `backend/.env.local` with `localhost` (see above) |
| Signup shows **Network Error** | API never started (DB failed) or wrong port | Fix DB, run `npm start`, confirm `/health` |
| `password authentication failed` | Wrong password in `DATABASE_URL` | Update `.env.local` |
| `database "internship_tracker" does not exist` | DB not created | Run `CREATE DATABASE internship_tracker;` |

Cloud `DATABASE_URL` in `.env` is fine for deployment; for day-to-day dev on Windows, prefer `.env.local` pointing at local PostgreSQL.
