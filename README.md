# HealthBridge - Medical Records Management System

A full-stack application for managing medical records with role-based access for patients, doctors, and hospitals.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, React Router
- **Backend:** Express.js, Prisma (PostgreSQL), JWT Authentication
- **SMS:** Twilio for OTP verification

## Project Structure

```
healthbridge/
├── backend/           # Express.js API server
│   ├── src/
│   │   ├── index.js          # Main server entry
│   │   ├── routes/           # API route handlers
│   │   ├── prismaClient.js   # Database client
│   │   └── utils/            # Utility functions
│   ├── prisma/               # Database schema & migrations
│   └── .env                  # Environment variables
│
└── frontend/          # React + Vite frontend
    ├── src/
    │   ├── pages/            # Page components
    │   ├── components/       # Reusable components
    │   ├── services/         # API service functions
    │   └── utils/            # Utility functions
    └── vite.config.js
```

---

## Prerequisites

- Node.js (v18+)
- PostgreSQL database
- Twilio account (for SMS OTP)

---

## Getting Started

### 1. Backend Setup

Navigate to the backend directory and install dependencies:

```
bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory with the following variables:

```
env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/healthbridge?schema=public"

# JWT
JWT_SECRET=your_jwt_secret_key

# Twilio (for SMS OTP)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Server
PORT=5050
```

Run database migrations:

```
bash
npx prisma migrate deploy
```

Start the backend server:

```
bash
node src/index.js
```

The backend will run on **http://localhost:5050**

---

### 2. Frontend Setup

Open a new terminal and navigate to the frontend directory:

```
bash
cd frontend
npm install
```

Start the development server:

```
bash
npm run dev
```

The frontend will run on **http://localhost:5173**

---

## Running Both Services

Open two separate terminal windows:

**Terminal 1 - Backend:**
```
bash
cd backend
node src/index.js
```

**Terminal 2 - Frontend:**
```
bash
cd frontend
npm run dev
```

---

## API Endpoints

### Authentication
- `POST /auth/login/send-otp` - Send OTP for login
- `POST /auth/login/verify-otp` - Verify OTP and login
- `POST /auth/signup/send-otp` - Send OTP for signup
- `POST /auth/signup/verify-otp` - Verify OTP and signup

### Doctor
- `POST /doctor/login/send-otp` - Doctor login OTP
- `POST /doctor/login/verify-otp` - Verify doctor OTP

### Hospital
- `POST /hospital/signup` - Hospital registration
- `POST /hospital/create-doctor` - Create doctor account

### Medical Records
- `GET /medical/my-records` - Get patient's records
- `POST /medical` - Add medical record

### Access Control
- `POST /access/request` - Request access to patient records
- `POST /access/respond` - Respond to access request

### Profile
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile

---

## License

ISC
