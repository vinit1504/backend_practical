# Workforce Pulse Analytics - Backend API & Product Spec

A robust Node.js, Express, and MongoDB backend built with TypeScript. This service processes, cleans, normalizes, and aggregates employee directories and activity logs to reveal organizational efficiency leaks.

---

## 📖 Product Specification & Design Decisions

### 1. File Structure Assumptions

- **Employee Dataset (JSON)**:
  - Expected to contain a unique identifier key under variations like `employee_id`, `EmployeeID`, or `id`.
  - Expected to contain compensation figures in varying schemas: `hourly_rate_inr` (hourly workers), `salary_LPA` / `annual_ctc_inr` / `meta.compensation.annual` (salaried employees).
  - Working hours can be numbers, text-ranges (e.g., `"9-17"`), or nested structures (e.g., `{ start: "09:00", end: "18:00" }`).
- **Activity Log Dataset (CSV)**:
  - Expected to log individual events with columns matching: `employee_id`, `department`, `app_used`, `task_category`, `duration_minutes`, `timestamp`, and `is_repetitive`.

### 2. Join Strategy & Conflict Resolution

- **Join execution**:
  1. I normalize and clean the Employee records first, mapping keys to a strict, standard schema.
  2. I build an in-memory `Map` of employee profiles keyed by their normalized `employee_id`.
  3. I ingest and normalize the Activity Logs, then filter out any "orphan" logs whose `employee_id` does not exist in my Employee Map to maintain strict referential integrity.
- **Conflict Resolution**:
  - **Duplicate Employees**: If duplicate employee records are found, the system keeps the latest record.
  - **Duplicate Logs**: Logs containing the same employee, app, and timestamp are flagged as duplicates and discarded to prevent double-counting.

### 3. Analytics Formulas

- **Recoverable Hours**:
  $$\text{Recoverable Hours} = \frac{\sum (\text{duration\_minutes} \text{ where } \text{is\_repetitive} = \text{true})}{60}$$
- **Recoverable INR (Savings)**:
  $$\text{Recoverable INR} = \text{Recoverable Hours} \times 500\text{ INR/hour}$$
  _(A normalized baseline hourly conversion rate of ₹500 is applied, representing estimated business cost recovery)_
- **Rankings (Top Tasks & Departments)**:
  Aggregated counts of repetitive logs grouped by category and department using MongoDB aggregation stages `$group`, `$sort`, and `$limit`.

### 4. Anomaly Detection Approach

- The backend currently flags outlier logs where `duration_minutes > 600` (sessions exceeding 10 hours in a single activity log). This highlights potential tracking malfunctions, system hangs, or forgotten logouts.

### 5. What Was Cut & Why

- **Real-time File Processing Queue**: I opted for direct streaming/parsing in-memory instead of a message broker (e.g., BullMQ/Redis) to avoid local system dependency overhead and support serverless execution on Vercel.
- **Granular Salary-to-Savings Correlation**: I utilized a flat hourly rate for INR calculations instead of individual contract conversions due to currency inconsistencies and missing conversion data.

### 6. Two-Day Extension Roadmap

1. **Redis Caching**: Integrate Redis caching to store aggregated dashboard queries and speed up trend loads.
2. **Simple Email Notifications**: Implement basic email alerts using Nodemailer to dispatch weekly PDF logs to admins.

---

## 🛠️ Technology Stack

- **Runtime/Framework**: Node.js, Express, TypeScript (v5+)
- **Database/ORM**: MongoDB, Mongoose
- **Logging/Utilities**: Winston, HTTP Status Codes, dotenv
- **Security/Auth**: JWT, bcryptjs

---

## 🔌 API Endpoints

- **Authentication (`/api/auth`)**: `POST /login`, `POST /register`
- **Employees (`/api/employees`)**: `GET /`, `POST /`, `GET /:id`, `PUT /:id`, `DELETE /:id`
- **Dashboard (`/api/dashboard`)**:
  _Supports `period` parameter (e.g. `?period=last 7 days`, `?period=this month`, `?period=this quarter`)_.
  - `GET /summary` - General KPIs: recoverable hours, recoverable INR, top tasks/depts.
  - `GET /departments` - Wasted hours breakdown per department.
  - `GET /tasks` - Repetitive hours vs total hours per task category.
  - `GET /apps` - Usage durations per application.
  - `GET /trends` - Weekly time-leak logs.
  - `GET /anomalies` - Excessive log sessions.
- **Uploads (`/api/upload`)**: `POST /files` - Ingest CSV/JSON files.
- **AI Copilot (`/api/ai`)**: `POST /chat` - Gemini AI productivity query engine.
- **Health Check (`/api/health`)**: `GET /` - Uptime status check.

---

## 🚀 Getting Started

1. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/workforce_pulse
   JWT_SECRET=your_secret_key
   GEMINI_API_KEY=your_key
   ```
2. **Install Dependencies**: `npm install`
3. **Seed Administrative User**: `npm run seed` _(Generates admin@workforcepulse.com / password123)_
4. **Start local Server**: `npm run dev`
