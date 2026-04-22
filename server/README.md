# HireFlow Backend

Production-grade Node.js + Express + MongoDB backend for HireFlow — a role-based job application portal.

## Stack
- Node.js (ES modules) + Express
- MongoDB + Mongoose
- JWT auth + bcrypt
- multer, express-validator, helmet, cors, morgan, cookie-parser, express-rate-limit

## Quick Start

```bash
cd server
cp .env.example .env
npm install
npm run seed     # seed demo data
npm run dev      # start on http://localhost:5000
```

## Environment Variables

| Name | Description |
|------|-------------|
| `PORT` | Server port (default 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | JWT signing secret |
| `JWT_EXPIRES_IN` | Token lifetime (default `7d`) |
| `CLIENT_URL` | Frontend origin for CORS |
| `NODE_ENV` | `development` \| `production` |

## Base URL

All endpoints are prefixed with `/api/v1`.

## Response Format

Success: `{ success: true, data, message? }`
Error:   `{ success: false, message, errors? }`

## Routes

### Auth `/auth`
| Method | Path | Access |
|--------|------|--------|
| POST | `/register` | Public |
| POST | `/login` | Public |
| GET  | `/me` | Authenticated |
| POST | `/logout` | Authenticated |
| PUT  | `/update-profile` | Authenticated |

### Users `/users`
| Method | Path | Access |
|--------|------|--------|
| GET  | `/:id` | Public |
| PUT  | `/:id` | Self or admin |
| GET  | `/` | Admin |

### Jobs `/jobs`
| Method | Path | Access |
|--------|------|--------|
| GET  | `/` | Public (filters: `search, location, jobType, experienceLevel, skills, minSalary, page, limit`) |
| GET  | `/:id` | Public (increments views) |
| POST | `/` | Recruiter / Admin |
| PUT  | `/:id` | Owner / Admin |
| DELETE | `/:id` | Owner / Admin |
| PATCH | `/:id/status` | Owner / Admin |
| POST | `/:id/save` | Candidate |
| GET  | `/my/posted` | Recruiter / Admin |
| GET  | `/my/saved` | Candidate |

### Applications `/applications`
| Method | Path | Access |
|--------|------|--------|
| POST | `/` | Candidate |
| GET  | `/my` | Candidate |
| GET  | `/job/:jobId` | Recruiter / Admin |
| PATCH | `/:id/status` | Recruiter / Admin |
| DELETE | `/:id` | Candidate |

### Notifications `/notifications`
| Method | Path | Access |
|--------|------|--------|
| GET  | `/` | Authenticated |
| PATCH | `/:id/read` | Authenticated |
| PATCH | `/read-all` | Authenticated |
| DELETE | `/:id` | Authenticated |

### Admin `/admin`
| Method | Path | Access |
|--------|------|--------|
| GET  | `/users` | Admin |
| PATCH | `/approve-recruiter/:id` | Admin |
| PATCH | `/ban-user/:id` | Admin |
| DELETE | `/job/:id` | Admin |
| GET  | `/analytics` | Admin |

## Seed Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@hireflow.com | Admin@123 |
| Recruiter | recruiter1@hireflow.com | Recruiter@123 |
| Recruiter | recruiter2@hireflow.com | Recruiter@123 |
| Candidate | candidate1@hireflow.com | Candidate@123 |
| Candidate | candidate2@hireflow.com | Candidate@123 |
| Candidate | candidate3@hireflow.com | Candidate@123 |

## Scripts

- `npm run dev` — start with nodemon
- `npm start` — production start
- `npm run seed` — reset DB and load demo data
