# CipherSQLStudio

> A browser-based SQL learning platform where students can practice SQL queries against pre-configured assignments with real-time execution and intelligent AI hints.

---

## 🚀 Tech Stack

| Component | Technology |
|-----------|-----------|
| Frontend | React 18 + Vite |
| Styling | Vanilla SCSS (BEM) |
| Code Editor | Monaco Editor |
| Backend | Node.js + Express.js |
| Sandbox DB | PostgreSQL |
| Persistence DB | MongoDB Atlas |
| LLM | Google Gemini API |
| Auth | JWT + bcryptjs |

---

## 📁 Project Structure

```
CipherSQLStudio/
├── backend/
│   ├── src/
│   │   ├── config/          # DB connections (MongoDB + PostgreSQL)
│   │   ├── models/          # Mongoose models (Assignment, User, UserProgress)
│   │   ├── routes/          # Express routes (assignments, query, hint, auth, progress)
│   │   ├── middleware/       # SQL sanitizer, JWT auth
│   │   ├── services/        # postgresService.js, llmService.js
│   │   └── seed/            # Assignment seeder
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/      # Navbar
    │   ├── pages/           # AssignmentsPage, AttemptPage, AuthPage
    │   ├── services/        # api.js (Axios)
    │   ├── context/         # AuthContext
    │   └── styles/          # SCSS partials (_variables, _mixins, _global)
    ├── .env.example
    └── package.json
```

---

## ⚙️ Setup Instructions

### 1. Prerequisites

- **Node.js** v18+ ([nodejs.org](https://nodejs.org))
- **PostgreSQL** v14+ (see [PostgreSQL Setup](#postgresql-setup) below)
- **MongoDB Atlas** account ([mongodb.com/atlas](https://www.mongodb.com/atlas))
- **Google Gemini API Key** ([aistudio.google.com](https://aistudio.google.com))

### 2. Clone / Open the Project

```bash
git clone https://github.com/Satish-Saha/ciphersqlstudio.git
cd ciphersqlstudio
```

### 3. Backend Setup

```bash
cd backend

# Copy and fill in your environment variables
copy .env.example .env
# Edit .env with your credentials (see Environment Variables section)

# Install dependencies
npm install

# Seed sample assignments into MongoDB
npm run seed

# Start the development server
npm run dev
# Server runs at http://localhost:5000
```

### 4. Frontend Setup

```bash
cd frontend

# Copy env file
copy .env.example .env
# (default: VITE_API_URL=http://localhost:5000/api — no changes needed for local dev)

# Install dependencies
npm install

# Start the dev server
npm run dev
# App runs at http://localhost:5173
```

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000
NODE_ENV=development

# MongoDB Atlas
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/ciphersqlstudio

# PostgreSQL
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=yourpassword
POSTGRES_DB=ciphersqlstudio

# JWT
JWT_SECRET=your_super_secret_jwt_key

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🐘 PostgreSQL Setup

### Step 1: Install PostgreSQL

1. Go to [postgresql.org/download/windows](https://www.postgresql.org/download/windows/)
2. Download and run the installer
3. **Installation settings:**
   - Default port: **5432**
   - Set a password for the `postgres` user (remember this!)
   - Install pgAdmin 4 (optional, useful GUI)

### Step 2: Create the Database

After installation, open **SQL Shell (psql)** or pgAdmin and run:

```sql
CREATE DATABASE ciphersqlstudio;
```

Or via command line:
```bash
psql -U postgres -c "CREATE DATABASE ciphersqlstudio;"
```

### Step 3: Update `.env`

Set your `POSTGRES_PASSWORD` in `backend/.env` to the password you chose during installation.

The app automatically creates isolated **schemas** (e.g., `workspace_abc12345`) for each assignment when a query is executed — no manual table creation needed!

---

## 🌱 Seeding Data

Run once after setting up MongoDB:

```bash
cd backend
npm run seed
```

This creates 6 sample assignments:
1. 🟢 **Basic SELECT Query** — retrieve all records
2. 🟢 **Filter with WHERE** — filter by department
3. 🟡 **Aggregate Functions** — COUNT, AVG, GROUP BY
4. 🟡 **JOIN Operations** — combine customers, products, orders
5. 🔴 **Subquery Challenge** — correlated subqueries
6. 🔴 **Window Functions** — RANK() with PARTITION BY

---

## 🏗️ Architecture

```
User → React Frontend → Express API → PostgreSQL (query sandbox)
                      ↕                    ↕
                   MongoDB            Gemini LLM
                (assignments,         (hint API)
                 user progress)
```

**PostgreSQL Sandboxing:** Each assignment gets an isolated schema (`workspace_<id_suffix>`). The schema is created fresh on each execute call, so students always start with clean data. Only `SELECT` and `WITH` queries are permitted.

---

## 🔒 Security

- **SQL Sanitizer**: Blocks `DROP`, `DELETE`, `UPDATE`, `INSERT`, `ALTER`, `TRUNCATE`, `CREATE` and SQL comment injection
- **Query Isolation**: Each assignment runs in its own PostgreSQL schema
- **JWT Auth**: Secure token-based authentication
- **CORS**: Restricted to configured `CLIENT_URL`

---

## 📌 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/assignments` | List all assignments |
| GET | `/api/assignments/:id` | Get assignment detail |
| POST | `/api/query/execute` | Execute SQL query |
| POST | `/api/hint` | Get AI hint |
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/progress/:assignmentId` | Get user progress |
| POST | `/api/progress/save` | Save progress |

---

## 📱 Responsive Breakpoints (Mobile-First)

| Breakpoint | Width | Layout |
|-----------|-------|--------|
| Mobile | 320px | Single column, stacked panels |
| Tablet | 641px | 2-column cards, side nav visible |
| Desktop | 1024px | Side-by-side attempt layout |
| Wide | 1281px | 4-column assignment grid |
