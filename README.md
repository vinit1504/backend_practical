# Workforce Pulse Analytics - Backend API

A high-performance, robust, and type-safe Node.js & Express backend API built with TypeScript and MongoDB. This backend processes employee data and activity logs, normalizes the datasets, runs advanced productivity/repetition analytics, provides AI-driven insight queries via Gemini API, and serves data to the Workforce Pulse Analytics frontend dashboard.

---

## 🌟 Key Features

* **Data Normalization & Join Engine**:
  * Seamless processing of multipart file uploads (CSV for activity logs, JSON for employee records).
  * Auto-cleaning of text strings, application names, and category names.
  * Validation of numeric parameters (duration, compensation rates) with fallbacks.
  * Automated data linking and filtering of orphan logs (logs referencing non-existent employee IDs).
* **Comprehensive Analytics Engine**:
  * **Summary KPI Metrics**: Computes total wasted/recoverable hours, recoverable INR savings, and identifies top-count repetitive task categories & departments.
  * **Weekly Trends**: Computes aggregate duration statistics grouped by year and ISO week.
  * **Departmental & App Breakdown**: Custom aggregation queries compiling total durations across apps and departments.
  * **Anomaly Detection**: Spots suspicious activity logs (e.g., sessions exceeding 10 hours in a single log).
* **AI Copilot & Query Assistant**:
  * Connects to the Gemini AI API to answer operational questions regarding time leaks, repetitive tasks, department breakdowns, and biggest time wasters.
  * Structured intent classification into `general` or `employee` queries.
* **Centralized Security & Logging**:
  * Role-Based Access Control (RBAC) with secure authorization rules.
  * Production-grade Winston Logger for tracking transactions, requests, and pipeline events.
  * Uniform error handling middleware capturing client issues and system failures gracefully.

---

## 🛠️ Technology Stack

* **Runtime & Framework**: Node.js, Express, TypeScript (v5+)
* **Database & ORM**: MongoDB, Mongoose
* **Logger & Utilities**: Winston, HTTP Status Codes, dotenv
* **Security & Auth**: JWT (JSON Web Tokens), bcryptjs
* **Development Tools**: Nodemon, ts-node, ESLint, Prettier

---

## 📂 Project Architecture

```text
src/
├── ai/                 # Gemini API integration & conversational query builders
├── analytics/          # MongoDB Aggregation pipelines for dashboard insights
├── config/             # Database connection, environment variables, & Winston logger configuration
├── constants/          # Application-wide message strings and Enum registries
├── controllers/        # Express handlers (Auth, Employee, Upload, AI, Dashboard)
├── database/           # Database scripts including seeder files
├── middleware/         # Security guards (auth, protect, roles), file upload handling, & error catchers
├── models/             # Mongoose schemas (User, Employee, ActivityLog)
├── parsers/            # Stream-based CSV and JSON file parsers
├── routes/             # App Router registers (auth, employee, upload, dashboard, ai)
├── services/           # Data cleaning, normalization, and relational join helper services
└── server.ts           # Application entrypoint
```

---

## 🔌 API Endpoints

All endpoints are prefixed with `/api`.

### 🔑 Authentication (`/auth`)
* `POST /auth/register` - Create a new administrative account.
* `POST /auth/login` - Authenticate admin and receive JWT token.

### 👥 Employees (`/employees`)
* `GET /employees` - Retrieve all employees (Supports pagination, search by name/department, and status filters).
* `POST /employees` - Create a new employee record.
* `GET /employees/:id` - Fetch a single employee's details.
* `PUT /employees/:id` - Update employee specifications.
* `DELETE /employees/:id` - Remove employee record.

### 📊 Dashboard Analytics (`/dashboard`)
*Supports filtering by timeframes via the `period` query parameter (e.g. `?period=last 7 days`, `?period=this month`, `?period=this quarter`)*.
* `GET /dashboard/summary` - General KPIs: recoverable hours, recoverable INR, top tasks, top departments.
* `GET /dashboard/departments` - Grouped wasted hours per department.
* `GET /dashboard/tasks` - Wasted hours vs repetitive hours per task category.
* `GET /dashboard/apps` - Sorted list of application usage durations.
* `GET /dashboard/trends` - Weekly time-leak logs grouped by year & ISO week.
* `GET /dashboard/anomalies` - Outliers with excessive durations (sessions > 10 hours).

### 📤 Uploads (`/upload`)
* `POST /upload/files` - Upload CSV logs and JSON employees files simultaneously. Clears and repopulates the collections.

### 🤖 AI Query Assistant (`/ai`)
* `POST /ai/chat` - Query Gemini API about employee productivity, biggest time wasters, and departmental inefficiencies.

---

## 🚀 Getting Started

### 1. Configure Environment Variables
Create a `.env` file in the root directory (based on `.env.example`):
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/workforce_pulse
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=24h
GEMINI_API_KEY=your_gemini_api_key
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Seed Database
Seed the initial default Administrator account (`admin@workforcepulse.com` / `password123`):
```bash
npm run seed
```

### 4. Start Development Server
```bash
npm run dev
```
The server will start on [http://localhost:5000](http://localhost:5000).

### 5. Build for Production
To compile typescript into production-ready Javascript:
```bash
npm run build
npm start
```
