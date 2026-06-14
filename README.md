# Dev Blog Project

**Simple Node.js + Express + PostgreSQL blog app** used for class practice and extended with edit/delete ownership, CSRF protection, flash messages, and sorting.

**Quick Summary**
- Server: Express (EJS views)
- Database: PostgreSQL (via `pg`)
- Auth: JWT in an HTTP-only cookie
- CSRF: `csurf` with cookie-based tokens
- Flash: `connect-flash` for user messages
- Sessions: `express-session` for flash middleware

**Files of interest**
- **Controller**: [controller/postController.js](controller/postController.js)
- **Models**: [models/PostModel.js](models/PostModel.js), [models/UserModel.js](models/UserModel.js)
- **Routes**: [routes/postRoutes.js](routes/postRoutes.js), [routes/userRoutes.js](routes/userRoutes.js)
- **Views**: [views/index.ejs](views/index.ejs), [views/edit-post.ejs](views/edit-post.ejs), [views/create-post.ejs](views/create-post.ejs), [views/login.ejs](views/login.ejs), [views/register.ejs](views/register.ejs), [views/partials/header.ejs](views/partials/header.ejs)
- **DB schema**: [blog.sql](blog.sql)
- **Helpers / scripts**: `scripts/cleanup_test_data.js`, `scripts/delete_tmpuser.js`

**Prerequisites**
- Node.js (v18+ recommended)
- PostgreSQL server
- `npm` available

**Environment (.env)**
Create a `.env` file in the project root with the following variables:

- `DB_USER` (e.g. `postgres`)
- `DB_HOST` (e.g. `localhost`)
- `DB_PORT` (e.g. `5432`)
- `DB_DATABASE` (database name)
- `DB_PASSWORD` (database password)
- `JWT_SECRET` (strong secret for JWT signing)
- `SESSION_SECRET` (strong secret for express-session)
- `PORT` (optional, defaults to 5000)

Note: `SESSION_SECRET` and `JWT_SECRET` must be strong and kept secret in production.

**Install**

```bash
npm install
```

**Run (development)**

```bash
npm run dev
```

The server will start on `http://localhost:5000` by default.

**Database setup**
- Use the SQL in [blog.sql](blog.sql) to create tables (users, posts) and foreign key.
- Ensure the DB credentials in `.env` match your Postgres instance.

**Primary routes**
- `GET /api/posts` — list posts (supports query params `sortBy=recent|creator` and `sortOrder=asc|desc`)
- `GET /api/posts/create` — form to create a post (requires login)
- `POST /api/posts` — create a post (requires login, CSRF token required)
- `GET /api/posts/:id/edit` — edit form for a post (requires login + ownership)
- `POST /api/posts/:id/edit` — update post (requires login + ownership, CSRF)
- `POST /api/posts/:id/delete` — delete post (requires login + ownership, CSRF)

- `GET /api/users/register` — registration page
- `POST /api/users/register` — register (creates JWT cookie)
- `GET /api/users/login` — login page
- `POST /api/users/login` — login (creates JWT cookie)
- `POST /api/users/logout` — logout (clears token cookie; CSRF-protected)

**Security summary**
- Ownership checks in controller prevent non-creators from editing/deleting posts.
- `updated_when` column is set on updates (see `models/PostModel.js`).
- JWT is stored in an HTTP-only cookie. `SESSION_SECRET` must be set for session/flash security.
- CSRF tokens are required for state-changing POST forms (logout, create, edit, delete).

**UX & features**
- Flash messages are shown on the index page (dark theme: black background / white text).
- Header shows `username (ID)` and a POST logout button.
- Posts show `Posted by <username> (ID: #)` now.
- Sorting controls allow `Recent` or `User ID` sorting with clear labels.

**Maintenance scripts**
- `node scripts/cleanup_test_data.js` — deletes users with `testuser` in their email and known test posts.
- `node scripts/delete_tmpuser.js` — deletes the `tmpuser@example.com` user used during testing.

Group members
*Nobel Alemayehu 164//BSC-B6/2023
*Nahom Hailu 158/BSC-B6/2023
*Nahom Mulugeta 166/BSC-B6/2024
*Mohammed Abduljelil 012/BSC-B6/2024
*YEABKAL WONDWOSON 163/BSC-B6/2023