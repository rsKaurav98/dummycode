# Dummy React + Lambda-Style Node App

This repo contains:

- `frontend/`: a Vite React app
- `backend/`: a Node server that invokes Lambda-style handlers instead of using Express

## Run locally

Install dependencies from the repo root:

```powershell
npm install
```

Start the backend:

```powershell
npm run dev:backend
```

Start the frontend in a second terminal:

```powershell
npm run dev:frontend
```

Then open the frontend URL printed by Vite, usually `http://localhost:5173`.

The frontend calls `GET /api/hello`, which is proxied to the Node backend and handled by `backend/src/lambdas/hello.js`.
