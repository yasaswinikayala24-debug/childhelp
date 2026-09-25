# ChildHelp — One Platform for Children’s Education & Support

ChildHelp is a comprehensive full-stack web application designed to empower children and students with free educational resources, interactive quizzes, learning analytics, goal tracking, mentor assistance, and scholarship opportunities.

---

## 🌟 Key Features

### 1. 📚 Smart Study Materials
- **Comprehensive Library:** Access textbooks, practice sheets, articles, and video tutorials.
- **Search & Filter:** Filter by Subject (Math, Science, English, Programming), Class Level (Grades 6–10), Format (PDF, Video, Article, Link), and Difficulty (Beginner, Intermediate, Advanced).
- **Interactive Detail View:** Est. learning time counter, active study session timer, personal saved notes, and downloadable resource links.

### 2. 📝 Interactive Subject Quizzes
- **Multiple Choice Assessments:** Subject-specific quizzes (Python, Science, Mathematics) with questions and options.
- **Backend Score Calculation:** Scores, percentages, and total questions evaluated securely on the backend.
- **Instant Result Feedback:** Displays score breakdown, accuracy percentage, and congratulatory feedback.

### 3. 📊 Learning Analytics & Progress Tracking (`/my-progress`)
- **Student History:** View completed quiz logs, attempt dates, scores, and accuracy percentages.
- **Performance Overview:** Instant calculation of total quizzes completed, overall average score percentage, and best score.
- **Student Isolation:** Strict role-based protection ensuring students only view their own private progress data.

### 4. 🧠 Smart Learning Hub (`/my-learning`)
- **Goal Setting:** Add, complete, and track custom academic learning goals with target deadlines.
- **Study Session Tracker:** Track total study minutes, total study sessions, and daily streak counts.
- **Bookmarks & Saved Notes:** Quick access to saved materials and notes across devices.

### 5. 🔐 Authentication & Roles
- **JWT & Bcrypt:** Secure user registration, password hashing with bcrypt, and JWT authentication tokens.
- **Role-Based Access Control:** Pre-configured support for **Student**, **Mentor**, and **Admin** accounts.

---

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite, React Router DOM v6, Axios, Vanilla CSS Design System with responsive grid/flex layouts.
- **Backend:** Node.js, Express.js, JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, `cors`, `dotenv`.
- **Database:** MongoDB & Mongoose ORM (with automatic resilient in-memory fallback for offline/local execution).
- **Deployment:** Vercel (Frontend SPA static output + Node.js Serverless Functions for Express API).

---

## 🚀 Environment Variables

### Backend (`/backend/.env` or Vercel Environment Variables):
```env
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/childhelp?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
CLIENT_URL=https://your-vercel-domain.vercel.app
```

### Frontend (`/frontend/.env`):
```env
VITE_API_URL=http://localhost:5000
```
*(In production on Vercel, leave `VITE_API_URL` empty or set it to your deployed API domain so relative calls use the single-origin serverless routing).*

---

## 💻 Local Setup & Execution

### Prerequisites
- **Node.js:** v18+ or v20+
- **npm:** v9+

### 1. Clone & Install Dependencies
```bash
# Clone the repository
git clone <repository-url>
cd "FSD project"

# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### 2. Start Local Servers

#### Terminal 1 (Backend API Server):
```bash
cd backend
npm run dev
# Server will run at http://localhost:5000
```

#### Terminal 2 (Frontend React App):
```bash
cd frontend
npm run dev
# Web app will run at http://localhost:3000
```

---

## ☁️ Vercel Deployment

This repository is pre-configured for Vercel deployment via `vercel.json` at the project root.

### Deployment Steps:
1. Push your code to your GitHub / GitLab repository.
2. Import the repository in your **Vercel Dashboard**.
3. Set **Framework Preset** to `Vite`.
4. Set **Build Command** to `npm run build`.
5. Set **Output Directory** to `frontend/dist`.
6. Add the environment variables (`MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`) in Vercel settings.
7. Click **Deploy**. Vercel will automatically build the frontend assets and host the Express backend as serverless functions under `/api/*`.

---

## 🧪 Testing Account

For automated and manual verification, you can use the built-in registration flow or test with:

- **Email:** `childhelp.test2026@gmail.com`
- **Password:** `Test@12345`
- **Role:** `student`

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user (Student / Mentor) | Public |
| `POST` | `/api/auth/login` | Authenticate user & get JWT token | Public |
| `GET` | `/api/auth/profile` | Get current user profile | Bearer Token |
| `GET` | `/api/materials` | List all study materials | Bearer Token |
| `GET` | `/api/materials/:id` | Get details of a single material | Bearer Token |
| `GET` | `/api/quizzes` | List all available quizzes | Bearer Token |
| `GET` | `/api/quizzes/:id` | Get quiz details & questions | Bearer Token |
| `POST` | `/api/quizzes/:id/submit` | Submit answers & return evaluated score | Bearer Token |
| `GET` | `/api/quiz-attempts/my` | Get current student's quiz attempt history | Bearer Token |
| `GET` | `/api/progress/all` | Get overall learning progress statistics | Bearer Token |
