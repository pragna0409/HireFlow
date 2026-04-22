# HireFlow — Deployment Guide (All Vercel)

Both frontend and backend deploy together on Vercel. No Render, no Railway.

- **Frontend**: Vite React app in `client/` → built to `client/dist` → served as static.
- **Backend**: Express app in `server/` → wrapped by `api/index.js` → runs as a Vercel Serverless Function at `/api/*`.
- **Database**: MongoDB Atlas (already connected).

Live URL: https://hire-flow-nine.vercel.app

---

## 1. MongoDB Atlas

Current URI (in `server/.env` for local dev):

```
MONGO_URI=mongodb+srv://hireflow:hireflow123@hireflow.zqa1alr.mongodb.net/hireflow?retryWrites=true&w=majority&appName=hireflow
```

✅ Verified connected. Collections: `users`, `jobs`, `applications`, `notifications`.

### Do this now
1. Atlas → **Network Access** → add `0.0.0.0/0` (so Vercel's serverless IPs can reach Atlas).
2. Atlas → **Database Access** → **rotate the password** (the current one was shared in chat).
3. Update `MONGO_URI` in both `server/.env` (local) and Vercel env vars (prod) after rotation.

---

## 2. Deploy to Vercel

### Project structure Vercel will see
```
/                       (repo root)
├── api/index.js        → serverless function for /api/*
├── client/             → Vite app (built to client/dist)
├── server/             → Express app (imported by api/index.js)
├── package.json        → root deps for serverless + build script
└── vercel.json         → routing + build config
```

### One-time Vercel dashboard setup
1. Push the repo to GitHub.
2. https://vercel.com → **New Project** → import the GitHub repo.
3. **Settings → General**:
   - **Root Directory**: `./` (leave as repo root — `vercel.json` handles the rest)
   - **Framework Preset**: Other
   - **Build / Output / Install**: leave empty — `vercel.json` overrides
4. **Settings → Environment Variables** (all three environments: Production, Preview, Development):

   | Key              | Value                                                                            |
   |------------------|----------------------------------------------------------------------------------|
   | `MONGO_URI`      | your Atlas URI (after password rotation)                                         |
   | `JWT_SECRET`     | the strong 96-char value already in `server/.env`                                |
   | `JWT_EXPIRES_IN` | `20d`                                                                            |
   | `CLIENT_URL`     | `https://hire-flow-nine.vercel.app`                                              |
   | `NODE_ENV`       | `production`                                                                     |

   ⚠️ Do **not** set `VITE_API_URL` — the client defaults to `/api/v1` (same origin), which is what we want.

5. **Deployments → Redeploy** with **"Use existing Build Cache" unchecked**.

### What happens during deploy
1. Vercel runs `npm install` at repo root → installs server deps (express, mongoose, etc.).
2. Vercel runs `cd client && npm install && npm run build` → outputs `client/dist/`.
3. Vercel detects `api/index.js` → packages it as a Serverless Function.
4. `vercel.json` rewrites:
   - `/api/*` → serverless function
   - everything else → `index.html` (SPA routing)

### Verify after deploy
- https://hire-flow-nine.vercel.app → loads the landing page
- https://hire-flow-nine.vercel.app/api/v1/health → `{ "success": true, "message": "HireFlow API is running" }`
- https://hire-flow-nine.vercel.app/login → loads (no 404)
- Try logging in with seeded credentials (see section 3)

---

## 3. Seed demo data

Run once, locally:

```bash
cd server
npm install
npm run seed
```

Demo accounts:
- **Admin**: `admin@hireflow.com` / `Admin@123`
- **Recruiter**: `recruiter1@hireflow.com` / `Recruiter@123`
- **Candidate**: `candidate1@hireflow.com` / `Candidate@123`

---

## 4. Local development

```bash
# terminal 1 — API
cd server
npm install
npm run dev                # runs on :5000

# terminal 2 — client
cd client
npm install
npm run dev                # runs on :5173
```

Open http://localhost:5173. Vite proxies `/api/*` → `http://localhost:5000` automatically (see `client/vite.config.js`). No env vars needed on the client side for local dev.

---

## 5. Notes on serverless limitations

| Feature | Status |
|---------|--------|
| Auth / JWT / cookies | ✅ Works |
| All REST endpoints | ✅ Works |
| MongoDB Atlas | ✅ Works (connection cached across warm invocations) |
| File uploads (multer disk) | ⚠️ Files go to `/tmp/` and vanish between invocations. The app already supports passing `resumeUrl` as a string — use that path in prod, or swap to Cloudinary/S3 later. |
| Rate limiting (in-memory) | ⚠️ Per-Lambda, not global. Fine for demo. Swap to Redis store for real traffic. |
| `/uploads/*` static serving | ❌ Won't serve files on Vercel. Again: use external URLs. |

---

## 6. Troubleshooting

| Symptom | Fix |
|---------|-----|
| `404 NOT_FOUND` on landing page | Root `vercel.json` missing or Root Directory set wrong. Leave Root Directory = `./` and ensure `vercel.json` is at repo root. |
| `500` on `/api/v1/health` | Check Vercel → Logs. Usually missing `MONGO_URI` env var. |
| `CORS` error in browser | Ensure `CLIENT_URL` env var on Vercel matches the exact deployed URL (no trailing slash). |
| `MongoServerSelectionError` | Atlas Network Access must include `0.0.0.0/0`. |
| `Function timeout` on first request | Cold start + DB handshake. `vercel.json` sets `maxDuration: 30`. Subsequent requests are warm and fast. |
| Frontend loads but login POST fails | Open DevTools → Network → check the request goes to `/api/v1/auth/login` (relative, same origin). If it points to `localhost:5000`, clear `VITE_API_URL` from Vercel env vars and redeploy. |
