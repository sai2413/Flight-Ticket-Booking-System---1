# SkyRoute — Flight Ticket Booking System

A full-stack flight booking application built with the MERN stack (MongoDB, Express, React, Node.js).

Users can search flights, book tickets, and manage their bookings. Admins can manage flights, review all bookings, and see dashboard stats (total users, flights, and revenue).

---

## Tech Stack

| Layer          | Technology                                      |
|----------------|--------------------------------------------------|
| Frontend       | React 18, React Router v6, Axios, Tailwind CSS, Vite |
| Backend        | Node.js, Express.js                             |
| Database       | MongoDB + Mongoose                              |
| Auth           | JWT (JSON Web Tokens) + bcrypt password hashing |
| Notifications  | react-toastify                                  |

---

## Project Structure

```
flight-booking-system/
├── server/                 # Express + MongoDB API
│   ├── config/             # DB connection
│   ├── controllers/        # Route handler logic
│   ├── middleware/         # JWT auth, admin guard, error handling
│   ├── models/             # Mongoose schemas (User, Flight, Booking)
│   ├── routes/             # Express routers
│   ├── utils/              # Token generator, DB seed script
│   ├── app.js               # Express app setup
│   └── server.js            # Entry point
│
└── client/                 # React frontend
    └── src/
        ├── components/     # Navbar, FlightCard, BookingForm, etc.
        ├── pages/           # Route-level pages (incl. pages/admin)
        ├── layouts/         # MainLayout, DashboardLayout
        ├── context/         # AuthContext (global auth state)
        ├── hooks/           # useAuth
        ├── services/        # Axios API calls (auth, flights, bookings)
        ├── App.jsx
        └── main.jsx
```

---

## Prerequisites

- Node.js 18+ and npm
- MongoDB running locally (`mongodb://127.0.0.1:27017`) **or** a MongoDB Atlas connection string

---

## 1. Backend Setup

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env` if needed (defaults work for a local MongoDB instance):

```
MONGO_URI=mongodb://127.0.0.1:27017/flight_booking
PORT=5000
JWT_SECRET=super_secret_jwt_key_change_me
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

Seed the database with a demo admin account and 18 sample flights (optional but recommended):

```bash
npm run seed
```

This creates:
- **Admin login:** `admin@flightbooking.com` / `admin123`
- 18 random sample flights across major Indian cities

Start the API server:

```bash
npm run dev     # with nodemon (auto-restart)
# or
npm start       # plain node
```

The API will run at `http://localhost:5000`. Test it: `GET http://localhost:5000/api/health`.

> **Note:** The first user ever registered through `/api/auth/register` automatically becomes an **admin**. Every user after that registers as a normal `user`. If you ran the seed script, the admin account already exists, so subsequent sign-ups will be regular users.

---

## 2. Frontend Setup

Open a second terminal:

```bash
cd client
npm install
cp .env.example .env
```

`.env` defaults to pointing at the local API:

```
VITE_API_URL=http://localhost:5000/api
```

Start the dev server:

```bash
npm run dev
```

The app runs at `http://localhost:5173`.

---

## 3. Using the App

1. Visit `http://localhost:5173`.
2. Register a new account, or log in as the seeded admin (`admin@flightbooking.com` / `admin123`).
3. As a **user**: search flights on the homepage or `/search`, book a flight, view/edit/cancel bookings under **My Bookings**, and edit your info in **My Profile**.
4. As an **admin**: visit `/admin` for the dashboard, `/admin/flights` to add/edit/delete flights, and `/admin/bookings` to review and cancel any booking.

---

## API Reference

### Auth
| Method | Endpoint             | Access  | Description               |
|--------|-----------------------|---------|----------------------------|
| POST   | `/api/auth/register`  | Public  | Register a new user        |
| POST   | `/api/auth/login`     | Public  | Log in, returns JWT        |
| GET    | `/api/auth/profile`   | Private | Get logged-in user profile |
| PUT    | `/api/auth/profile`   | Private | Update name/phone/password |

### Flights
| Method | Endpoint            | Access       | Description                                  |
|--------|----------------------|--------------|-----------------------------------------------|
| GET    | `/api/flights`        | Public       | List/search flights (`source`, `destination`, `date`, `page`, `limit`, `sort`) |
| GET    | `/api/flights/:id`    | Public       | Get a single flight                            |
| POST   | `/api/flights`        | Admin only   | Create a flight                                |
| PUT    | `/api/flights/:id`    | Admin only   | Update a flight                                |
| DELETE | `/api/flights/:id`    | Admin only   | Delete a flight                                |

### Bookings
| Method | Endpoint             | Access  | Description                                             |
|--------|-----------------------|---------|-----------------------------------------------------------|
| GET    | `/api/bookings`       | Private | List bookings (own for users, all for admin; supports `status`, `search`, `page`, `limit`) |
| GET    | `/api/bookings/:id`   | Private | Get a single booking                                       |
| POST   | `/api/bookings`       | Private | Create a booking (validates & decrements seat availability) |
| PUT    | `/api/bookings/:id`   | Private | Update passenger details (admin can also change status)     |
| DELETE | `/api/bookings/:id`   | Private | Cancel a booking (restores seats to the flight)             |

### Admin
| Method | Endpoint          | Access     | Description                                    |
|--------|--------------------|------------|--------------------------------------------------|
| GET    | `/api/admin/stats` | Admin only | Total users, flights, confirmed bookings, revenue |

---

## Key Implementation Notes

- **Passwords** are hashed with bcrypt before being saved; the hash is never returned in API responses (`select: false` on the schema field).
- **JWT** tokens are issued on register/login and must be sent as `Authorization: Bearer <token>` on protected routes. The `protect` middleware verifies the token and attaches `req.user`; the `admin` middleware then restricts a route to admin users.
- **Seat availability** is enforced server-side using an atomic `findOneAndUpdate` (`availableSeats: { $gte: seats }`) so two users can't overbook the same seats even with simultaneous requests — no MongoDB replica set/transactions required.
- **Price calculation** (`price × seats`) happens on the server as the source of truth, and is also mirrored live in the booking form UI for instant feedback.
- **Cancelling** a booking restores the seats back to the flight's `availableSeats`.
- The **first registered user** becomes an admin automatically (convenience for local demos) — everyone after that is a regular user. In a real production app you'd instead manually promote admins in the database.

---

## Troubleshooting

- **"MongoDB Connected" never prints / connection error:** make sure `mongod` is running locally, or that `MONGO_URI` in `server/.env` points to a valid Atlas connection string.
- **CORS errors in the browser console:** confirm `CLIENT_URL` in `server/.env` matches the URL your frontend is actually running on.
- **401 errors right after logging in:** check that `VITE_API_URL` in `client/.env` points to your running backend, and that the browser clock isn't wildly out of sync (JWTs are time-sensitive).

---

## License

This project was generated as a learning/demo reference implementation. Free to use and modify.
