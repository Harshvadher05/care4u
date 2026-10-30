# Care4U — Hospital Booking & Healthcare Management System

Care4U is an enterprise-grade hospital management and online doctor consultation platform built with Node.js, Express, TypeScript, Prisma, MySQL/MariaDB, and EJS with Tailwind CSS.

---

## 🏥 Architecture Overview

Care4U features a decoupled architecture with a TypeScript API microservice backend and an Express SSR frontend.

```
care4u/
├── backend/                  # RESTful API Service (Express + TypeScript + Prisma)
│   ├── prisma/               # Prisma configuration and root schema
│   ├── src/
│   │   ├── common/           # Shared handlers, helpers, queues, and Zod schemas
│   │   ├── config/           # Database, Redis, and ImageKit configurations
│   │   ├── databases/        # Multi-file Prisma schemas and generated models
│   │   ├── middlewares/      # Auth, permission, upload, and error middleware
│   │   ├── modules/          # 17 Feature modules (Auth, Doctor, Patient, etc.)
│   │   ├── routes/           # Centralized API route dispatchers
│   │   └── index.ts          # Server entry point
│   └── package.json
│
├── frontend/                 # Server-Side Rendered Web App (Express + EJS)
│   ├── middleware/           # Cookie-based auth and route guards
│   ├── modules/              # Role-specific route modules
│   ├── public/               # Client-side scripts, styles, and assets
│   ├── views/                # EJS templates grouped by user role
│   ├── app.js                # Express application configuration
│   ├── server.js             # Web server entry point
│   └── package.json
└── README.md
```

---

## 👥 Supported User Roles

1. **Patient**:
   - Browse hospitals and doctors by specialty and location
   - Book online and in-person appointments
   - Manage appointments, view prescriptions, and complete payments via UPI/Card
2. **Doctor**:
   - Manage schedules, consult slots, and upcoming leave requests
   - Attend scheduled video consultations (Zoom integration)
   - Issue prescriptions and track monthly consultation earnings
3. **Staff**:
   - Hospital front desk operations: register walk-in patients and book appointments
   - Collect consultation fees and view clinic billing summaries
4. **Admin**:
   - Branch hospital administration: manage doctors, schedules, and staff credentials
5. **Super Admin**:
   - System-wide hospital group directory, onboarding, and platform analytics

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **MariaDB / MySQL**: v10.5+ / v8.0+
- **Redis**: v6.0+ (used for OTP storage and BullMQ background task workers)

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.sample .env       # Configure DATABASE_URL, JWT secrets, Redis, and ports
npx prisma generate
npm run dev               # Starts API server on http://localhost:3004
```

### 2. Frontend Setup
```bash
cd frontend
npm install
cp .env.sample .env       # Set PORT=5151 and API_BASE_URL=http://localhost:3004/api/v1
npm run dev               # Starts Web portal on http://localhost:5151
```

---

## 🛡️ Security Features
- **Argon2 Password Hashing**: Cryptographically secure against GPU-based cracking attacks.
- **JWT Authentication with Refresh Rotation**: Short-lived access tokens (15m) paired with Redis-backed refresh token rotation.
- **Role-Based Access Control (RBAC)**: Enforced both on API routes (`checkPermission`) and frontend views (`roleGuard`).
- **Input Validation**: Strict schema enforcement using Zod across all input payloads.
- **Sanitized Logging**: All authentication tokens, passwords, and payment CVVs are strictly withheld from console logs.

---

## 📄 License
This project is licensed under the ISC License.
