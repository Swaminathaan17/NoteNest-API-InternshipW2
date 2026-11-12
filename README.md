# NoteNest API — Secure Notes Backend

A JWT-secured REST API for personal note management, built with Node.js, Express, MongoDB, and Mongoose. Week 2 internship mini project.

## Features
- User registration and login with bcrypt password hashing
- JWT-protected note endpoints
- Full CRUD: create, list, fetch, update, delete
- Per-user ownership isolation on every note query
- Input validation and consistent JSON errors
- Helmet security headers, configurable CORS, authentication rate limiting

## Setup
1. Install Node.js 18.18+ and MongoDB (local or Atlas).
2. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/Swaminathaan17/NoteNest-API-InternshipW2.git
   cd NoteNest-API-InternshipW2
   npm install
   ```
3. Copy `.env.example` to `.env` and configure `MONGO_URI` and a random `JWT_SECRET` (at least 32 characters).
4. Start: `npm run dev`. Production: `npm start`. Tests: `npm test`.

## Environment
| Variable | Purpose | Default |
|---|---|---|
| PORT | HTTP port | 5000 |
| MONGO_URI | MongoDB connection string | Required |
| JWT_SECRET | JWT signing secret (32+ chars) | Required |
| JWT_EXPIRES_IN | Token lifetime | 1d |
| CLIENT_ORIGIN | Allowed origin(s), comma-separated | * |
| NODE_ENV | Runtime mode | development |

## API

Authentication:
| Method | Endpoint | Purpose |
|---|---|---|
| POST | /api/auth/register | Register account |
| POST | /api/auth/login | Login and receive token |

Notes (all require `Authorization: Bearer <token>`):
| Method | Endpoint | Purpose |
|---|---|---|
| POST | /api/notes | Create note |
| GET | /api/notes | List your notes |
| GET | /api/notes/:id | Get one of your notes |
| PATCH | /api/notes/:id | Update title and/or content |
| DELETE | /api/notes/:id | Delete one of your notes |

Register JSON: `{"name":"Alex","email":"alex@example.com","password":"StrongPass123"}`

Login JSON: `{"email":"alex@example.com","password":"StrongPass123"}`

Create note JSON: `{"title":"Ideas","content":"Build something useful."}`

Update accepts either or both fields: `{"title":"Updated title"}`.

## Security
Passwords are hashed and never returned. JWT middleware verifies each protected request. Every note read/update/delete query includes the authenticated user's ID, preventing cross-account access. Secrets are environment variables; auth endpoints are rate-limited.

## Scripts
- `npm run dev` — nodemon development server
- `npm start` — production server
- `npm test` — automated API tests

## License
MIT
