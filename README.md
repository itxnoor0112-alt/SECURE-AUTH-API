# Secure Auth Microservice

A production-ready authentication and role-based access control (RBAC) microservice built with the MERN backend stack (Node.js, Express.js, MongoDB). This project was built as part of Week 6 of the internship program, covering JWT authentication, refresh tokens, route protection, RBAC, and API security hardening.

## Features

- User registration and login with hashed passwords (bcryptjs, salted, never stored in plain text)
- JWT access token generation and verification
- Refresh token flow for renewing expired access tokens
- `authenticate` middleware to protect routes using Bearer tokens
- `authorize(...roles)` middleware for role-based access control (RBAC)
- Rate limiting on authentication routes to prevent brute-force attacks
- Secured HTTP headers using Helmet
- Centralized error handling with proper HTTP status codes (400, 401, 403, 404, 409, 500)
- Postman collection included for quick API testing

## Tech Stack

- Node.js / Express.js
- MongoDB Atlas with Mongoose
- jsonwebtoken
- bcryptjs
- express-rate-limit
- helmet
- cors, dotenv

## Project Structure

```
secure-auth-api/
├── config/
│   └── db.js                 # MongoDB connection
├── controllers/
│   ├── authController.js     # Register, login, refresh token, get profile
│   └── adminController.js    # Admin-only resource logic
├── middleware/
│   ├── auth.js               # authenticate + authorize (RBAC)
│   ├── errorHandler.js       # Centralized error handling
│   └── rateLimiter.js        # Rate limiting for auth routes
├── models/
│   └── User.js                # User schema with password hashing
├── routes/
│   ├── authRoutes.js
│   └── adminRoutes.js
├── utils/
│   └── generateToken.js       # Access + refresh token generation
├── postman_collection.json
├── server.js
├── .env.example
└── package.json
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in your own values:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `PORT` | Port the server runs on (default: 5000) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret used to sign access tokens |
| `JWT_EXPIRES_IN` | Access token expiry (e.g. `15m`) |
| `JWT_REFRESH_SECRET` | Secret used to sign refresh tokens |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiry (e.g. `7d`) |

### 3. Run the server

```bash
npm run dev     # with nodemon
npm start        # production
```

The API will be available at `http://localhost:5000`.

## API Endpoints

### Auth Routes (`/api/auth`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Register a new user |
| POST | `/login` | Public | Login and receive access + refresh tokens |
| POST | `/refresh-token` | Public | Get a new access token using a valid refresh token |
| GET | `/me` | Protected | Get the logged-in user's profile |

### Admin Routes (`/api/admin`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/users` | Admin only | Get a list of all registered users |

## Authentication Flow

1. User registers with name, email, and password. The password is hashed using bcrypt before it's saved.
2. User logs in with email and password. On success, the server returns a short-lived **access token** and a longer-lived **refresh token**.
3. The access token is sent in the `Authorization` header as `Bearer <token>` on protected requests.
4. The `authenticate` middleware verifies the token and attaches the user to `req.user`.
5. The `authorize(...roles)` middleware checks `req.user.role` against the allowed roles for that route.
6. When the access token expires, the client can call `/api/auth/refresh-token` with the refresh token to get a new access token without logging in again.

## Error Handling

| Status Code | Meaning |
|---|---|
| 400 | Bad request / validation error |
| 401 | Unauthorized — missing, invalid, or expired token |
| 403 | Forbidden — valid token but insufficient role |
| 404 | Route not found |
| 409 | Conflict — duplicate email on registration |
| 500 | Internal server error |

## Testing the API

A ready-to-use Postman collection is included: `postman_collection.json`. Import it into Postman or Bruno, set the `accessToken` and `refreshToken` collection variables after login, and test each endpoint.

## Security Measures Implemented

- Passwords are never stored in plain text — hashed with bcrypt (salt rounds: 10)
- Access tokens are short-lived to reduce the impact of token leakage
- Refresh tokens use a separate secret from access tokens
- `helmet` sets secure HTTP headers by default
- `express-rate-limit` restricts repeated requests to auth endpoints (10 requests / 15 minutes per IP)
- Sensitive fields (like `password`) are excluded from query results by default using `select: false`

## Author

Internship Project — Week 6: Authentication, Authorization & Production Readiness
