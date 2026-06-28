# Auth Service

This service provides authentication and OAuth support for the PV Platform.

## Run locally

1. Copy `.env.example` to `.env`
2. Set `DATABASE_URL`, `JWT_SECRET`, and OAuth settings.
3. Install dependencies with `pnpm install`.
4. Start the service with `pnpm dev`.

## Endpoints

- `GET /` - health check
- `POST /api/auth/register` - register user
- `POST /api/auth/login` - login user
- `GET /api/oauth/github` - OAuth entry
- `GET /api/oauth/google` - OAuth entry
